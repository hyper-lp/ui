'use client'

import { useQuery } from '@tanstack/react-query'
import { memo } from 'react'
import { cn } from '@/utils'

interface PoolTVL {
    dex: string
    poolAddress: string
    fee: number
    feeLabel: string
    liquidity: string
    tvlUSD: number
    token0Balance: number
    token1Balance: number
    sqrtPriceX96: string
    tick: number
    isActive: boolean
}

interface DexTVL {
    dex: string
    totalTVL: number
    pools: PoolTVL[]
}

interface TVLData {
    success: boolean
    timestamp: number
    prices: {
        HYPE: number
        USDT0: number
    }
    grandTotalTVL: number
    dexes: DexTVL[]
}

async function fetchPoolTVL(): Promise<TVLData> {
    const response = await fetch('/api/pools/tvl')
    if (!response.ok) {
        throw new Error('Failed to fetch TVL data')
    }
    return response.json()
}

function PoolTVLTable({ className }: { className?: string }) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['pool-tvl'],
        queryFn: fetchPoolTVL,
        staleTime: 60000, // 1 minute
        refetchInterval: 60000, // Refresh every minute
    })

    const formatNumber = (num: number, decimals = 2) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(num)
    }

    const formatUSD = (num: number) => {
        if (num >= 1000000) {
            return `$${(num / 1000000).toFixed(2)}M`
        } else if (num >= 1000) {
            return `$${(num / 1000).toFixed(1)}K`
        }
        return `$${num.toFixed(2)}`
    }

    if (isLoading) {
        return (
            <div className={cn('rounded-lg border p-4', className)}>
                <h3 className="mb-3 text-sm font-semibold">HYPE/USDT0 Pool Liquidity</h3>
                <div className="text-muted text-sm">Loading TVL data...</div>
            </div>
        )
    }

    if (error || !data?.success) {
        return (
            <div className={cn('rounded-lg border p-4', className)}>
                <h3 className="mb-3 text-sm font-semibold">HYPE/USDT0 Pool Liquidity</h3>
                <div className="text-sm text-red-500">Failed to load TVL data</div>
            </div>
        )
    }

    return (
        <div className={cn('rounded-lg border p-4', className)}>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">HYPE/USDT0 Pool Liquidity</h3>
                <div className="text-muted text-xs">
                    Total: <span className="text-foreground font-bold">{formatUSD(data.grandTotalTVL)}</span>
                </div>
            </div>

            <div className="space-y-3">
                {data.dexes.map((dex) => (
                    <div key={dex.dex} className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium capitalize">{dex.dex}</span>
                            <span className="font-mono text-sm">{formatUSD(dex.totalTVL)}</span>
                        </div>
                        <div className="space-y-0.5">
                            {dex.pools.map((pool) => (
                                <div key={pool.poolAddress} className="text-muted flex items-center justify-between pl-4 text-xs">
                                    <span>
                                        {pool.feeLabel} tier
                                        {pool.isActive && <span className="ml-1 text-green-600">●</span>}
                                    </span>
                                    <div className="flex gap-3">
                                        <span className="font-mono">{formatNumber(pool.token0Balance, 2)} HYPE</span>
                                        <span className="font-mono">{formatNumber(pool.token1Balance, 2)} USDT0</span>
                                        <span className="font-mono font-semibold">{formatUSD(pool.tvlUSD)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {data.dexes.length === 0 && <div className="text-muted py-2 text-center text-sm">No pools found</div>}
            </div>

            <div className="text-muted mt-3 border-t pt-3 text-xs">
                <div className="flex justify-between">
                    <span>HYPE Price: ${formatNumber(data.prices.HYPE, 2)}</span>
                    <span>Last updated: {new Date(data.timestamp).toLocaleTimeString()}</span>
                </div>
            </div>
        </div>
    )
}

export default memo(PoolTVLTable)
