'use client'

import { useState } from 'react'
import { IconIds } from '@/enums'
import IconWrapper from '@/components/icons/IconWrapper'
import { AccountCard } from './layout/AccountCard'
import { ReactNode } from 'react'

interface CollapsibleSectionProps {
    title: string
    children?: ReactNode
    defaultExpanded?: boolean
    headerRight?: ReactNode
    isLoading?: boolean
}

export function CollapsibleSection({ title, children, defaultExpanded = false, headerRight, isLoading = false }: CollapsibleSectionProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded)

    return (
        <AccountCard padding="p-0">
            {/* header */}
            <div className="flex items-center justify-between p-2">
                <button onClick={() => setIsExpanded(!isExpanded)} className="flex flex-1 items-center gap-2 text-left">
                    <IconWrapper id={isExpanded ? IconIds.CHEVRON_DOWN : IconIds.CHEVRON_RIGHT} className="size-5 text-default/50" />
                    <h3 className="text-lg font-semibold">{title}</h3>
                </button>
                {isLoading ? <div className="h-4 w-24 animate-pulse rounded bg-default/20" /> : headerRight}
            </div>

            {/* content */}
            {isExpanded &&
                (isLoading ? (
                    <div className="space-y-2 p-4">
                        <div className="h-4 w-full animate-pulse rounded bg-default/20" />
                        <div className="h-4 w-3/4 animate-pulse rounded bg-default/20" />
                        <div className="h-4 w-5/6 animate-pulse rounded bg-default/20" />
                    </div>
                ) : (
                    children
                ))}
        </AccountCard>
    )
}
