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
                lp: number
                balances: number
                total: number
            }
            deltas: {
                lp: number
                balances: number
                total: number
            }
        }
        hyperCore: {
            values: {
                perp: number
                spot: number
                total: number
            }
            deltas: {
                perp: number
                spot: number
                total: number
            }
            leverage?: number
            healthFactor?: number
        }
        portfolio: {
            totalValue: number
            netDelta: number
            netAPR: number
            lpFeeAPR: number
            fundingAPR: number
        }
    }

    // APR snapshots
    snapshots: {
        last: {
            timestamp: string
            netAPR: number
            lpFeeAPR: number
            fundingAPR: number
        } | null
        current: {
            lpFeeAPR: number
            fundingAPR: number
            netAPR: number
            formula: string
            note: string
        } | null
    }

    // Performance timings
    timings: {
        hyperEvm: {
            lp?: number
            balances?: number
        }
        hyperCore: {
            perp?: number
            spot?: number
        }
        total: number
    }
}
