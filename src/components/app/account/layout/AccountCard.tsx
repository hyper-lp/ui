'use client'

import { cn } from '@/utils'

export function AccountCard({
    children,
    className,
    hoverable = false,
    padding = 'p-2',
    isLoading = false,
}: {
    children?: React.ReactNode
    className?: string
    hoverable?: boolean
    padding?: string
    isLoading?: boolean
}) {
    return (
        <div
            className={cn(
                'flex flex-col gap-1 rounded-lg border border-hl-light/40 bg-hl-light/5 transition-colors duration-300 ease-in-out hover:border-hl-light hover:bg-hl-light/10',
                hoverable && 'hover:bg-default/50',
                className,
                padding,
            )}
        >
            {isLoading ? (
                <div className="space-y-2">
                    <div className="h-3 w-20 animate-pulse rounded bg-default/20" />
                    <div className="h-6 w-32 animate-pulse rounded bg-default/20" />
                    <div className="h-3 w-24 animate-pulse rounded bg-default/20" />
                </div>
            ) : (
                children
            )}
        </div>
    )
}
