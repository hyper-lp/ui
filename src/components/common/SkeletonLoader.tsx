'use client'

import { cn } from '@/utils'

interface SkeletonProps {
    className?: string
    animate?: boolean
}

export function Skeleton({ className, animate = true }: SkeletonProps) {
    return <div className={cn('rounded bg-default/10', animate && 'animate-pulse', className)} />
}

export function CardSkeleton() {
    return (
        <div className="space-y-3 rounded-lg border border-default/20 p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
        </div>
    )
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
    return (
        <div className="flex items-center justify-between border-b border-default/10 py-2">
            {Array.from({ length: columns }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-16" />
            ))}
        </div>
    )
}

export function SectionSkeleton({ title, rows = 3 }: { title: string; rows?: number }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">{title}</h3>
                <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-1">
                {Array.from({ length: rows }).map((_, i) => (
                    <TableRowSkeleton key={i} />
                ))}
            </div>
        </div>
    )
}
