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
