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
                    <div className="font-semibold">HYPE Δ</div>
                    <div className="space-y-0.5">
                        <div className="flex justify-between gap-4">
                            <span>= Amount</span>
                            <span className="">
                                {delta >= 0 ? '+' : ''}
                                {delta} HYPE
                            </span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span>* HYPE Price</span>
                            <span className="">{formatUSD(hypePrice)}</span>
                        </div>
                        <div className="flex justify-between gap-4 border-t border-default/10 pt-1">
                            <span>= USD Value</span>
                            <span className="">{formatUSD(Math.abs(delta * hypePrice))}</span>
                        </div>
                    </div>
                </div>
            }
        >
            {children || <span className={`cursor-help font-medium ${getDeltaColor(delta)} ${className}`}>{formatDelta(delta, decimals)}</span>}
        </StyledTooltip>
    )
}
