'use client'

import { formatNumber, getDeltaColor } from '@/utils/format.util'

interface DeltaBreakdownProps {
    lpDelta: number
    perpDelta: number
    spotDelta: number
    hyperEvmDelta: number
    netDelta: number
}

export function DeltaBreakdown({ lpDelta, perpDelta, spotDelta, hyperEvmDelta, netDelta }: DeltaBreakdownProps) {
    const formatDeltaWithSymbol = (num: number, decimals = 4) => {
        const sign = num >= 0 ? '+' : ''
        return `${sign}${formatNumber(Math.abs(num), decimals)} HYPE`
    }

    return (
        <div className="border p-4">
            <h3 className="mb-2 font-semibold">Delta Exposure (HYPE Units)</h3>
            <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-5">
                <div title="HYPE tokens in LP positions">
                    <span className="text-default/50">LP Delta:</span>
                    <div className={`font-mono font-semibold ${getDeltaColor(lpDelta)}`}>{formatDeltaWithSymbol(lpDelta)}</div>
                </div>
                <div title="HYPE perp position size (negative = short)">
                    <span className="text-default/50">Perp Delta:</span>
                    <div className={`font-mono font-semibold ${getDeltaColor(perpDelta)}`}>{formatDeltaWithSymbol(perpDelta)}</div>
                </div>
                <div title="HYPE tokens held in spot">
                    <span className="text-default/50">Spot Delta:</span>
                    <div className={`font-mono font-semibold ${getDeltaColor(spotDelta)}`}>{formatDeltaWithSymbol(spotDelta)}</div>
                </div>
                <div title="HYPE tokens held in HyperEVM">
                    <span className="text-default/50">EVM Delta:</span>
                    <div className={`font-mono font-semibold ${getDeltaColor(hyperEvmDelta)}`}>{formatDeltaWithSymbol(hyperEvmDelta)}</div>
                </div>
                <div title="Net HYPE exposure in tokens">
                    <span className="font-semibold text-default/50">Net Delta:</span>
                    <div className={`font-mono text-lg font-bold ${getDeltaColor(netDelta)}`}>{formatDeltaWithSymbol(netDelta)}</div>
                </div>
            </div>
            <div className="mt-3 border-t pt-3 text-xs text-default/50">
                <div>Formula: Net Delta = LP Delta + Perp Delta + Spot Delta + EVM Delta (all in HYPE units)</div>
                <div className="mt-1">
                    {Math.abs(netDelta) < 10 && <span className="text-green-600">✓ Near delta neutral</span>}
                    {Math.abs(netDelta) >= 10 && Math.abs(netDelta) < 50 && <span className="text-yellow-600">⚠ Moderate delta exposure</span>}
                    {Math.abs(netDelta) >= 50 && <span className="text-red-600">⚠ High delta exposure - rebalance needed</span>}
                </div>
                {perpDelta >= 0 && lpDelta > 0 && (
                    <div className="mt-1 font-semibold text-red-600">
                        ⚠ WARNING: Perp position is not hedging LP exposure! Expected negative perp delta for short hedge.
                    </div>
                )}
            </div>
        </div>
    )
}
