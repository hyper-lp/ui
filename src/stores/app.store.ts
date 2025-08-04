'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { APP_METADATA, IS_DEV } from '@/config/app.config'
import { SupportedFilters, SupportedFilterDirections, InstanceDisplayMode, SupportedStrategyChainsFilters, ListToShow } from '@/enums'
import { env } from '@/env/t3-env'

export const useAppStore = create<{
    /**
     * store
     */

    hasHydrated: boolean
    setHasHydrated: (hasHydrated: boolean) => void

    /**
     * ui
     */

    // list
    appStoreRefreshedAt: number
    setAppStoreRefreshedAt: (appStoreRefreshedAt: number) => void
    showMobileMenu: boolean
    setShowMobileMenu: (showMobileMenu: boolean) => void

    // unstable v1
    showActivitySection: boolean
    setShowActivitySection: (showActivitySection: boolean) => void
    showInstancesSection: boolean
    setShowInstancesSection: (showInstancesSection: boolean) => void
    showStrategiesSection: boolean
    setShowStrategiesSection: (showStrategiesSection: boolean) => void

    // unstable v2
    showCandlesSection: boolean
    setShowCandlesSection: (showCandlesSection: boolean) => void
    showInventorySection: boolean
    setShowInventorySection: (showInventorySection: boolean) => void

    // unstable v3
    listToShow: ListToShow
    setListToShow: (listToShow: ListToShow) => void

    /**
     * sorting
     */

    // instances
    instancesSortedBy: SupportedFilters
    instancesSortedByFilterDirection: SupportedFilterDirections
    sortInstancesBy: (filter: SupportedFilters) => void
    toggleFilterDirection: () => void

    // strategy chains
    strategyChainsSortedBy: SupportedStrategyChainsFilters
    strategyChainsSortedByFilterDirection: SupportedFilterDirections
    sortStrategyChainsBy: (filter: SupportedStrategyChainsFilters) => void
    toggleStrategyChainsFilterDirection: () => void

    /**
     * display mode
     */

    instanceDisplayMode: InstanceDisplayMode
    setInstanceDisplayMode: (mode: InstanceDisplayMode) => void
}>()(
    persist(
        (set) => ({
            /**
             * store
             */

            hasHydrated: false,
            setHasHydrated: (hasHydrated) => set(() => ({ hasHydrated })),

            /**
             * ui
             */

            // ui
            appStoreRefreshedAt: -1,
            setAppStoreRefreshedAt: (appStoreRefreshedAt) => set(() => ({ appStoreRefreshedAt })),
            showMobileMenu: false,
            setShowMobileMenu: (showMobileMenu) => set(() => ({ showMobileMenu })),

            // unstable v1
            showActivitySection: true,
            setShowActivitySection: (showActivitySection) => set(() => ({ showActivitySection })),
            showInstancesSection: true,
            setShowInstancesSection: (showInstancesSection) => set(() => ({ showInstancesSection })),
            showStrategiesSection: true,
            setShowStrategiesSection: (showStrategiesSection) => set(() => ({ showStrategiesSection })),

            // unstable v2
            showCandlesSection: true,
            setShowCandlesSection: (showCandlesSection) => set(() => ({ showCandlesSection })),
            showInventorySection: true,
            setShowInventorySection: (showInventorySection) => set(() => ({ showInventorySection })),

            // unstable v3
            listToShow: ListToShow.STRATEGIES,
            setListToShow: (listToShow) => set(() => ({ listToShow })),

            /**
             * sorting
             */

            // instances
            instancesSortedBy: SupportedFilters.INSTANCE_STARTED,
            instancesSortedByFilterDirection: SupportedFilterDirections.DESCENDING,
            sortInstancesBy: (filter) => set(() => ({ instancesSortedBy: filter })),
            toggleFilterDirection: () =>
                set((state) => ({
                    instancesSortedByFilterDirection:
                        state.instancesSortedByFilterDirection === SupportedFilterDirections.ASCENDING
                            ? SupportedFilterDirections.DESCENDING
                            : SupportedFilterDirections.ASCENDING,
                })),

            // strategy
            strategyChainsSortedBy: SupportedStrategyChainsFilters.TRADE_COUNT,
            strategyChainsSortedByFilterDirection: SupportedFilterDirections.DESCENDING,
            sortStrategyChainsBy: (filter) => set(() => ({ strategyChainsSortedBy: filter })),
            toggleStrategyChainsFilterDirection: () =>
                set((state) => ({
                    strategyChainsSortedByFilterDirection:
                        state.strategyChainsSortedByFilterDirection === SupportedFilterDirections.ASCENDING
                            ? SupportedFilterDirections.DESCENDING
                            : SupportedFilterDirections.ASCENDING,
                })),

            /**
             * display mode
             */

            instanceDisplayMode: InstanceDisplayMode.GROUPED,
            setInstanceDisplayMode: (mode) => set(() => ({ instanceDisplayMode: mode })),
        }),
        {
            name: `${APP_METADATA.SITE_DOMAIN}-app-store-${IS_DEV ? 'dev' : 'prod'}-${env.NEXT_PUBLIC_COMMIT_TIMESTAMP}`,
            storage: createJSONStorage(() => localStorage),
            skipHydration: false,
            onRehydrateStorage: () => (state) => {
                if (state && !state.hasHydrated) state.setHasHydrated(true)
            },
        },
    ),
)
