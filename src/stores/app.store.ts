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
    setSnapshots: (snapshots: AccountSnapshot[]) => void
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
            maxSnapshots: 20, // Reduced to save localStorage space
            lastSnapshotAddedAt: -1, // -1 means no snapshot has been added yet
            currentAddress: null,
            isFetchingAccount: false,
            accountError: null,

            // Account actions
            addSnapshot: (snapshot: AccountSnapshot) =>
                set((state) => {
                    const address = snapshot.evmAddress.toLowerCase()
                    const currentSnapshots = state.addressSnapshots[address] || []

                    // Clean up old addresses if we have too many (keep only 5 most recent addresses)
                    const addressEntries = Object.entries(state.addressSnapshots)
                    let cleanedSnapshots = { ...state.addressSnapshots }

                    if (addressEntries.length > 5) {
                        // Sort by most recent snapshot timestamp
                        const sortedAddresses = addressEntries
                            .map(([addr, snaps]) => ({
                                address: addr,
                                lastTime: snaps[snaps.length - 1]?.timestamp || 0,
                            }))
                            .sort((a, b) => b.lastTime - a.lastTime)

                        // Keep only top 5 addresses
                        cleanedSnapshots = {}
                        sortedAddresses.slice(0, 5).forEach(({ address: addr }) => {
                            cleanedSnapshots[addr] = state.addressSnapshots[addr]
                        })
                    }

                    return {
                        addressSnapshots: {
                            ...cleanedSnapshots,
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
            setSnapshots: (snapshots: AccountSnapshot[]) => {
                const state = get()
                const address = state.currentAddress?.toLowerCase()
                if (!address) return
                set((s) => ({
                    addressSnapshots: {
                        ...s.addressSnapshots,
                        [address]: snapshots,
                    },
                    lastSnapshotAddedAt: Date.now(),
                }))
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
            storage: createJSONStorage(() => ({
                getItem: (name: string) => {
                    try {
                        return localStorage.getItem(name)
                    } catch (error) {
                        console.error('Failed to get from localStorage:', error)
                        return null
                    }
                },
                setItem: (name: string, value: string) => {
                    try {
                        localStorage.setItem(name, value)
                    } catch (error) {
                        console.error('localStorage quota exceeded, clearing old data...')
                        // Clear old localStorage items if quota exceeded
                        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                            // Try to clear old versions of the store
                            const keys = Object.keys(localStorage)
                            keys.forEach((key) => {
                                if (
                                    key.includes('app-store') &&
                                    (!env.NEXT_PUBLIC_COMMIT_TIMESTAMP || !key.includes(env.NEXT_PUBLIC_COMMIT_TIMESTAMP))
                                ) {
                                    localStorage.removeItem(key)
                                }
                            })

                            // Try again after cleanup
                            try {
                                localStorage.setItem(name, value)
                            } catch {
                                // If still failing, clear everything and try once more
                                localStorage.clear()
                                localStorage.setItem(name, value)
                            }
                        }
                    }
                },
                removeItem: (name: string) => {
                    try {
                        localStorage.removeItem(name)
                    } catch (error) {
                        console.error('Failed to remove from localStorage:', error)
                    }
                },
            })),
            skipHydration: false,
            onRehydrateStorage: () => (state) => {
                if (state && !state.hasHydrated) state.setHasHydrated(true)
            },
            partialize: (state) => ({
                sectionStates: state.sectionStates,
                // Don't persist snapshots - they should be fetched fresh from API
                // addressSnapshots are intentionally excluded
                maxSnapshots: state.maxSnapshots,
                currentAddress: state.currentAddress,
            }),
        },
    ),
)
