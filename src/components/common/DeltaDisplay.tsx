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
export function DeltaDisplay({ delta, hypePrice, decimals = 1, iconSize = 20, className = 'text-sm font-medium' }: DeltaDisplayProps) {
    return (
        <div className="flex items-center gap-1">
            <HypeDeltaTooltip delta={delta} hypePrice={hypePrice} decimals={decimals} className={className} />
            <HypeIcon size={iconSize} />
            <span className={`${className} ${delta >= 0 ? 'text-green-500' : 'text-red-500'}`}>HYPE</span>
        </div>
    )
}
