import { NextRequest, NextResponse } from 'next/server'
import { positionFetcher } from '@/services/core/position-fetcher.service'
import { calculateLpDelta, calculateSpotDelta, calculatePerpDelta, calculateWalletDelta } from '@/utils/delta.util'
import type { AccountSnapshot } from '@/interfaces/account.interface'
import type { LPPosition } from '@/interfaces'

// Helper function to calculate total USD value
const sumUSDValue = (items: Array<{ valueUSD: number }>) => items.reduce((sum, item) => sum + item.valueUSD, 0)

const sumNotionalValue = (items: Array<{ notionalValue: number }>) => items.reduce((sum, item) => sum + item.notionalValue, 0)

// Helper function to format LP positions with fee tier
const formatLPPositions = (positions: LPPosition[]) =>
    positions.map((p) => ({
        ...p,
        feeTier: p.fee ? `${(p.fee / 10000).toFixed(2)}%` : null,
    }))

// Helper to build metrics for a platform
const buildPlatformMetrics = (values: { primary: number; secondary: number }, deltas: { primary: number; secondary: number }) => ({
    values: {
        lpsUSD: values.primary,
        balancesUSD: values.secondary,
        totalUSD: values.primary + values.secondary,
    },
    deltas: {
        lpsHYPE: deltas.primary,
        balancesHYPE: deltas.secondary,
        totalHYPE: deltas.primary + deltas.secondary,
    },
})

const buildCorePlatformMetrics = (values: { perps: number; spots: number }, deltas: { perps: number; spots: number }) => ({
    values: {
        perpsUSD: values.perps,
        spotUSD: values.spots,
        totalUSD: values.perps + values.spots,
    },
    deltas: {
        perpsHYPE: deltas.perps,
        spotHYPE: deltas.spots,
        totalHYPE: deltas.perps + deltas.spots,
    },
})

export async function GET(_request: NextRequest, { params }: { params: Promise<{ account: string }> }) {
    try {
        const { account } = await params
        const accountAddress = account.toLowerCase()

        // Fetch all positions from blockchain
        const {
            lpData: lpPositions,
            spotData: spotBalances,
            perpData: perpPositions,
            hyperEvmData: hyperEvmBalances,
            timings: fetchTimings,
        } = await positionFetcher.fetchAllPositions(accountAddress)

        // Calculate USD values
        const usdValues = {
            lps: sumUSDValue(lpPositions),
            spots: sumUSDValue(spotBalances),
            perps: sumNotionalValue(perpPositions),
            balances: sumUSDValue(hyperEvmBalances || []),
        }

        // Calculate delta exposures in HYPE units
        const deltaValues = {
            lps: calculateLpDelta(lpPositions),
            spots: calculateSpotDelta(spotBalances),
            perps: calculatePerpDelta(perpPositions),
            balances: calculateWalletDelta(hyperEvmBalances),
        }

        // Calculate perp aggregates
        const perpAggregates =
            perpPositions.length > 0
                ? {
                      totalMargin: perpPositions.reduce((sum, p) => sum + p.marginUsed, 0),
                      totalNotional: perpPositions.reduce((sum, p) => sum + Math.abs(p.notionalValue), 0),
                      totalPnl: perpPositions.reduce((sum, p) => sum + p.unrealizedPnl, 0),
                      avgLeverage: 0,
                  }
                : { totalMargin: 0, totalNotional: 0, totalPnl: 0, avgLeverage: 0 }

        if (perpAggregates.totalMargin > 0) {
            perpAggregates.avgLeverage = perpAggregates.totalNotional / perpAggregates.totalMargin
        }

        // Build the account snapshot
        const accountData: AccountSnapshot = {
            success: true,
            timestamp: Date.now(),
            evmAddress: accountAddress,
            coreAddress: accountAddress,

            positions: {
                hyperEvm: {
                    lps: formatLPPositions(lpPositions),
                    balances: hyperEvmBalances,
                },
                hyperCore: {
                    perps: perpPositions,
                    spots: spotBalances,
                },
            },

            metrics: {
                hyperEvm: buildPlatformMetrics(
                    { primary: usdValues.lps, secondary: usdValues.balances },
                    { primary: deltaValues.lps, secondary: deltaValues.balances },
                ),
                hyperCore: {
                    ...buildCorePlatformMetrics(
                        { perps: usdValues.perps, spots: usdValues.spots },
                        { perps: deltaValues.perps, spots: deltaValues.spots },
                    ),
                    perpAggregates,
                },
                portfolio: {
                    totalUSD: Object.values(usdValues).reduce((sum, val) => sum + val, 0),
                    netDeltaHYPE: Object.values(deltaValues).reduce((sum, val) => sum + val, 0),
                },
            },

            // Price data - get real HYPE price from positionFetcher
            prices: {
                HYPE: positionFetcher.getTokenPrice('HYPE') || positionFetcher.getTokenPrice('WHYPE') || 100,
                USDC: 1,
                USDT: 1,
            },

            timings: {
                hyperEvm: {
                    lpsMs: fetchTimings.lpFetch,
                    balancesMs: fetchTimings.evmFetch,
                },
                hyperCore: {
                    perpsMs: fetchTimings.perpFetch,
                    spotsMs: fetchTimings.spotFetch,
                },
            },
        }

        return NextResponse.json(accountData, {
            headers: {
                'Cache-Control': 'public, max-age=30, s-maxage=30, stale-while-revalidate=60',
            },
        })
    } catch (error) {
        console.error('Error fetching positions:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch positions',
            },
            { status: 500 },
        )
    }
}
