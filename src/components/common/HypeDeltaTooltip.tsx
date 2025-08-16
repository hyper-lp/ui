'use client'

import StyledTooltip from './StyledTooltip'
import { formatUSD, formatDelta, getDeltaColor } from '@/utils/format.util'

interface HypeDeltaTooltipProps {
    delta: number
    hypePrice: number // Now required
    className?: string
    decimals?: number
    children?: React.ReactNode
}

export function HypeDeltaTooltip({ delta, hypePrice, className, decimals = 1, children }: HypeDeltaTooltipProps) {
    return (
        <StyledTooltip
            content={
                <div className="space-y-1">
                    <div className="font-semibold">HYPE Delta Details</div>
                    <div className="space-y-0.5 text-sm">
                        <div className="flex justify-between gap-4">
                            <span>Amount:</span>
                            <span className="font-mono">
                                {delta >= 0 ? '+' : ''}
                                {delta} HYPE
                            </span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span>USD Value:</span>
                            <span className="font-mono">{formatUSD(Math.abs(delta * hypePrice))}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span>HYPE Price:</span>
                            <span className="font-mono">{formatUSD(hypePrice)}/HYPE</span>
                        </div>
                    </div>
                </div>
            }
        >
            {children || <span className={`cursor-help font-medium ${getDeltaColor(delta)} ${className}`}>{formatDelta(delta, decimals)}</span>}
        </StyledTooltip>
    )
}
