import { NextRequest, NextResponse } from 'next/server'
import { positionFetcher } from '@/services/core/position-fetcher.service'
import { poolAPRService } from '@/services/dex/pool-apr.service'
import { priceAggregator } from '@/services/price/price-aggregator.service'
import { calculateLpDelta, calculateSpotDelta, calculatePerpDelta, calculateWalletDelta } from '@/utils/delta.util'
import type { AccountSnapshot } from '@/interfaces/account.interface'
import type { LPPosition } from '@/interfaces'

// Simple in-memory cache with 5-second TTL
const CACHE_TTL = 5000 // 5 seconds
const cache = new Map<string, { data: AccountSnapshot; timestamp: number }>()

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
        const cacheKey = accountAddress

        // Check cache first
        const cached = cache.get(cacheKey)
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            // Return cached data with cache hit header
            return NextResponse.json(cached.data, {
                headers: {
                    'X-Cache': 'HIT',
                    'X-Cache-Age': String(Date.now() - cached.timestamp),
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                },
            })
        }

        // Fetch positions first to get user's pool addresses
        const positionsData = await positionFetcher.fetchAllPositions(accountAddress)

        const {
            lpData: lpPositions,
            spotData: spotBalances,
            perpData: perpPositions,
            hyperEvmData: hyperEvmBalances,
            timings: fetchTimings,
        } = positionsData

        // Extract unique pool addresses from user's LP positions
        const userPoolAddresses = [...new Set(lpPositions.map((lp) => lp.pool).filter(Boolean))] as string[]

        // Fetch APR only for user's pools (or empty if no pools)
        const poolAPRData =
            userPoolAddresses.length > 0
                ? await poolAPRService.fetchPoolAPRByAddresses(userPoolAddresses)
                : { pools: [], averageAPR24h: 0, totalTVL: 0, totalVolume24h: 0, totalFees24h: 0, lastUpdated: Date.now() }

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

        // Store in cache
        cache.set(cacheKey, {
            data: accountData,
            timestamp: Date.now(),
        })

        // Clean up old cache entries (keep max 100 entries)
        if (cache.size > 100) {
            const firstKey = cache.keys().next().value
            if (firstKey) cache.delete(firstKey)
        }

        return NextResponse.json(accountData, {
            headers: {
                'X-Cache': 'MISS',
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
