import { useQuery } from '@tanstack/react-query'
import { fetchHyperDriveAPR, getAllHyperDriveAPRs } from '@/services/hyperdrive.service'
import type { HyperDriveCurrentAPR } from '@/types/hyperdrive.types'

/**
 * React Query hook to fetch APR data for a specific HyperDrive market
 * @param marketAddress The market address to fetch APR for
 * @param enabled Whether the query should run
 * @returns Query result with APR data
 */
export function useHyperDriveAPR(marketAddress?: string, enabled = true) {
    return useQuery<HyperDriveCurrentAPR | null>({
        queryKey: ['hyperdrive', 'apr', marketAddress],
        queryFn: () => {
            if (!marketAddress) return null
            return fetchHyperDriveAPR(marketAddress)
        },
        enabled: enabled && !!marketAddress,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    })
}

/**
 * React Query hook to fetch APR data for all HyperDrive markets
 * @param enabled Whether the query should run
 * @returns Query result with map of market addresses to APR data
 */
export function useAllHyperDriveAPRs(enabled = true) {
    return useQuery<Map<string, HyperDriveCurrentAPR>>({
        queryKey: ['hyperdrive', 'apr', 'all'],
        queryFn: getAllHyperDriveAPRs,
        enabled,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    })
}