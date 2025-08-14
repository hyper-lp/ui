import { NextResponse } from 'next/server'
import { prismaReferrals } from '@/lib/prisma-referrals'
import { headers } from 'next/headers'
import { env } from '@/env/t3-env'

// Rate limiting map
const statusRateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(identifier: string, maxRequests = 20, windowMs = 60000): boolean {
    // Skip rate limiting in development if disabled
    if (env.RATE_LIMIT_ENABLED !== 'true') {
        return true
    }

    const now = Date.now()
    const limit = statusRateLimitMap.get(identifier)

    if (!limit || now > limit.resetTime) {
        statusRateLimitMap.set(identifier, {
            count: 1,
            resetTime: now + windowMs,
        })
        return true
    }

    if (limit.count >= maxRequests) {
        return false
    }

    limit.count++
    return true
}

// Note: In production, you would verify the user's identity using Privy's server-side auth
// For now, we'll use a simple header-based approach with validation
export async function GET() {
    try {
        const headersList = await headers()
        const twitterId = headersList.get('x-twitter-id')

        // Get IP for rate limiting
        const forwardedFor = headersList.get('x-forwarded-for')
        const realIp = headersList.get('x-real-ip')
        const clientIp = forwardedFor?.split(',')[0] || realIp || 'unknown'

        // Rate limit by IP
        if (!checkRateLimit(`status:${clientIp}`, 30, 60000)) {
            // 30 requests per minute
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
        }

        if (!twitterId) {
            return NextResponse.json({ error: 'Twitter ID required' }, { status: 400 })
        }

        // Validate Twitter ID format
        if (!/^\d+$/.test(twitterId) || twitterId.length < 5 || twitterId.length > 20) {
            return NextResponse.json({ error: 'Invalid Twitter ID format' }, { status: 400 })
        }

        const waitlistEntry = await prismaReferrals.waitlist.findUnique({
            where: { twitterId },
        })

        if (!waitlistEntry) {
            return NextResponse.json({
                isOnWaitlist: false,
            })
        }

        return NextResponse.json({
            isOnWaitlist: true,
            position: waitlistEntry.position,
            approved: waitlistEntry.approved,
            joinedAt: waitlistEntry.createdAt,
            referralCount: waitlistEntry.referralCount,
            referredBy: waitlistEntry.referredBy,
        })
    } catch (error) {
        // Log error securely
        console.error('Waitlist status error:', error instanceof Error ? error.message : 'Unknown error')
        return NextResponse.json({ error: 'Failed to check waitlist status' }, { status: 500 })
    }
}
