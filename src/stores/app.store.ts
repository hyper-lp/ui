'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { APP_METADATA, IS_DEV } from '@/config/app.config'
import { env } from '@/env/t3-env'

interface AppStore {
    // Hydration state
    hasHydrated: boolean
    setHasHydrated: (hasHydrated: boolean) => void

    // UI state
    showMobileMenu: boolean
    setShowMobileMenu: (showMobileMenu: boolean) => void

    // User preferences
    theme: 'light' | 'dark' | 'system'
    setTheme: (theme: 'light' | 'dark' | 'system') => void

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
    setSectionState: (section: keyof AppStore['sectionStates'], isOpen: boolean) => void
}

export const useAppStore = create<AppStore>()(
    persist(
        (set) => ({
            // Hydration state
            hasHydrated: false,
            setHasHydrated: (hasHydrated) => set(() => ({ hasHydrated })),

            // UI state
            showMobileMenu: false,
            setShowMobileMenu: (showMobileMenu) => set(() => ({ showMobileMenu })),

            // User preferences
            theme: 'system',
            setTheme: (theme) => set(() => ({ theme })),

            // Section collapse states - default all open
            sectionStates: {
                charts: false,
                summary: true,
                hyperEvm: false,
                hyperCore: false,
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
            setSectionState: (section, isOpen) =>
                set((state) => ({
                    sectionStates: {
                        ...state.sectionStates,
                        [section]: isOpen,
                    },
                })),
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
