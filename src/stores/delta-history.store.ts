'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { APP_METADATA, IS_DEV } from '@/config/app.config'
import { env } from '@/env/t3-env'

export interface DeltaPoint {
    timestamp: number
    lpDelta: number
    perpDelta: number
    netDelta: number
    spotDelta?: number
    hyperEvmDelta?: number
}

export interface RebalanceEvent {
    timestamp: number
    method: 'taker' | 'maker' | 'manual'
    size: number // Size of the adjustment
    deltaBefore: number
    deltaAfter: number
    cost?: number // Cost in USD
    txHash?: string
}

export interface DeltaHistory {
    timestamps: number[]
    lpDeltas: number[]
    perpDeltas: number[]
    netDeltas: number[]
    spotDeltas: number[]
    hyperEvmDeltas: number[]
    rebalanceEvents: RebalanceEvent[]
    lastUpdated: number
}

interface DeltaHistoryStore {
    // Store histories per account
    histories: Record<string, DeltaHistory>

    // Max data points to keep (default 24 hours at 1-minute intervals)
    maxPoints: number

    // Add a new data point for an account
    addDataPoint: (account: string, point: DeltaPoint) => void

    // Add a rebalance event
    addRebalanceEvent: (account: string, event: RebalanceEvent) => void

    // Get history for an account
    getHistory: (account: string) => DeltaHistory

    // Clear history for an account
    clearHistory: (account: string) => void

    // Clear all histories
    clearAllHistories: () => void

    // Set max points
    setMaxPoints: (maxPoints: number) => void
}

const createEmptyHistory = (): DeltaHistory => ({
    timestamps: [],
    lpDeltas: [],
    perpDeltas: [],
    netDeltas: [],
    spotDeltas: [],
    hyperEvmDeltas: [],
    rebalanceEvents: [],
    lastUpdated: Date.now(),
})

export const useDeltaHistoryStore = create<DeltaHistoryStore>()(
    persist(
        (set, get) => ({
            histories: {},
            maxPoints: 1440, // 24 hours at 1-minute intervals

            addDataPoint: (account: string, point: DeltaPoint) => {
                set((state) => {
                    const history = state.histories[account] || createEmptyHistory()
                    const maxPoints = state.maxPoints

                    // Add new data point
                    const newHistory: DeltaHistory = {
                        ...history,
                        timestamps: [...history.timestamps, point.timestamp].slice(-maxPoints),
                        lpDeltas: [...history.lpDeltas, point.lpDelta].slice(-maxPoints),
                        perpDeltas: [...history.perpDeltas, point.perpDelta].slice(-maxPoints),
                        netDeltas: [...history.netDeltas, point.netDelta].slice(-maxPoints),
                        spotDeltas: [...history.spotDeltas, point.spotDelta || 0].slice(-maxPoints),
                        hyperEvmDeltas: [...history.hyperEvmDeltas, point.hyperEvmDelta || 0].slice(-maxPoints),
                        lastUpdated: Date.now(),
                    }

                    return {
                        histories: {
                            ...state.histories,
                            [account]: newHistory,
                        },
                    }
                })
            },

            addRebalanceEvent: (account: string, event: RebalanceEvent) => {
                set((state) => {
                    const history = state.histories[account] || createEmptyHistory()

                    // Keep only last 50 rebalance events
                    const newRebalanceEvents = [...history.rebalanceEvents, event].slice(-50)

                    return {
                        histories: {
                            ...state.histories,
                            [account]: {
                                ...history,
                                rebalanceEvents: newRebalanceEvents,
                                lastUpdated: Date.now(),
                            },
                        },
                    }
                })
            },

            getHistory: (account: string) => {
                const state = get()
                return state.histories[account] || createEmptyHistory()
            },

            clearHistory: (account: string) => {
                set((state) => {
                    const { [account]: removed, ...rest } = state.histories
                    void removed // Explicitly void the removed value to indicate it's intentionally unused
                    return { histories: rest }
                })
            },

            clearAllHistories: () => {
                set({ histories: {} })
            },

            setMaxPoints: (maxPoints: number) => {
                set({ maxPoints })
            },
        }),
        {
            name: `${APP_METADATA.SITE_DOMAIN}-delta-history-${IS_DEV ? 'dev' : 'prod'}-${env.NEXT_PUBLIC_COMMIT_TIMESTAMP}`,
            storage: createJSONStorage(() => localStorage),
            skipHydration: false,
            partialize: (state) => ({
                histories: state.histories,
                maxPoints: state.maxPoints,
            }),
        },
    ),
)
