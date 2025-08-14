'use client'

interface DeltaBreakdownProps {
    lpDelta: number
    perpDelta: number
    spotDelta: number
    hyperEvmDelta: number
    netDelta: number
}

export function DeltaBreakdown({ lpDelta, perpDelta, spotDelta, hyperEvmDelta, netDelta }: DeltaBreakdownProps) {
    const formatNumber = (num: number, decimals = 2) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(num)
    }

    const formatDelta = (num: number, decimals = 4) => {
        const sign = num >= 0 ? '+' : ''
        return `${sign}${formatNumber(Math.abs(num), decimals)} HYPE`
    }

    const getDeltaColor = (num: number) => {
        if (Math.abs(num) < 0.01) return 'text-gray-600'
        return num >= 0 ? 'text-green-600' : 'text-red-600'
    }

    return (
        <div className="border p-4">
            <h3 className="mb-2 font-semibold">Delta Exposure (HYPE Units)</h3>
            <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-5">
                <div title="HYPE tokens in LP positions">
                    <span className="text-gray-600">LP Delta:</span>
                    <div className={`font-mono font-semibold ${getDeltaColor(lpDelta)}`}>{formatDelta(lpDelta)}</div>
                </div>
                <div title="HYPE perp position size (negative = short)">
                    <span className="text-gray-600">Perp Delta:</span>
                    <div className={`font-mono font-semibold ${getDeltaColor(perpDelta)}`}>{formatDelta(perpDelta)}</div>
                </div>
                <div title="HYPE tokens held in spot">
                    <span className="text-gray-600">Spot Delta:</span>
                    <div className={`font-mono font-semibold ${getDeltaColor(spotDelta)}`}>{formatDelta(spotDelta)}</div>
                </div>
                <div title="HYPE tokens held in HyperEVM">
                    <span className="text-gray-600">EVM Delta:</span>
                    <div className={`font-mono font-semibold ${getDeltaColor(hyperEvmDelta)}`}>{formatDelta(hyperEvmDelta)}</div>
                </div>
                <div title="Net HYPE exposure in tokens">
                    <span className="font-semibold text-gray-600">Net Delta:</span>
                    <div className={`font-mono text-lg font-bold ${getDeltaColor(netDelta)}`}>{formatDelta(netDelta)}</div>
                </div>
            </div>
            <div className="mt-3 border-t pt-3 text-xs text-gray-600">
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
