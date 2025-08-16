'use client'

import { useEffect, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '@/stores/app.store'
import type { AccountSnapshot } from '@/interfaces'
import { IS_DEV } from '@/config'

/**
 * Simplified hook that only handles fetching account data and updating the store.
 * Components should access data directly from the store using useAppStore selectors.
 */
export function useAccountData(address: string) {
    const queryClient = useQueryClient()
    const { addSnapshot, setCurrentAddress, setFetchingAccount, setAccountError, isFetchingAccount, accountError } = useAppStore()

    // Set current address when it changes
    useEffect(() => {
        if (address) {
            setCurrentAddress(address)
        }
        return () => {
            // Clear when unmounting
            setCurrentAddress(null)
            setAccountError(null)
        }
    }, [address, setCurrentAddress, setAccountError])

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
            const response = await fetch(`/api/account/${address}/snapshot?t=${cacheBuster}`)
            if (!response.ok) {
                if (response.status === 404) throw new Error('Account not found')
                throw new Error('Failed to fetch account data')
            }
            return response.json()
        },
        enabled: !!address,
        staleTime: IS_DEV ? 300000 : 30000, // Dev: 5 min, Prod: 30 sec
        gcTime: 300000, // Keep in cache for 5 minutes
        refetchInterval: IS_DEV ? 300000 : 30000, // Dev: 5 min, Prod: 30 sec
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
