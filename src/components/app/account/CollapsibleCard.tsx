'use client'

import { useState } from 'react'
import { IconIds } from '@/enums'
import IconWrapper from '@/components/icons/IconWrapper'
import { AccountCard } from './layout/AccountCard'
import { ReactNode } from 'react'

interface CollapsibleCardProps {
    title: string
    children: ReactNode
    defaultExpanded?: boolean
    headerRight?: ReactNode
}

export function CollapsibleCard({ title, children, defaultExpanded = false, headerRight }: CollapsibleCardProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded)

    return (
        <AccountCard>
            {/* header */}
            <div className="flex items-center justify-between">
                <button onClick={() => setIsExpanded(!isExpanded)} className="flex flex-1 items-center gap-2 text-left">
                    <IconWrapper id={isExpanded ? IconIds.CHEVRON_DOWN : IconIds.CHEVRON_RIGHT} className="size-5 text-default/50" />
                    <h3 className="text-lg font-semibold">{title}</h3>
                </button>
                {headerRight}
            </div>

            {/* content */}
            {isExpanded && children}
        </AccountCard>
    )
}
