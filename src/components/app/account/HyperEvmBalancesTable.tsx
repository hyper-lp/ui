'use client'

import type { HyperEvmBalance } from '@/interfaces'

interface HyperEvmBalancesTableProps {
    balances: HyperEvmBalance[]
}

export function HyperEvmBalancesTable({ balances }: HyperEvmBalancesTableProps) {
    const formatNumber = (num: number, decimals = 2) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(num)
    }

    if (!balances || balances.length === 0) return null

    return (
        <div className="space-y-2">
            <h2 className="text-xl font-semibold">HyperEVM Wallet Balances ({balances.length})</h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border text-sm">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border p-2 text-left">Asset</th>
                            <th className="border p-2 text-left">Address</th>
                            <th className="border p-2 text-right">Balance</th>
                            <th className="border p-2 text-right">Value USD</th>
                        </tr>
                    </thead>
                    <tbody>
                        {balances.map((balance) => {
                            const formattedBalance = Number(balance.balance) / 10 ** balance.decimals
                            return (
                                <tr key={balance.id}>
                                    <td className="border p-2 font-semibold">{balance.symbol}</td>
                                    <td className="border p-2 font-mono text-xs">
                                        {balance.address === '0x0000000000000000000000000000000000000000'
                                            ? 'Native HYPE'
                                            : balance.address.slice(0, 10) + '...' + balance.address.slice(-8)}
                                    </td>
                                    <td className="border p-2 text-right font-mono">{formatNumber(formattedBalance, 4)}</td>
                                    <td className="border p-2 text-right font-mono">${formatNumber(balance.valueUSD)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
