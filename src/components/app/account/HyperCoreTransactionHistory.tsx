'use client'

import { useQuery } from '@tanstack/react-query'
import type { HyperCoreTransactionResponse } from '@/interfaces/api.interface'
import { DEFAULT_TRANSACTION_LIMIT, TIME_INTERVALS, REFRESH_INTERVALS } from '@/config/app.config'
import { getHyperCoreAssetBySymbol } from '@/config/hypercore-assets.config'

interface HyperCoreTransactionHistoryProps {
    account: string
    limit?: number
}

async function fetchTransactions(account: string, limit: number): Promise<HyperCoreTransactionResponse> {
    const params = new URLSearchParams({
        limit: limit.toString(),
    })

    const response = await fetch(`/api/account/${account}/trades?${params}`)
    if (!response.ok) {
        throw new Error('Failed to fetch HyperCore trades')
    }
    return response.json()
}

export function HyperCoreTransactionHistory({ account, limit = DEFAULT_TRANSACTION_LIMIT }: HyperCoreTransactionHistoryProps) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['hypercore-trades', account, limit],
        queryFn: () => fetchTransactions(account, limit),
        enabled: !!account,
        staleTime: TIME_INTERVALS.MINUTE_1,
        gcTime: REFRESH_INTERVALS.CACHE_GC,
        refetchOnWindowFocus: false,
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

    if (!data?.success || !data.transactions || data.transactions.length === 0) {
        return <div className="py-4 text-center text-sm text-default/50">No recent transactions</div>
    }

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp).toLocaleString()
    }

    const formatSize = (size: number, coin: string) => {
        const asset = getHyperCoreAssetBySymbol(coin)
        const decimals = asset?.decimalsForRounding ?? 4
        return size.toFixed(decimals)
    }

    const formatPrice = (price: number) => {
        return price.toFixed(2)
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'trade':
                return 'text-blue-600'
            case 'liquidation':
                return 'text-red-600'
            case 'funding':
                return 'text-purple-600'
            default:
                return 'text-default/50'
        }
    }

    const getSideColor = (side: string) => {
        switch (side) {
            case 'buy':
            case 'long':
                return 'text-green-600 dark:text-green-400'
            case 'sell':
            case 'short':
                return 'text-red-600 dark:text-red-400'
            default:
                return 'text-default/50'
        }
    }

    return (
        <div className="space-y-1">
            {data.transactions.map((tx, index) => {
                return (
                    <div key={`${tx.hash}-${index}`} className="flex items-center justify-between py-1 text-sm hover:bg-default/5">
                        <div className="flex items-center gap-3">
                            <span className={`${getTypeColor(tx.type)} font-medium capitalize`}>{tx.type}</span>

                            <span className="font-medium">{tx.coin}</span>

                            <span className={`${getSideColor(tx.side)} font-medium uppercase`}>{tx.side}</span>

                            <span className="text-default/50">
                                {formatSize(tx.size, tx.coin)} @ ${formatPrice(tx.price)}
                            </span>

                            {tx.pnl !== undefined && (
                                <span className={`${tx.pnl >= 0 ? 'text-green-600' : 'text-red-600'} text-xs`}>PnL: ${tx.pnl.toFixed(2)}</span>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-xs text-default/50">${tx.value.toFixed(2)}</span>
                            <span className="text-xs text-default/50">{formatTimestamp(tx.timestamp)}</span>
                            <span className="text-xs text-green-600 dark:text-green-400">✓</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
