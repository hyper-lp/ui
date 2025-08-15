/**
 * Account and metrics-related interfaces
 * AccountData is the main entrypoint containing all account information
 */

import type { LPPosition, PerpPosition, SpotBalance, HyperEvmBalance } from './positions.interface'

/**
 * Main account data interface - the single source of truth for account information
 */
export interface AccountData {
    success: boolean
    error?: string

    // Account identification
    account: {
        evmAddress: string
        coreAddress: string
        name: string | null
        isMonitored: boolean
    }

    // Positions organized by platform
    positions: {
        hyperEvm: {
            lp: Array<LPPosition>
            balances: Array<HyperEvmBalance>
        }
        hyperCore: {
            perp: Array<PerpPosition>
            spot: Array<SpotBalance>
        }
    }

    // Metrics organized by platform
    metrics: {
        hyperEvm: {
            values: {
                lpUSD: number // LP positions value in USD
                balancesUSD: number // Wallet balances value in USD
                totalUSD: number // Total HyperEVM value in USD
            }
            deltas: {
                lpHYPE: number // LP delta in HYPE units
                balancesHYPE: number // Wallet delta in HYPE units
                totalHYPE: number // Total HyperEVM delta in HYPE units
            }
        }
        hyperCore: {
            values: {
                perpUSD: number // Perp positions value in USD
                spotUSD: number // Spot balances value in USD
                totalUSD: number // Total HyperCore value in USD
            }
            deltas: {
                perpHYPE: number // Perp delta in HYPE units (negative for shorts)
                spotHYPE: number // Spot delta in HYPE units
                totalHYPE: number // Total HyperCore delta in HYPE units
            }
            leverageRatio?: number // Leverage ratio (e.g., 2.5 for 2.5x)
            healthFactorPercent?: number // Health factor as percentage
        }
        portfolio: {
            totalValueUSD: number // Total portfolio value in USD
            netDeltaHYPE: number // Net delta exposure in HYPE units
            netAPRPercent: number // Net APR as percentage (e.g., 25.5 for 25.5%)
            lpFeeAPRPercent: number // LP fee APR as percentage
            fundingAPRPercent: number // Funding APR as percentage
        }
    }

    // APR snapshots
    snapshots: {
        last: {
            timestamp: string
            netAPRPercent: number // Net APR as percentage
            lpFeeAPRPercent: number // LP fee APR as percentage
            fundingAPRPercent: number // Funding APR as percentage
        } | null
        current: {
            lpFeeAPRPercent: number // LP fee APR as percentage
            fundingAPRPercent: number // Funding APR as percentage
            netAPRPercent: number // Net APR as percentage
            formula?: string // Optional formula description
            note?: string // Optional note
        } | null
    }

    // Performance timings
    timings: {
        hyperEvm: {
            lpMs?: number // LP fetch time in milliseconds
            balancesMs?: number // Balances fetch time in milliseconds
        }
        hyperCore: {
            perpMs?: number // Perp fetch time in milliseconds
            spotMs?: number // Spot fetch time in milliseconds
        }
        totalMs: number // Total fetch time in milliseconds
    }
}
