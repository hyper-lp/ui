/**
 * Account and metrics-related interfaces
 * AccountData is the main entrypoint containing all account information
 */

import type { LPPosition, PerpPosition, SpotBalance, HyperEvmBalance } from './positions.interface'
import type { AggregatedPoolAPR } from './pool-apr.interface'

/**
 * Main account data interface - the single source of truth for account information
 */
export interface AccountSnapshot {
    success: boolean
    error?: string
    schemaVersion: string // Semantic versioning for data structure (e.g., '1.0.0')
    timestamp: number
    evmAddress: string
    coreAddress: string

    // 1. Positions organized by platform
    positions: {
        hyperEvm: {
            lps: Array<LPPosition>
            balances: Array<HyperEvmBalance>
        }
        hyperCore: {
            perps: Array<PerpPosition>
            spots: Array<SpotBalance>
        }
    }

    // 2. Metrics organized by platform
    metrics: {
        hyperEvm: {
            values: {
                lpsUSD: number // LP positions value in USD (without unclaimed fees)
                lpsUSDWithFees: number // LP positions value including unclaimed fees
                unclaimedFeesUSD: number // Total unclaimed fees in USD
                balancesUSD: number // Wallet balances value in USD
                totalUSD: number // Total HyperEVM value in USD
            }
            deltas: {
                lpsHYPE: number // LP delta in HYPE units
                balancesHYPE: number // Wallet delta in HYPE units
                totalHYPE: number // Total HyperEVM delta in HYPE units
            }
            apr: {
                weightedAvg24h: number | null // Weighted average 24h APR for LP positions
                weightedAvg7d: number | null // Weighted average 7d APR for LP positions
                weightedAvg30d: number | null // Weighted average 30d APR for LP positions
            }
            // add other risk assets deltas here
        }
        hyperCore: {
            values: {
                perpsUSD: number // Perp positions value in USD
                spotUSD: number // Spot balances value in USD
                totalUSD: number // Total HyperCore value in USD
                withdrawableUSDC: number // Withdrawable USDC from HyperCore
            }
            deltas: {
                perpsHYPE: number // Perp delta in HYPE units (negative for shorts)
                spotHYPE: number // Spot delta in HYPE units
                totalHYPE: number // Total HyperCore delta in HYPE units
            }
            perpAggregates: {
                totalMargin: number // Total margin used across all perp positions
                totalNotional: number // Total notional value (absolute) across all perp positions
                totalPnl: number // Total unrealized PnL across all perp positions
                avgLeverage: number // Average leverage across all perp positions
            }
            apr: {
                currentFundingAPR: number | null // Current (live) weighted funding APR for perp positions
                fundingAPR24h: number | null // 24h historical average funding APR
                fundingAPR7d: number | null // 7d historical average funding APR
                fundingAPR30d: number | null // 30d historical average funding APR
            }
            leverageRatio?: number // Leverage ratio (e.g., 2.5 for 2.5x)
            healthFactorPercent?: number // Health factor as percentage
        }
        portfolio: {
            totalUSD: number // Total portfolio value in USD
            deployedAUM: number // Deployed AUM (LPs + Perps) in USD
            netDeltaHYPE: number // Net delta exposure in HYPE units
            strategyDelta: number // LP-perp delta difference (hedge effectiveness)
            apr: {
                combined24h: number | null // Combined 24h APR from LPs and funding
                combined7d: number | null // Combined 7d APR from LPs and funding
                combined30d: number | null // Combined 30d APR from LPs and funding
            }
        }
    }

    // 3. Market data (not user-specific)
    marketData: {
        poolAPR?: AggregatedPoolAPR // HYPE/USDT0 pool APR data across all DEXs
        fundingRates?: Record<string, number> // coin -> annualized APR for shorts
    }

    // 4. prices
    prices: {
        HYPE: number // HYPE price in USD
        USDC: number // USDC price in USD
        USDT: number // USDT price in USD
    }

    // 5. Performance timings
    timings: {
        hyperEvm: {
            lpsMs: number // LP fetch time in milliseconds
            balancesMs: number // Balances fetch time in milliseconds
        }
        hyperCore: {
            perpsMs: number // Perp fetch time in milliseconds
            spotsMs: number // Spot fetch time in milliseconds
        }
    }
}
