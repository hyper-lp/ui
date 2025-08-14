'use client'

import { cn } from '@/utils'

export function AccountCard({ children, className, hoverable = false }: { children: React.ReactNode; className?: string; hoverable?: boolean }) {
    return (
        <div
            className={cn(
                'flex flex-col gap-1 rounded-xl bg-default/20 p-5 transition-colors duration-300',
                hoverable && 'hover:bg-default/50',
                className,
            )}
        >
            {children}
        </div>
    )
}
