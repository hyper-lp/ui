'use client'

import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { AccountData } from '@/interfaces'
import { useDeltaHistoryStore } from '@/stores/delta-history.store'

async function fetchAccountData(evmAddress: string, coreAddress: string): Promise<AccountData> {
    // If both addresses are the same, use the old single-address API for backward compatibility
    if (evmAddress === coreAddress && evmAddress) {
        const response = await fetch(`/api/public/account/${evmAddress}`)
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Account not found')
            }
            throw new Error('Failed to fetch account data')
        }
        return response.json()
    }

    // Otherwise use the new dual-address API
    const params = new URLSearchParams({
        evm: evmAddress,
        core: coreAddress,
    })
    const response = await fetch(`/api/public/account?${params}`)
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Account not found')
        }
        throw new Error('Failed to fetch account data')
    }
    return response.json()
}

function formatTimeSince(timestamp: number | null): string {
    if (!timestamp) return ''
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
}

export function useAccountData(evmAddress: string, coreAddress: string) {
    const [lastRefreshTime, setLastRefreshTime] = useState<number | null>(null)
    const [, setTick] = useState(0) // Force re-render for time display

    // Delta history store - use combined key for history
    const { addDataPoint, getHistory } = useDeltaHistoryStore()
    const historyKey = `${evmAddress}-${coreAddress}`
    const deltaHistory = getHistory(historyKey)

    // Main data query
    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ['account', evmAddress, coreAddress],
        queryFn: () => fetchAccountData(evmAddress, coreAddress),
        enabled: !!evmAddress && !!coreAddress,
        staleTime: process.env.NODE_ENV === 'development' ? 300000 : 30000, // Dev: 5 min, Prod: 30 sec
        gcTime: 300000, // Keep in cache for 5 minutes
        refetchInterval: process.env.NODE_ENV === 'development' ? 300000 : 30000, // Dev: 5 min, Prod: 30 sec
    })

    // Calculate all deltas from new structure
    const deltas = useMemo(() => {
        if (!data?.positions) {
            return {
                hyperEvmLp: 0,
                hyperEvmSpot: 0,
                hyperCorePerp: 0,
                hyperCoreSpot: 0,
                totalHyperEvm: 0,
                totalHyperCore: 0,
                totalNet: 0,
            }
        }

        // HyperEVM LP Delta
        const hyperEvmLp = data.positions.hyperEvm.lp.reduce((sum, p) => {
            const token0IsHype = p.token0Symbol === 'WHYPE' || p.token0Symbol === 'HYPE'
            const token1IsHype = p.token1Symbol === 'WHYPE' || p.token1Symbol === 'HYPE'
            if (token0IsHype && p.token0Amount) return sum + p.token0Amount
            else if (token1IsHype && p.token1Amount) return sum + p.token1Amount
            return sum
        }, 0)

        // HyperEVM Balances Delta
        const hyperEvmSpot = data.positions.hyperEvm.balances.reduce((sum, b) => {
            if (b.symbol === 'WHYPE' || b.symbol === 'HYPE') {
                const balanceNum = parseFloat(b.balance) || 0
                const decimals = b.decimals || 18
                const actualBalance = balanceNum / Math.pow(10, decimals)
                return sum + actualBalance
            }
            return sum
        }, 0)

        // HyperCore Perp Delta
        const hyperCorePerp = data.positions.hyperCore.perp.reduce((sum, p) => {
            if (p.asset === 'HYPE') {
                return sum + (p.size || 0)
            }
            return sum
        }, 0)

        // HyperCore Spot Delta
        const hyperCoreSpot = data.positions.hyperCore.spot.reduce((sum, b) => {
            if (b.asset === 'HYPE') {
                const balanceNum = typeof b.balance === 'string' ? parseFloat(b.balance) : b.balance
                const actualBalance = balanceNum > 1e10 ? balanceNum / 1e18 : balanceNum
                return sum + (actualBalance || 0)
            }
            return sum
        }, 0)

        const totalHyperEvm = hyperEvmLp + hyperEvmSpot
        const totalHyperCore = hyperCorePerp + hyperCoreSpot
        const totalNet = totalHyperEvm + totalHyperCore

        return {
            hyperEvmLp,
            hyperEvmSpot,
            hyperCorePerp,
            hyperCoreSpot,
            totalHyperEvm,
            totalHyperCore,
            totalNet,
        }
    }, [data?.positions])

    // Calculate perp metrics
    const perpMetrics = useMemo(() => {
        const perpPositions = data?.positions?.hyperCore?.perp || []

        if (perpPositions.length === 0) {
            return {
                totalMargin: 0,
                totalNotional: 0,
                totalPnl: 0,
                avgLeverage: 0,
            }
        }

        const totalMargin = perpPositions.reduce((sum, p) => sum + p.marginUsed, 0)
        const totalNotional = perpPositions.reduce((sum, p) => sum + Math.abs(p.notionalValue), 0)
        const totalPnl = perpPositions.reduce((sum, p) => sum + p.unrealizedPnl, 0)
        const avgLeverage = totalMargin > 0 ? totalNotional / totalMargin : 0

        return {
            totalMargin,
            totalNotional,
            totalPnl,
            avgLeverage,
        }
    }, [data?.positions?.hyperCore?.perp])

    // Add data point to history on each refresh and update last refresh time
    useEffect(() => {
        if (data?.metrics && evmAddress && coreAddress) {
            const now = Date.now()
            setLastRefreshTime(now)
            // Use calculated deltas for consistency
            const point = {
                timestamp: now,
                lpDelta: deltas.hyperEvmLp,
                perpDelta: deltas.hyperCorePerp,
                netDelta: deltas.totalNet,
                spotDelta: deltas.hyperCoreSpot,
                hyperEvmDelta: deltas.totalHyperEvm,
            }
            addDataPoint(historyKey, point)
        }
    }, [data?.metrics, evmAddress, coreAddress, historyKey, addDataPoint, deltas])

    // Update refresh time display every second
    useEffect(() => {
        const interval = setInterval(() => {
            setTick((prev) => prev + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    // Display refresh time
    const refreshTimeDisplay = formatTimeSince(lastRefreshTime)

    return {
        // Core position data - simplified structure for components
        positions: {
            lp: data?.positions?.hyperEvm?.lp || [],
            wallet: data?.positions?.hyperEvm?.balances || [],
            perp: data?.positions?.hyperCore?.perp || [],
            spot: data?.positions?.hyperCore?.spot || [],
        },

        // Aggregated metrics
        metrics: {
            values: {
                totalPortfolio: data?.metrics?.portfolio?.totalValue || 0,
                totalLp: data?.metrics?.hyperEvm?.values?.lp || 0,
                totalWallet: data?.metrics?.hyperEvm?.values?.balances || 0,
                totalPerp: data?.metrics?.hyperCore?.values?.perp || 0,
                totalSpot: data?.metrics?.hyperCore?.values?.spot || 0,
            },
            deltas: {
                lp: deltas.hyperEvmLp,
                wallet: deltas.hyperEvmSpot,
                perp: deltas.hyperCorePerp,
                spot: deltas.hyperCoreSpot,
                netTotal: deltas.totalNet,
            },
            perp: perpMetrics,
        },

        // Meta information
        meta: {
            isLoading,
            isFetching,
            error,
            isSuccess: data?.success || false,
            lastRefreshTime,
            refreshTimeDisplay,
            addresses: {
                evm: evmAddress,
                core: coreAddress,
            },
        },

        // Actions
        actions: {
            refetch,
        },

        // Direct access to raw data
        accountInfo: data?.account,
        accountSummary: data?.snapshots?.current
            ? {
                  totalLpValue: data.metrics.hyperEvm.values.lp,
                  totalPerpValue: data.metrics.hyperCore.values.perp,
                  totalSpotValue: data.metrics.hyperCore.values.spot,
                  totalHyperEvmValue: data.metrics.hyperEvm.values.balances,
                  totalValue: data.metrics.portfolio.totalValue,
                  netDelta: data.metrics.portfolio.netDelta,
                  lpDelta: data.metrics.hyperEvm.deltas.lp,
                  perpDelta: data.metrics.hyperCore.deltas.perp,
                  spotDelta: data.metrics.hyperCore.deltas.spot,
                  hyperEvmDelta: data.metrics.hyperEvm.deltas.balances,
                  lastSnapshot: data.snapshots.last,
                  currentAPR: data.snapshots.current,
              }
            : undefined,
        deltaHistory,

        // Direct access to values for convenience
        totalPortfolioValue: data?.metrics?.portfolio?.totalValue || 0,
        totalLpValue: data?.metrics?.hyperEvm?.values?.lp || 0,
        totalPerpValue: data?.metrics?.hyperCore?.values?.perp || 0,
        evmAddress,
        coreAddress,
    }
}
