'use client'

import { cn } from '@/utils'

export function AccountCard({ children, className, hoverable = false }: { children: React.ReactNode; className?: string; hoverable?: boolean }) {
    return (
        <div
            className={cn(
                'flex flex-col gap-1 rounded-lg border border-hl-light/10 bg-hl-light/5 p-2 transition-colors duration-300',
                hoverable && 'hover:bg-default/50',
                className,
            )}
        >
            {children}
        </div>
    )
}
