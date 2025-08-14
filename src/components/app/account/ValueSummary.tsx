'use client'

interface ValueSummaryProps {
    totalValue: number
    totalLpValue: number
    totalPerpValue: number
    totalSpotValue: number
    totalHyperEvmValue: number
}

export function ValueSummary({ totalValue, totalLpValue, totalPerpValue, totalSpotValue, totalHyperEvmValue }: ValueSummaryProps) {
    const formatNumber = (num: number, decimals = 2) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(num)
    }

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="border p-3">
                <div className="text-sm text-gray-600">Total Value</div>
                <div className="font-mono">${formatNumber(totalValue)}</div>
            </div>
            <div className="border p-3">
                <div className="text-sm text-gray-600">LP Value</div>
                <div className="font-mono">${formatNumber(totalLpValue)}</div>
            </div>
            <div className="border p-3">
                <div className="text-sm text-gray-600">Perp Value</div>
                <div className="font-mono">${formatNumber(totalPerpValue)}</div>
            </div>
            <div className="border p-3">
                <div className="text-sm text-gray-600">Spot Value</div>
                <div className="font-mono">${formatNumber(totalSpotValue)}</div>
            </div>
            <div className="border p-3">
                <div className="text-sm text-gray-600">HyperEVM Value</div>
                <div className="font-mono">${formatNumber(totalHyperEvmValue)}</div>
            </div>
        </div>
    )
}
