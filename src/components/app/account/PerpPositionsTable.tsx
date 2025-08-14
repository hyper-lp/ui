'use client'

import type { PerpPosition } from '@/interfaces'

interface PerpPositionsTableProps {
    positions: PerpPosition[]
}

export function PerpPositionsTable({ positions }: PerpPositionsTableProps) {
    const formatNumber = (num: number, decimals = 2) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(num)
    }

    if (!positions || positions.length === 0) return null

    return (
        <div className="space-y-2">
            <h2 className="text-xl font-semibold">Perpetual Positions ({positions.length})</h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border text-sm">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border p-2 text-left">Asset</th>
                            <th className="border p-2 text-right">Size</th>
                            <th className="border p-2 text-right">Entry Price</th>
                            <th className="border p-2 text-right">Mark Price</th>
                            <th className="border p-2 text-right">Notional Value</th>
                            <th className="border p-2 text-right">Unrealized PnL</th>
                            <th className="border p-2 text-right">Funding Paid</th>
                            <th className="border p-2 text-right">Margin Used</th>
                        </tr>
                    </thead>
                    <tbody>
                        {positions.map((position) => (
                            <tr key={position.id}>
                                <td className="border p-2 font-semibold">{position.asset}</td>
                                <td className={`border p-2 text-right font-mono ${position.size > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatNumber(position.size, 4)}
                                </td>
                                <td className="border p-2 text-right font-mono">${formatNumber(position.entryPrice)}</td>
                                <td className="border p-2 text-right font-mono">${formatNumber(position.markPrice)}</td>
                                <td className="border p-2 text-right font-mono">${formatNumber(position.notionalValue)}</td>
                                <td className={`border p-2 text-right font-mono ${position.unrealizedPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ${formatNumber(position.unrealizedPnl)}
                                </td>
                                <td className="border p-2 text-right font-mono">${formatNumber(position.fundingPaid)}</td>
                                <td className="border p-2 text-right font-mono">${formatNumber(position.marginUsed)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
