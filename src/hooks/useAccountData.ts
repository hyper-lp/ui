'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '@/stores/app.store'
import type { AccountSnapshot } from '@/interfaces'
import { IS_DEV, REFRESH_INTERVALS } from '@/config'
import { AppUrls } from '@/enums/app.enum'

/**
 * Simplified hook that only handles fetching account data and updating the store.
 * Components should access data directly from the store using useAppStore selectors.
 */
export function useAccountData(address: string) {
    const queryClient = useQueryClient()
    const { addSnapshot, setCurrentAddress, setFetchingAccount, setAccountError, isFetchingAccount, accountError, setSnapshots, setRebalanceEvents } =
        useAppStore()
    const rebalanceIntervalRef = useRef<NodeJS.Timeout | null>(null)

    // Function to fetch rebalance events
    const fetchRebalances = useCallback(() => {
        if (!address) return

        fetch(`/api/rebalances/${address}`)
            .then((res) => res.json())
            .then((data) => {
                console.log('[useAccountData] Rebalance API response:', data)
                if (data.success && data.data) {
                    console.log(`[useAccountData] Setting ${data.data.length} rebalance events`)
                    setRebalanceEvents(data.data)
                }
            })
            .catch((err) => console.error('Failed to fetch rebalance events:', err))
    }, [address, setRebalanceEvents])

    // Set current address when it changes and fetch historical snapshots
    useEffect(() => {
        if (address) {
            setCurrentAddress(address)

            // Fetch historical snapshots from database (default 500, max 1000)
            fetch(`${AppUrls.API_SNAPSHOTS}/${address}?limit=500`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.snapshots && Array.isArray(data.snapshots)) {
                        console.log(`[useAccountData] Setting ${data.snapshots.length} historical snapshots`)
                        setSnapshots(data.snapshots)
                    }
                })
                .catch((err) => console.error('Failed to fetch historical snapshots:', err))

            // Fetch rebalance events immediately
            fetchRebalances()

            // Set up interval to fetch rebalances every 10 seconds
            const intervalTime = 10000 // 10 seconds
            rebalanceIntervalRef.current = setInterval(fetchRebalances, intervalTime)
            console.log(`[useAccountData] Started rebalance refresh interval (${intervalTime}ms)`)
        }
        return () => {
            // Clear interval when unmounting or address changes
            if (rebalanceIntervalRef.current) {
                clearInterval(rebalanceIntervalRef.current)
                rebalanceIntervalRef.current = null
                console.log('[useAccountData] Cleared rebalance refresh interval')
            }
            // Clear when unmounting
            setCurrentAddress(null)
            setAccountError(null)
            setRebalanceEvents([])
        }
    }, [address, setCurrentAddress, setAccountError, setSnapshots, fetchRebalances])

    // Main data query - only for fetching fresh data
    const {
        data: freshData,
        isLoading,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ['account', address],
        queryFn: async (): Promise<AccountSnapshot> => {
            // Add cache buster to force fresh fetch
            const cacheBuster = Date.now()
            const response = await fetch(`${AppUrls.API_SNAPSHOT}/${address}?t=${cacheBuster}`)
            if (!response.ok) {
                if (response.status === 404) throw new Error('Account not found')
                throw new Error('Failed to fetch account data')
            }
            return response.json()
        },
        enabled: !!address,
        staleTime: IS_DEV ? REFRESH_INTERVALS.DEV : REFRESH_INTERVALS.PROD,
        gcTime: REFRESH_INTERVALS.CACHE_GC,
        refetchInterval: IS_DEV ? REFRESH_INTERVALS.DEV : REFRESH_INTERVALS.PROD,
    })

    // Update store when data changes
    useEffect(() => {
        setFetchingAccount(isFetching)
    }, [isFetching, setFetchingAccount])

    useEffect(() => {
        setAccountError(error instanceof Error ? error : null)
    }, [error, setAccountError])

    // Add snapshot to history on each refresh
    useEffect(() => {
        if (freshData && address) {
            addSnapshot(freshData)
        }
    }, [freshData, address, addSnapshot])

    // Force refresh function that invalidates cache
    const forceRefresh = useCallback(async () => {
        // Invalidate the query cache to force a fresh fetch
        await queryClient.invalidateQueries({
            queryKey: ['account', address],
            exact: true,
        })
        // Then refetch
        return refetch()
    }, [queryClient, address, refetch])

    // Return minimal interface for triggering refresh
    return {
        isLoading: isLoading || (!freshData && isFetchingAccount),
        isFetching,
        error: error || accountError,
        refetch: forceRefresh, // Use forceRefresh instead of regular refetch
    }
}
