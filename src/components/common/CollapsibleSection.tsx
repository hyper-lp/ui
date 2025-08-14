'use client'

import { useAppStore } from '@/stores/app.store'
import IconWrapper from '@/components/icons/IconWrapper'
import { IconIds } from '@/enums'
import { cn } from '@/utils'

type SectionKey = 'charts' | 'summary' | 'hyperEvm' | 'hyperCore' | 'transactions' | 'debug'

interface CollapsibleSectionProps {
    title: string
    sectionKey: SectionKey
    children: React.ReactNode
    className?: string
    headerClassName?: string
    contentClassName?: string
    badge?: string | number
    subtitle?: string
    lastRefresh?: string
}

export function CollapsibleSection({
    title,
    sectionKey,
    children,
    className,
    headerClassName,
    contentClassName,
    badge,
    subtitle,
    lastRefresh,
}: CollapsibleSectionProps) {
    const { sectionStates, toggleSection } = useAppStore()
    const isOpen = sectionStates[sectionKey]

    return (
        <div className={cn('rounded-lg border', className)}>
            <button
                onClick={() => toggleSection(sectionKey)}
                className={cn('flex w-full items-center justify-between p-4 transition-colors hover:bg-gray-50', headerClassName)}
            >
                <div className="flex items-center gap-3">
                    <IconWrapper id={isOpen ? IconIds.CHEVRON_DOWN : IconIds.CHEVRON_RIGHT} className="h-5 w-5 text-gray-600" />
                    <div className="text-left">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold">{title}</h2>
                            {badge !== undefined && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium">{badge}</span>}
                            {lastRefresh && <span className="text-xs text-gray-500">• {lastRefresh}</span>}
                        </div>
                        {subtitle && <p className="mt-0.5 text-sm text-gray-600">{subtitle}</p>}
                    </div>
                </div>
            </button>

            {isOpen && <div className={cn('border-t p-4', contentClassName)}>{children}</div>}
        </div>
    )
}
