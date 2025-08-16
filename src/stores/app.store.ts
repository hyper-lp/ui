'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { APP_METADATA, IS_DEV } from '@/config/app.config'
import { env } from '@/env/t3-env'
import type { AccountSnapshot } from '@/interfaces/account.interface'

interface AppStore {
    // Hydration state
    hasHydrated: boolean
    setHasHydrated: (hasHydrated: boolean) => void

    // UI state
    showMobileMenu: boolean
    setShowMobileMenu: (showMobileMenu: boolean) => void

    // Section collapse states for account page
    sectionStates: {
        charts: boolean
        summary: boolean
        hyperEvm: boolean
        hyperCore: boolean
        transactions: boolean
        debug: boolean
    }
    toggleSection: (section: keyof AppStore['sectionStates']) => void

    // Account snapshots for delta tracking - map by address
    addressSnapshots: Record<string, AccountSnapshot[]>
    lastSnapshotAddedAt: number
    maxSnapshots: number
    currentAddress: string | null
    isFetchingAccount: boolean
    accountError: Error | null

    // Account actions
    addSnapshot: (snapshot: AccountSnapshot) => void
    getSnapshots: () => AccountSnapshot[]
    clearSnapshots: () => void
    setMaxSnapshots: (maxSnapshots: number) => void
    setCurrentAddress: (address: string | null) => void
    setFetchingAccount: (isFetching: boolean) => void
    setAccountError: (error: Error | null) => void

    // Selectors
    getCurrentAccountSnapshots: () => AccountSnapshot[]
    getLatestSnapshot: () => AccountSnapshot | null
}

export const useAppStore = create<AppStore>()(
    persist(
        (set, get) => ({
            // Hydration state
            hasHydrated: false,
            setHasHydrated: (hasHydrated) => set(() => ({ hasHydrated })),

            // UI state
            showMobileMenu: false,
            setShowMobileMenu: (showMobileMenu) => set(() => ({ showMobileMenu })),

            // Section collapse states - default all open
            sectionStates: {
                charts: false,
                summary: true,
                hyperEvm: true,
                hyperCore: true,
                transactions: false,
                debug: false,
            },
            toggleSection: (section) =>
                set((state) => ({
                    sectionStates: {
                        ...state.sectionStates,
                        [section]: !state.sectionStates[section],
                    },
                })),

            // Account snapshots management
            addressSnapshots: {},
            maxSnapshots: 30, // 30 minutes at 1-minute intervals
            lastSnapshotAddedAt: -1, // -1 means no snapshot has been added yet
            currentAddress: null,
            isFetchingAccount: false,
            accountError: null,

            // Account actions
            addSnapshot: (snapshot: AccountSnapshot) =>
                set((state) => {
                    const address = snapshot.evmAddress.toLowerCase()
                    const currentSnapshots = state.addressSnapshots[address] || []
                    return {
                        addressSnapshots: {
                            ...state.addressSnapshots,
                            [address]: [...currentSnapshots, snapshot].slice(-state.maxSnapshots),
                        },
                        lastSnapshotAddedAt: Date.now(),
                    }
                }),
            getSnapshots: () => {
                const state = get()
                const address = state.currentAddress?.toLowerCase()
                if (!address) return []
                return (state.addressSnapshots[address] || []).sort((a, b) => a.timestamp - b.timestamp)
            },
            clearSnapshots: () => {
                const state = get()
                const address = state.currentAddress?.toLowerCase()
                if (!address) return
                set((s) => ({
                    addressSnapshots: {
                        ...s.addressSnapshots,
                        [address]: [],
                    },
                    lastSnapshotAddedAt: -1,
                }))
            },
            setMaxSnapshots: (maxSnapshots: number) => set({ maxSnapshots }),
            setCurrentAddress: (address: string | null) => set({ currentAddress: address }),
            setFetchingAccount: (isFetching: boolean) => set({ isFetchingAccount: isFetching }),
            setAccountError: (error: Error | null) => set({ accountError: error }),

            // Selectors
            getCurrentAccountSnapshots: () => {
                const state = get()
                const address = state.currentAddress?.toLowerCase()
                if (!address) return []
                return (state.addressSnapshots[address] || []).sort((a, b) => a.timestamp - b.timestamp)
            },

            getLatestSnapshot: () => {
                const snapshots = get().getCurrentAccountSnapshots()
                return snapshots[snapshots.length - 1] || null
            },
        }),
        {
            name: `${APP_METADATA.SITE_DOMAIN}-app-store-${IS_DEV ? 'dev' : 'prod'}-${env.NEXT_PUBLIC_COMMIT_TIMESTAMP}`,
            storage: createJSONStorage(() => localStorage),
            skipHydration: false,
            onRehydrateStorage: () => (state) => {
                if (state && !state.hasHydrated) state.setHasHydrated(true)
            },
            partialize: (state) => ({
                sectionStates: state.sectionStates,
                addressSnapshots: state.addressSnapshots,
                maxSnapshots: state.maxSnapshots,
                lastSnapshotAddedAt: state.lastSnapshotAddedAt,
                currentAddress: state.currentAddress,
            }),
        },
    ),
)
