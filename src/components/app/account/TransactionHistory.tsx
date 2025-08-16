'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { DexTransactionResponse } from '@/interfaces/api.interface'
import { DexProtocol } from '@/enums'
import { DEFAULT_TRANSACTION_LIMIT } from '@/config/app.config'

interface TransactionHistoryProps {
    account: string
    limit?: number
}

async function fetchTransactions(account: string, limit: number = 10): Promise<DexTransactionResponse> {
    const params = new URLSearchParams({
        limit: limit.toString(),
    })

    const response = await fetch(`/api/account/${account}/transactions?${params}`)
    if (!response.ok) {
        throw new Error('Failed to fetch transactions')
    }
    return response.json()
}

export function TransactionHistory({ account, limit = DEFAULT_TRANSACTION_LIMIT }: TransactionHistoryProps) {
    const [displayCount] = useState(limit)

    const { data, isLoading, error } = useQuery({
        queryKey: ['transactions', account, limit],
        queryFn: () => fetchTransactions(account, limit),
        enabled: !!account,
        staleTime: 60000, // 1 minute
        gcTime: 300000, // 5 minutes
        refetchOnWindowFocus: false, // Don't refetch on window focus to avoid unnecessary API calls
    })

    if (isLoading) {
        return (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="h-8 rounded bg-default/10"></div>
                    </div>
                ))}
            </div>
        )
    }

    if (error) {
        return <div className="text-center text-sm text-red-500">Error: {error instanceof Error ? error.message : 'Failed to load transactions'}</div>
    }

    if (!data?.success || !data.transactions) {
        return <div className="text-center text-sm text-default/50">No transaction data available</div>
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
            case 'transfer':
                return 'text-indigo-600'
            case 'contract':
                return 'text-orange-600'
            default:
                return 'text-default/50'
        }
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'swap':
                return 'Swap'
            case 'addLiquidity':
                return 'Add Liquidity'
            case 'removeLiquidity':
                return 'Remove Liquidity'
            case 'collect':
                return 'Collect Fees'
            case 'transfer':
                return 'Transfer'
            case 'contract':
                return 'Contract Call'
            default:
                return type
        }
    }

    const getDexName = (dex: DexProtocol) => {
        const names: Record<DexProtocol, string> = {
            [DexProtocol.HYPERSWAP]: 'Hyperswap',
            [DexProtocol.HYBRA]: 'Hybra',
            [DexProtocol.PRJTX]: 'Project X',
            [DexProtocol.HYPERBRICK]: 'HyperBrick',
        }
        return names[dex] || ''
    }

    return (
        <div className="space-y-2">
            {/* Message if API key not configured */}
            {data.message && <div className="text-sm text-yellow-600 dark:text-yellow-400">{data.message}</div>}
            {/* Transaction List */}
            {data.transactions.length === 0 ? (
                <div className="py-4 text-center text-sm text-default/50">
                    {data.message ? 'Transaction history unavailable' : 'No recent transactions'}
                </div>
            ) : (
                <div className="space-y-1">
                    {data.transactions.slice(0, displayCount).map((tx) => (
                        <div key={tx.txHash} className="flex items-center justify-between py-1 text-sm hover:bg-default/5">
                            <div className="flex items-center gap-3">
                                <span className={`${getTypeColor(tx.type)} font-medium`}>{getTypeLabel(tx.type)}</span>
                                {getDexName(tx.dex) && <span className="text-default/50">{getDexName(tx.dex)}</span>}
                                {tx.token0Symbol && tx.token1Symbol ? (
                                    <span className="text-default/50">
                                        {tx.token0Symbol}/{tx.token1Symbol}
                                    </span>
                                ) : null}
                            </div>
                            <div className="flex items-center gap-3">
                                <a
                                    href={`https://hyperevmscan.io/tx/${tx.txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    {formatAddress(tx.txHash)}
                                </a>
                                <span className="text-xs text-default/50">{formatTimestamp(tx.timestamp)}</span>
                                <span
                                    className={`text-xs ${
                                        tx.status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                    }`}
                                >
                                    {tx.status === 'success' ? '✓' : '✗'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
