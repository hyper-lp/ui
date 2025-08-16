import { NextRequest, NextResponse } from 'next/server'
import { positionFetcher } from '@/services/core/position-fetcher.service'
import { poolAPRService } from '@/services/dex/pool-apr.service'
import { priceAggregator } from '@/services/price/price-aggregator.service'
import { calculateLpDelta, calculateSpotDelta, calculatePerpDelta, calculateWalletDelta } from '@/utils/delta.util'
import type { AccountSnapshot } from '@/interfaces/account.interface'
import type { LPPosition } from '@/interfaces'

const sumUSDValue = (items: Array<{ valueUSD: number }>) => items.reduce((sum, item) => sum + item.valueUSD, 0)

const sumNotionalValue = (items: Array<{ notionalValue: number }>) => items.reduce((sum, item) => sum + item.notionalValue, 0)

const formatLPPositions = (positions: LPPosition[]) =>
    positions.map((p) => ({
        ...p,
        feeTier: p.fee ? `${(p.fee / 10000).toFixed(2)}%` : null,
    }))

export async function GET(_request: NextRequest, { params }: { params: Promise<{ account: string }> }) {
    try {
        const { account } = await params
        const accountAddress = account.toLowerCase()

        // Fetch all positions and pool APR data in parallel
        const [positionsData, poolAPRData] = await Promise.all([positionFetcher.fetchAllPositions(accountAddress), poolAPRService.fetchAllPoolAPR()])

        const {
            lpData: lpPositions,
            spotData: spotBalances,
            perpData: perpPositions,
            hyperEvmData: hyperEvmBalances,
            timings: fetchTimings,
        } = positionsData

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
                hyperEvm: {
                    values: {
                        lpsUSD: usdValues.lps,
                        balancesUSD: usdValues.balances,
                        totalUSD: usdValues.lps + usdValues.balances,
                    },
                    deltas: {
                        lpsHYPE: deltaValues.lps,
                        balancesHYPE: deltaValues.balances,
                        totalHYPE: deltaValues.lps + deltaValues.balances,
                    },
                },
                hyperCore: {
                    values: {
                        perpsUSD: usdValues.perps,
                        spotUSD: usdValues.spots,
                        totalUSD: usdValues.perps + usdValues.spots,
                    },
                    deltas: {
                        perpsHYPE: deltaValues.perps,
                        spotHYPE: deltaValues.spots,
                        totalHYPE: deltaValues.perps + deltaValues.spots,
                    },
                    perpAggregates,
                },
                portfolio: {
                    totalUSD: Object.values(usdValues).reduce((sum, val) => sum + val, 0),
                    netDeltaHYPE: Object.values(deltaValues).reduce((sum, val) => sum + val, 0),
                },
            },

            marketData: {
                poolAPR: poolAPRData,
            },

            prices: {
                HYPE:
                    positionFetcher.getTokenPrice('HYPE') ||
                    positionFetcher.getTokenPrice('WHYPE') ||
                    (await priceAggregator.getTokenPrice('HYPE')) ||
                    0,
                USDC: positionFetcher.getTokenPrice('USDC') || 1,
                USDT: positionFetcher.getTokenPrice('USDT') || 1,
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
                'Cache-Control': 'no-store, no-cache, must-revalidate',
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
