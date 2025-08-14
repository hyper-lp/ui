'use client'

import type { SpotBalance } from '@/interfaces'

interface SpotBalancesTableProps {
    balances: SpotBalance[]
}

export function SpotBalancesTable({ balances }: SpotBalancesTableProps) {
    const formatNumber = (num: number, decimals = 2) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(num)
    }

    if (!balances || balances.length === 0) return null

    return (
        <div className="space-y-2">
            <h2 className="text-xl font-semibold">Spot Balances ({balances.length})</h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border text-sm">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border p-2 text-left">Asset</th>
                            <th className="border p-2 text-right">Balance</th>
                            <th className="border p-2 text-right">Value USD</th>
                        </tr>
                    </thead>
                    <tbody>
                        {balances.map((balance) => (
                            <tr key={balance.id}>
                                <td className="border p-2 font-semibold">{balance.asset}</td>
                                <td className="border p-2 text-right font-mono">{balance.balance.toString()}</td>
                                <td className="border p-2 text-right font-mono">${formatNumber(balance.valueUSD)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
