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

    // Calculate all deltas (accounting for token decimals)
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
        // LP positions already have token amounts calculated, likely already accounting for decimals
        const hyperEvmLp =
            data.positions.lp?.reduce((sum, p) => {
                const token0IsHype = p.token0Symbol === 'WHYPE' || p.token0Symbol === 'HYPE'
                const token1IsHype = p.token1Symbol === 'WHYPE' || p.token1Symbol === 'HYPE'
                if (token0IsHype && p.token0Amount) return sum + p.token0Amount
                else if (token1IsHype && p.token1Amount) return sum + p.token1Amount
                return sum
            }, 0) || 0

        // HyperEVM Spot Delta
        // Need to account for decimals from the raw balance
        const hyperEvmSpot =
            data.positions.hyperEvm?.reduce((sum, b) => {
                if (b.symbol === 'WHYPE' || b.symbol === 'HYPE') {
                    const balanceNum = parseFloat(b.balance) || 0
                    // Apply decimals conversion (HYPE/WHYPE typically has 18 decimals)
                    const decimals = b.decimals || 18
                    const actualBalance = balanceNum / Math.pow(10, decimals)
                    return sum + actualBalance
                }
                return sum
            }, 0) || 0

        // HyperCore Perp Delta
        // Perp positions size is already in token units, not raw amounts
        const hyperCorePerp =
            data.positions.perp?.reduce((sum, p) => {
                if (p.asset === 'HYPE') {
                    return sum + (p.size || 0)
                }
                return sum
            }, 0) || 0

        // HyperCore Spot Delta
        // Spot balances may need decimal conversion
        const hyperCoreSpot =
            data.positions.spot?.reduce((sum, b) => {
                if (b.asset === 'HYPE') {
                    const balanceNum = typeof b.balance === 'string' ? parseFloat(b.balance) : b.balance
                    // Check if the balance is likely a raw value (very large number)
                    // If balance > 1e10, it's likely raw and needs decimal conversion
                    const actualBalance = balanceNum > 1e10 ? balanceNum / 1e18 : balanceNum
                    return sum + (actualBalance || 0)
                }
                return sum
            }, 0) || 0

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

    // Calculate values
    const values = useMemo(() => {
        if (!data?.summary) {
            return {
                totalHyperEvmValue: 0,
                totalHyperCoreValue: 0,
                totalValue: 0,
            }
        }

        const totalHyperEvmValue = (data.summary.totalLpValue || 0) + (data.summary.totalHyperEvmValue || 0)
        const totalHyperCoreValue = (data.summary.totalPerpValue || 0) + (data.summary.totalSpotValue || 0)

        return {
            totalHyperEvmValue,
            totalHyperCoreValue,
            totalValue: data.summary.totalValue || 0,
        }
    }, [data?.summary])

    // Add data point to history on each refresh and update last refresh time
    useEffect(() => {
        if (data?.summary && evmAddress && coreAddress) {
            const now = Date.now()
            setLastRefreshTime(now)
            const point = {
                timestamp: now,
                lpDelta: data.summary.lpDelta || 0,
                perpDelta: data.summary.perpDelta || 0,
                netDelta: data.summary.netDelta || 0,
                spotDelta: data.summary.spotDelta || 0,
                hyperEvmDelta: data.summary.hyperEvmDelta || 0,
            }
            addDataPoint(historyKey, point)
        }
    }, [data?.summary, evmAddress, coreAddress, historyKey, addDataPoint])

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
        // Account info
        accountInfo: data?.account,

        // HyperEVM positions
        hyperEvmLpPositions: data?.positions?.lp,
        hyperEvmTokenBalances: data?.positions?.hyperEvm,

        // HyperCore positions
        hyperCorePerpPositions: data?.positions?.perp,
        hyperCoreSpotBalances: data?.positions?.spot,

        // Summary data
        accountSummary: data?.summary,
        fetchTimings: data?.timings,
        isSuccess: data?.success,

        // Computed deltas with explicit names
        hyperEvmLpDelta: deltas.hyperEvmLp,
        hyperEvmSpotDelta: deltas.hyperEvmSpot,
        hyperCorePerpDelta: deltas.hyperCorePerp,
        hyperCoreSpotDelta: deltas.hyperCoreSpot,
        totalHyperEvmDelta: deltas.totalHyperEvm,
        totalHyperCoreDelta: deltas.totalHyperCore,
        totalNetDelta: deltas.totalNet,

        // Computed values with explicit names
        totalHyperEvmValue: values.totalHyperEvmValue,
        totalHyperCoreValue: values.totalHyperCoreValue,
        totalPortfolioValue: values.totalValue,

        // Section-specific values from summary
        totalLpValue: data?.summary?.totalLpValue || 0,
        totalHyperEvmBalanceValue: data?.summary?.totalHyperEvmValue || 0,
        totalPerpValue: data?.summary?.totalPerpValue || 0,
        totalSpotValue: data?.summary?.totalSpotValue || 0,

        // History
        deltaHistory,

        // Meta information
        isLoading,
        error,
        isFetching,
        refetch,
        lastRefreshTime,
        refreshTimeDisplay,

        // Addresses
        evmAddress,
        coreAddress,
    }
}
