'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useState, useEffect, memo, useCallback } from 'react'
import { cn } from '@/utils'
import { toast } from 'react-hot-toast'
import { IconIds } from '@/enums'
import IconWrapper from '../icons/IconWrapper'
import Image from 'next/image'
import { generateReferralUrl } from '@/utils/referral.util'

interface WaitlistFormProps {
    className?: string
}

function WaitlistFormComponent({ className }: WaitlistFormProps) {
    const { ready, authenticated, user, logout } = usePrivy()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [position, setPosition] = useState<number | null>(null)
    const [referralCount, setReferralCount] = useState(0)
    const [referralUrl, setReferralUrl] = useState<string | null>(null)
    const [copySuccess, setCopySuccess] = useState(false)
    const [isAutoJoining, setIsAutoJoining] = useState(false)
    const [referredBy, setReferredBy] = useState<string | null>(null)

    const checkWaitlistStatus = useCallback(async () => {
        try {
            const response = await fetch('/api/waitlist/status', {
                headers: {
                    'x-twitter-id': user?.twitter?.subject || '',
                },
            })
            if (response.ok) {
                const data = await response.json()
                if (data.isOnWaitlist) {
                    setIsSubmitted(true)
                    setPosition(data.position)
                    setReferralCount(data.referralCount)
                    setReferredBy(data.referredBy || null)
                    if (user?.twitter?.subject) {
                        const url = generateReferralUrl(user.twitter.subject, window.location.origin)
                        setReferralUrl(url)
                    }
                    return true // User is already on waitlist
                }
                return false // User is not on waitlist
            }
        } catch (error) {
            console.error('Failed to check waitlist status:', error)
        }
        return false
    }, [user])

    // Auto-join waitlist after authentication
    const autoJoinWaitlist = useCallback(async () => {
        if (!user?.twitter || isSubmitting || isSubmitted || isAutoJoining) return

        setIsAutoJoining(true)
        try {
            // Get referral code from URL if present
            const urlParams = new URLSearchParams(window.location.search)
            const referralCode = urlParams.get('ref')
            console.log('[WaitlistForm] Auto-joining with referral code:', referralCode)

            const response = await fetch('/api/waitlist/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    twitterId: user.twitter.subject,
                    twitterHandle: user.twitter.username || '',
                    twitterName: user.twitter.name || null,
                    twitterAvatar: user.twitter.profilePictureUrl || null,
                    email: null,
                    referralCode,
                }),
            })

            if (response.ok) {
                const data = await response.json()
                setIsSubmitted(true)
                setPosition(data.position)
                setReferralCount(data.referralCount || 0)
                setReferredBy(data.referredBy || null)
                if (user?.twitter?.subject) {
                    const url = generateReferralUrl(user.twitter.subject, window.location.origin)
                    setReferralUrl(url)
                    console.log('Your referral URL:', url)
                    console.log('Your Twitter ID:', user.twitter.subject)
                }
                if (referralCode) {
                    console.log('You were referred with code:', referralCode)
                    console.log('Referred by:', data.referredBy || 'NOT SET - CHECK LOGS')
                }
                toast.success('Successfully joined the waitlist!')
            }
        } catch (error) {
            console.error('Auto-join failed:', error)
            toast.error('Failed to join waitlist automatically. Please try again.')
        } finally {
            setIsAutoJoining(false)
        }
    }, [user, isSubmitting, isSubmitted, isAutoJoining])

    useEffect(() => {
        if (authenticated && user?.twitter) {
            checkWaitlistStatus().then((alreadyOnWaitlist) => {
                if (!alreadyOnWaitlist) {
                    console.log('[WaitlistForm] User authenticated but not on waitlist, auto-joining...')
                    autoJoinWaitlist()
                }
            })
        }
    }, [authenticated, user, checkWaitlistStatus, autoJoinWaitlist])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user?.twitter) return

        setIsSubmitting(true)
        try {
            // Get referral code from URL if present
            const urlParams = new URLSearchParams(window.location.search)
            const referralCode = urlParams.get('ref')
            console.log('[WaitlistForm] Referral code from URL:', referralCode)
            console.log('[WaitlistForm] Full URL:', window.location.href)

            const response = await fetch('/api/waitlist/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    twitterId: user.twitter.subject,
                    twitterHandle: user.twitter.username || '',
                    twitterName: user.twitter.name || null,
                    twitterAvatar: user.twitter.profilePictureUrl || null,
                    email: null,
                    referralCode,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to join waitlist')
            }

            const data = await response.json()
            setIsSubmitted(true)
            setPosition(data.position)
            setReferralCount(data.referralCount || 0)
            setReferredBy(data.referredBy || null)
            if (user?.twitter?.subject) {
                const url = generateReferralUrl(user.twitter.subject, window.location.origin)
                setReferralUrl(url)
            }
            toast.success('Successfully joined the waitlist!')
        } catch (error) {
            toast.error('Failed to join waitlist. Please try again.')
            console.error('Waitlist submission failed:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!ready || !authenticated || !user?.twitter) {
        return <div className="h-10 w-40 skeleton-loading" />
    }

    if (isSubmitted) {
        return (
            <div className={cn('rounded-xl border border-default/20 bg-background/5 px-3 py-2.5', className)}>
                <div className="flex items-center justify-between gap-8">
                    {/* Left: Checkmark and waitlist confirmation */}
                    <div className="flex items-center gap-2">
                        <IconWrapper id={IconIds.CHECKMARK} className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="flex flex-col">
                            <p className="text-sm font-medium text-default">
                                {user.twitter.name} #{position || '...'} on the waitlist
                            </p>
                            {referredBy && <p className="text-xs text-default/60">Referred by @{referredBy}</p>}
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                        {/* Copy referral link */}
                        <button
                            onClick={() => {
                                const url =
                                    referralUrl || (user.twitter?.subject ? generateReferralUrl(user.twitter.subject, window.location.origin) : '')
                                navigator.clipboard.writeText(url)
                                setCopySuccess(true)
                                toast.success(`Referral link copied: ${url}`)
                                console.log('Referral URL copied:', url)
                                setTimeout(() => setCopySuccess(false), 2000)
                            }}
                            className="flex items-center gap-1.5 text-xs text-default/60 hover:text-default transition-colors group"
                            title={`${referralCount} referrals | Click to copy your referral link`}
                        >
                            <span>Referral</span>
                            {referralCount > 0 && <span className="text-primary">({referralCount})</span>}
                            <IconWrapper
                                id={copySuccess ? IconIds.CHECKMARK : IconIds.COPY}
                                className="h-3.5 w-3.5 group-hover:text-primary transition-colors"
                            />
                        </button>

                        {/* Separator */}
                        <div className="w-px h-4 bg-default/20" />

                        {/* Sign out */}
                        <button onClick={logout} className="text-xs text-default/60 hover:text-default transition-colors">
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Show loading state while auto-joining
    if (isAutoJoining) {
        return (
            <div className={cn('rounded-xl border border-default/20 bg-background/5 px-3 py-2.5', className)}>
                <div className="flex items-center gap-3">
                    {user.twitter.profilePictureUrl ? (
                        <Image
                            src={user.twitter.profilePictureUrl}
                            alt={user.twitter.username || 'Profile'}
                            className="h-10 w-10 rounded-full"
                            width={40}
                            height={40}
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-background/20" />
                    )}
                    <div className="flex flex-col gap-0">
                        <p className="text-sm text-default">Joining waitlist...</p>
                        <p className="text-xs text-default/60">@{user.twitter.username}</p>
                    </div>
                    <div className="ml-auto">
                        <div className="h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                </div>
            </div>
        )
    }

    // Fallback form (should rarely be shown due to auto-join)
    return (
        <form
            onSubmit={handleSubmit}
            className={cn('rounded-xl border border-default/20 bg-background/5 px-2 py-1.5 flex gap-10 items-center', className)}
        >
            <div className="flex items-center gap-3">
                {user.twitter.profilePictureUrl ? (
                    <Image
                        src={user.twitter.profilePictureUrl}
                        alt={user.twitter.username || 'Profile'}
                        className="h-10 w-10 rounded-full"
                        width={40}
                        height={40}
                    />
                ) : (
                    <div className="h-12 w-12 rounded-full bg-background/20" />
                )}
                <div className="flex flex-col gap-0">
                    <p className="font-sm truncate max-w-[90px] text-default">{user.twitter.name}</p>
                    <p className="text-xs text-default/60 truncate max-w-[90px]">@{user.twitter.username}</p>
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-background transition-colors hover:bg-primary/80 disabled:opacity-50"
                >
                    {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                </button>
                <button
                    type="button"
                    onClick={logout}
                    className="rounded-lg border border-default/20 px-4 py-1.5 text-sm text-default hover:bg-background/10"
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}

export const WaitlistForm = memo(WaitlistFormComponent)
