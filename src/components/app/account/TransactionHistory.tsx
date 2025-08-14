'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { ParsedDexTransaction } from '@/interfaces/explorers'
import { DexProtocol } from '@/enums'

interface TransactionHistoryProps {
    account: string
}

interface TransactionResponse {
    success: boolean
    transactions: ParsedDexTransaction[]
    stats: {
        total: number
        byType: Record<string, number>
        byDex: Record<DexProtocol, number>
        successful: number
        failed: number
    }
    pagination: {
        limit: number
        startBlock?: number
        endBlock?: number
        total: number
        filteredCount: number
    }
    message?: string // Optional message for API key not configured
}

async function fetchTransactions(account: string, onlyHypeUsdt: boolean, limit: number = 1000): Promise<TransactionResponse> {
    const params = new URLSearchParams({
        limit: limit.toString(),
        onlyHypeUsdt: onlyHypeUsdt.toString(),
    })

    const response = await fetch(`/api/public/account/${account}/transactions?${params}`)
    if (!response.ok) {
        throw new Error('Failed to fetch transactions')
    }
    return response.json()
}

export function TransactionHistory({ account }: TransactionHistoryProps) {
    const [onlyHypeUsdt, setOnlyHypeUsdt] = useState(true)
    const [showStats, setShowStats] = useState(false)

    const { data, isLoading, error } = useQuery({
        queryKey: ['transactions', account, onlyHypeUsdt],
        queryFn: () => fetchTransactions(account, onlyHypeUsdt, 1000),
        enabled: !!account,
        staleTime: 60000, // 1 minute
        gcTime: 300000, // 5 minutes
    })

    if (isLoading) {
        return (
            <div className="border p-4">
                <h2 className="mb-4 text-xl font-semibold">Transaction History</h2>
                <div className="text-center text-gray-500">Loading transactions...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="border p-4">
                <h2 className="mb-4 text-xl font-semibold">Transaction History</h2>
                <div className="text-center text-red-500">Error: {error instanceof Error ? error.message : 'Failed to load transactions'}</div>
            </div>
        )
    }

    if (!data?.success || !data.transactions) {
        return (
            <div className="border p-4">
                <h2 className="mb-4 text-xl font-semibold">Transaction History</h2>
                <div className="text-center text-gray-500">No transaction data available</div>
            </div>
        )
    }

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString()
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'swap':
                return 'text-blue-600'
            case 'addLiquidity':
                return 'text-green-600'
            case 'removeLiquidity':
                return 'text-red-600'
            case 'collect':
                return 'text-purple-600'
            default:
                return 'text-gray-600'
        }
    }

    const getDexName = (dex: DexProtocol) => {
        const names: Record<DexProtocol, string> = {
            [DexProtocol.HYPERSWAP]: 'Hyperswap',
            [DexProtocol.HYBRA]: 'Hybra',
            [DexProtocol.PRJTX]: 'Project X',
            [DexProtocol.HYPERBRICK]: 'HyperBrick',
        }
        return names[dex] || dex
    }

    return (
        <div className="space-y-4">
            <div className="border p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Transaction History</h2>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={onlyHypeUsdt} onChange={(e) => setOnlyHypeUsdt(e.target.checked)} className="rounded" />
                            <span className="text-sm">Only HYPE/USDT0</span>
                        </label>
                        <button onClick={() => setShowStats(!showStats)} className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200">
                            {showStats ? 'Hide' : 'Show'} Stats
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                {showStats && data.stats && (
                    <div className="mb-4 grid grid-cols-2 gap-4 rounded bg-gray-50 p-4 text-sm md:grid-cols-4">
                        <div>
                            <div className="font-semibold">Total Transactions</div>
                            <div>{data.stats.total}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Successful</div>
                            <div className="text-green-600">{data.stats.successful}</div>
                        </div>
                        <div>
                            <div className="font-semibold">Failed</div>
                            <div className="text-red-600">{data.stats.failed}</div>
                        </div>
                        <div>
                            <div className="font-semibold">By Type</div>
                            <div className="text-xs">
                                {Object.entries(data.stats.byType)
                                    .filter(([, count]) => count > 0)
                                    .map(([type, count]) => (
                                        <div key={type}>
                                            {type}: {count}
                                        </div>
                                    ))}
                            </div>
                        </div>
                        {Object.keys(data.stats.byDex).length > 0 && (
                            <div className="col-span-2 md:col-span-4">
                                <div className="font-semibold">By DEX</div>
                                <div className="flex gap-4 text-xs">
                                    {Object.entries(data.stats.byDex).map(([dex, count]) => (
                                        <div key={dex}>
                                            {getDexName(dex as DexProtocol)}: {count}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Message if API key not configured */}
                {data.message && (
                    <div className="mb-4 rounded bg-yellow-50 p-4 text-sm text-yellow-800">
                        {data.message}. To view transaction history, please configure HYPEREVM_SCAN_API_KEY in your environment.
                    </div>
                )}

                {/* Transaction List */}
                {data.transactions.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                        {data.message
                            ? 'Transaction history unavailable'
                            : `No DEX transactions found for this account${onlyHypeUsdt ? ' with HYPE/USDT0 pairs' : ''}`}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="pb-2">Type</th>
                                    <th className="pb-2">DEX</th>
                                    <th className="pb-2">Tokens</th>
                                    <th className="pb-2">Tx Hash</th>
                                    <th className="pb-2">Time</th>
                                    <th className="pb-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.transactions.slice(0, 50).map((tx) => (
                                    <tr key={tx.txHash} className="border-b hover:bg-gray-50">
                                        <td className={`py-2 ${getTypeColor(tx.type)}`}>{tx.type}</td>
                                        <td className="py-2">{getDexName(tx.dex)}</td>
                                        <td className="py-2">{tx.token0Symbol && tx.token1Symbol ? `${tx.token0Symbol}/${tx.token1Symbol}` : '-'}</td>
                                        <td className="py-2">
                                            <a
                                                href={`https://hyperevmscan.io/tx/${tx.txHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {formatAddress(tx.txHash)}
                                            </a>
                                        </td>
                                        <td className="py-2 text-xs">{formatTimestamp(tx.timestamp)}</td>
                                        <td className="py-2">
                                            <span
                                                className={`rounded px-2 py-1 text-xs ${
                                                    tx.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {data.transactions.length > 50 && (
                            <div className="mt-2 text-center text-sm text-gray-500">Showing first 50 of {data.transactions.length} transactions</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
