import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decodeReferralCode } from '@/utils/referral.util'
import { checkRateLimit } from '@/utils/rate-limit.util'
import { getClientIp, isValidTwitterId, isValidTwitterHandle, sanitizeInput } from '@/utils/validation.util'
import { requireTwitterAuth } from '@/lib/privy-server'

export async function POST(request: NextRequest) {
    try {
        // Get IP for rate limiting
        const clientIp = getClientIp(request)

        // Rate limit by IP
        if (!checkRateLimit(`ip:${clientIp}`, 10, 300000)) {
            // 10 requests per 5 minutes
            return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
        }

        const body = await request.json()
        const { referralCode } = body

        // Verify authentication and get Twitter account
        const twitterAccount = await requireTwitterAuth(request)
        if (!twitterAccount) {
            // Fallback to body data for backward compatibility
            const { twitterId, twitterHandle, twitterName, twitterAvatar, email } = body

            if (!twitterId || !twitterHandle) {
                return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
            }

            // Validate inputs
            if (!isValidTwitterId(twitterId)) {
                return NextResponse.json({ error: 'Invalid Twitter ID format' }, { status: 400 })
            }
            if (!isValidTwitterHandle(twitterHandle)) {
                return NextResponse.json({ error: 'Invalid Twitter handle format' }, { status: 400 })
            }

            // Use body data if no auth token (development mode)
            const account = {
                id: twitterId,
                username: twitterHandle,
                name: sanitizeInput(twitterName, 100),
                profilePictureUrl: sanitizeInput(twitterAvatar, 500),
            }

            return handleWaitlistJoin(request, account, email, referralCode)
        }

        // Use authenticated Twitter account
        return handleWaitlistJoin(request, twitterAccount, null, referralCode)
    } catch (error) {
        // Log error securely without exposing details
        console.error('Waitlist join error:', error instanceof Error ? error.message : 'Unknown error')

        // Check for specific Prisma errors
        if (error && typeof error === 'object' && 'code' in error) {
            if (error.code === 'P2002') {
                // Unique constraint violation
                return NextResponse.json({ error: 'This account is already registered' }, { status: 400 })
            }
        }

        return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 })
    }
}

/**
 * Handle the actual waitlist join logic
 */
async function handleWaitlistJoin(
    request: NextRequest,
    twitterAccount: { id: string; username: string; name: string | null; profilePictureUrl: string | null },
    email: string | null,
    referralCode?: string,
) {
    try {
        const { id: twitterId, username: twitterHandle, name: twitterName, profilePictureUrl: twitterAvatar } = twitterAccount

        // Validate Twitter account
        if (!twitterId || !twitterHandle) {
            return NextResponse.json({ error: 'Invalid Twitter account' }, { status: 400 })
        }

        // Validate Twitter ID format (should be numeric string)
        if (!/^\d+$/.test(twitterId) || twitterId.length < 5 || twitterId.length > 20) {
            return NextResponse.json({ error: 'Invalid Twitter ID format' }, { status: 400 })
        }

        // Validate Twitter handle format
        if (!/^[A-Za-z0-9_]{1,15}$/.test(twitterHandle)) {
            return NextResponse.json({ error: 'Invalid Twitter handle format' }, { status: 400 })
        }

        // Sanitize inputs to prevent injection
        const sanitizedHandle = twitterHandle.replace(/[^A-Za-z0-9_]/g, '')
        const sanitizedName = twitterName ? twitterName.slice(0, 100) : null
        const sanitizedEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email.toLowerCase() : null

        // Rate limit by Twitter ID (prevent spam from same account)
        if (!checkRateLimit(`twitter:${twitterId}`, 3, 3600000)) {
            // 3 attempts per hour
            return NextResponse.json({ error: 'This account has too many recent attempts' }, { status: 429 })
        }

        // Check if user is already on waitlist
        const existingEntry = await prisma.waitlist.findUnique({
            where: { twitterId },
        })

        if (existingEntry) {
            return NextResponse.json({
                message: 'Already on waitlist',
                position: existingEntry.position,
                referralCount: existingEntry.referralCount,
            })
        }

        // Additional check: prevent multiple accounts with same email
        if (sanitizedEmail) {
            const emailExists = await prisma.waitlist.findFirst({
                where: { email: sanitizedEmail },
            })
            if (emailExists) {
                return NextResponse.json({ error: 'This email is already registered' }, { status: 400 })
            }
        }

        // Validate referrer if provided
        let referredBy = null
        if (referralCode && typeof referralCode === 'string' && referralCode.length > 0) {
            console.log(`[Referral] Processing referral code: ${referralCode} for user: ${twitterHandle}`)

            // Sanitize referral code
            const sanitizedCode = referralCode.slice(0, 50).replace(/[^a-zA-Z0-9]/g, '')
            console.log(`[Referral] Sanitized code: ${sanitizedCode}`)

            // Decode the referral code to get Twitter ID
            const referrerTwitterId = decodeReferralCode(sanitizedCode)
            console.log(`[Referral] Decoded Twitter ID: ${referrerTwitterId || 'FAILED TO DECODE'}`)

            // Validate decoded Twitter ID
            if (!referrerTwitterId || referrerTwitterId === '') {
                console.warn(`[Referral] Failed to decode referral code: ${sanitizedCode}`)
            } else if (!/^\d+$/.test(referrerTwitterId) || referrerTwitterId.length < 5 || referrerTwitterId.length > 20) {
                // Invalid referral code, ignore but don't block registration
                console.warn(`[Referral] Invalid Twitter ID format from referral code. Code: ${sanitizedCode}, Decoded ID: ${referrerTwitterId}`)
            } else if (referrerTwitterId === twitterId) {
                // Log self-referral attempt
                console.warn(`[Referral] Self-referral attempt blocked for Twitter ID: ${twitterId}`)
            } else {
                console.log(`[Referral] Looking up referrer with Twitter ID: ${referrerTwitterId}`)

                // Check if referrer exists and hasn't hit referral limits
                const referrer = await prisma.waitlist.findFirst({
                    where: { twitterId: referrerTwitterId },
                })

                if (referrer) {
                    console.log(`[Referral] Found referrer: @${referrer.twitterHandle}`)

                    // Check referral limit (prevent gaming)
                    if (referrer.referralCount >= 100) {
                        console.warn(`[Referral] Referral limit reached for Twitter ID: ${referrerTwitterId}`)
                    } else {
                        // Check for circular referrals
                        if (referrer.referredBy === sanitizedHandle) {
                            console.warn(`[Referral] Circular referral detected: ${twitterId} <-> ${referrerTwitterId}`)
                        } else {
                            referredBy = referrer.twitterHandle
                            console.log(`[Referral] Setting referredBy to: @${referredBy}`)

                            // Use transaction to ensure atomicity
                            await prisma.$transaction([
                                prisma.waitlist.update({
                                    where: { twitterId: referrer.twitterId },
                                    data: { referralCount: { increment: 1 } },
                                }),
                            ])
                            console.log(`[Referral] Successfully incremented referral count for @${referrer.twitterHandle}`)
                        }
                    }
                } else {
                    console.warn(`[Referral] Referrer not found in database. Twitter ID: ${referrerTwitterId}`)
                }
            }
        } else {
            console.log(`[Referral] No referral code provided for user: ${twitterHandle}`)
        }

        // Add to waitlist with sanitized data
        const newEntry = await prisma.waitlist.create({
            data: {
                twitterId,
                twitterHandle: sanitizedHandle,
                twitterName: sanitizedName,
                twitterAvatar: twitterAvatar?.startsWith('https://') ? twitterAvatar.slice(0, 500) : null,
                email: sanitizedEmail,
                referredBy,
            },
        })

        // Get total count to show position
        const totalCount = await prisma.waitlist.count()

        return NextResponse.json(
            {
                message: 'Successfully joined waitlist',
                position: newEntry.position,
                referralCount: 0,
                referredBy: newEntry.referredBy,
                totalCount,
            },
            { status: 201 },
        )
    } catch (error) {
        // Log error securely without exposing details
        console.error('Waitlist join error:', error instanceof Error ? error.message : 'Unknown error')

        // Check for specific Prisma errors
        if (error && typeof error === 'object' && 'code' in error) {
            if (error.code === 'P2002') {
                // Unique constraint violation
                return NextResponse.json({ error: 'This account is already registered' }, { status: 400 })
            }
        }

        return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 })
    }
}
