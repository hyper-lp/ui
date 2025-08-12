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
            <div className={cn('border rounded-lg p-4', className)}>
                <h3 className="text-sm font-semibold mb-3">HYPE/USDT0 Pool Liquidity</h3>
                <div className="text-sm text-muted">Loading TVL data...</div>
            </div>
        )
    }

    if (error || !data?.success) {
        return (
            <div className={cn('border rounded-lg p-4', className)}>
                <h3 className="text-sm font-semibold mb-3">HYPE/USDT0 Pool Liquidity</h3>
                <div className="text-sm text-red-500">Failed to load TVL data</div>
            </div>
        )
    }

    return (
        <div className={cn('border rounded-lg p-4', className)}>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold">HYPE/USDT0 Pool Liquidity</h3>
                <div className="text-xs text-muted">
                    Total: <span className="font-bold text-foreground">{formatUSD(data.grandTotalTVL)}</span>
                </div>
            </div>

            <div className="space-y-3">
                {data.dexes.map((dex) => (
                    <div key={dex.dex} className="space-y-1">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium capitalize">{dex.dex}</span>
                            <span className="text-sm font-mono">{formatUSD(dex.totalTVL)}</span>
                        </div>
                        <div className="space-y-0.5">
                            {dex.pools.map((pool) => (
                                <div key={pool.poolAddress} className="flex justify-between items-center text-xs text-muted pl-4">
                                    <span>
                                        {pool.feeLabel} tier
                                        {pool.isActive && <span className="text-green-600 ml-1">●</span>}
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

                {data.dexes.length === 0 && <div className="text-sm text-muted text-center py-2">No pools found</div>}
            </div>

            <div className="mt-3 pt-3 border-t text-xs text-muted">
                <div className="flex justify-between">
                    <span>HYPE Price: ${formatNumber(data.prices.HYPE, 2)}</span>
                    <span>Last updated: {new Date(data.timestamp).toLocaleTimeString()}</span>
                </div>
            </div>
        </div>
    )
}

export default memo(PoolTVLTable)
