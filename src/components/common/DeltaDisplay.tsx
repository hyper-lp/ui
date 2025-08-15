'use client'

import { HypeIcon } from './HypeIcon'
import { HypeDeltaTooltip } from './HypeDeltaTooltip'

interface DeltaDisplayProps {
    delta: number
    hypePrice: number
    decimals?: number
    iconSize?: number
    className?: string
}

/**
 * Reusable component that displays HYPE icon + delta with tooltip
 * Used throughout account page for consistent delta display
 */
export function DeltaDisplay({ delta, hypePrice, decimals = 1, iconSize = 14, className = 'text-sm font-medium' }: DeltaDisplayProps) {
    return (
        <div className="flex items-center gap-2">
            <HypeIcon size={iconSize} />
            <HypeDeltaTooltip delta={delta} hypePrice={hypePrice} decimals={decimals} className={className} />
        </div>
    )
}
