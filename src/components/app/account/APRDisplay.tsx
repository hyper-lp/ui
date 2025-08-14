'use client'

interface APRDisplayProps {
    lastSnapshot?: {
        timestamp: string | Date
        netAPR: number
        lpFeeAPR: number
        fundingAPR: number
    } | null
    currentAPR?: {
        lpFeeAPR: number
        fundingAPR: number
        netAPR: number
        formula: string
        note: string
    } | null
}

export function APRDisplay({ lastSnapshot, currentAPR }: APRDisplayProps) {
    const formatPercent = (num: number) => {
        return `${(num * 100).toFixed(2)}%`
    }

    if (!lastSnapshot && !currentAPR) return null

    return (
        <div className="border p-4">
            <h3 className="mb-2 font-semibold">Current APRs</h3>
            {lastSnapshot ? (
                <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                    <div>LP Fee APR: {formatPercent(lastSnapshot.lpFeeAPR)}</div>
                    <div>Funding APR: {formatPercent(lastSnapshot.fundingAPR)}</div>
                    <div className="font-semibold">Net APR: {formatPercent(lastSnapshot.netAPR)}</div>
                    <div className="text-gray-600">Updated: {new Date(lastSnapshot.timestamp).toLocaleString()}</div>
                </div>
            ) : currentAPR ? (
                <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
                        <div>LP Fee APR: {formatPercent(currentAPR.lpFeeAPR)}</div>
                        <div>Funding APR: {formatPercent(currentAPR.fundingAPR)}</div>
                        <div className="font-semibold">Net APR: {formatPercent(currentAPR.netAPR)}</div>
                    </div>
                    <div className="border-t pt-2 text-xs text-gray-600">
                        <div className="rounded bg-gray-100 p-2 font-mono">{currentAPR.formula}</div>
                        <div className="mt-1">{currentAPR.note}</div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}
