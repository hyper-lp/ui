'use client'

import { useLoginWithOAuth, usePrivy } from '@privy-io/react-auth'
import { cn } from '@/utils'
import { IconIds } from '@/enums'
import IconWrapper from '../icons/IconWrapper'
import { useState } from 'react'
import { SITE_NAME } from '@/config/app.config'

interface WaitlistButtonProps {
    className?: string
    onSuccess?: () => void
}

export function WaitlistButton({ className, onSuccess }: WaitlistButtonProps) {
    const { ready, authenticated, user } = usePrivy()
    const { initOAuth } = useLoginWithOAuth()
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async () => {
        if (!ready) return

        setIsLoading(true)
        try {
            await initOAuth({ provider: 'twitter' })
            if (onSuccess) {
                onSuccess()
            }
        } catch (error) {
            console.error('Login failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (!ready) {
        return (
            <button
                disabled
                className={cn(
                    'bg-background/200 flex items-center justify-center gap-3 rounded-lg px-6 py-3 text-sm font-medium text-default opacity-50',
                    className,
                )}
            >
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-default/20 border-t-transparent" />
                Loading...
            </button>
        )
    }

    if (authenticated && user) {
        return (
            <div
                className={cn(
                    'flex items-center justify-center gap-3 rounded-lg bg-primary/20 px-6 py-3 text-center text-sm text-default',
                    className,
                )}
            >
                <IconWrapper id={IconIds.CHECKMARK} className="h-5 w-5 text-primary" />
                <span>Joined as @{user.twitter?.username || 'User'}</span>
            </div>
        )
    }

    return (
        <button
            onClick={handleLogin}
            disabled={isLoading}
            className={cn(
                'flex items-center justify-center gap-3 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-background transition-all hover:bg-primary/80 disabled:opacity-50',
                className,
            )}
        >
            {isLoading ? (
                <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-default/20 border-t-transparent" />
                    <span>Connecting...</span>
                </>
            ) : (
                <div className="flex items-center gap-1">
                    <p>
                        Join
                        <span className="mx-1 font-bold">{SITE_NAME}</span>
                        waitlist
                    </p>
                    <IconWrapper id={IconIds.X} className="size-5" />
                </div>
            )}
        </button>
    )
}
