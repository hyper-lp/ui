import { NextRequest, NextResponse } from 'next/server'
import { positionFetcher } from '@/services/core/position-fetcher.service'
import { poolAPRService } from '@/services/dex/pool-apr.service'
import { fundingHistoryService } from '@/services/core/funding-history.service'
import { priceAggregator } from '@/services/price/price-aggregator.service'
import { hyperEvmRpcService } from '@/services/evm/hyperevm-rpc.service'
import { calculateLpDelta, calculateSpotDelta, calculatePerpDelta, calculateWalletDelta } from '@/utils/delta.util'
import type { AccountSnapshot } from '@/interfaces/account.interface'
import type { LPPosition, PerpPosition } from '@/interfaces'
import { SCHEMA_VERSION } from '@/constants/schema.constants'

// Simple in-memory cache with 5-second TTL
const CACHE_TTL = 5000 // 5 seconds
const cache = new Map<string, { data: AccountSnapshot; timestamp: number }>()

export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ account: string }> },
): Promise<NextResponse<AccountSnapshot | { success: false; error: string }>> {
    const sumUSDValue = (items: Array<{ valueUSD: number }>) => items.reduce((sum, item) => sum + item.valueUSD, 0)
    const sumPerpValue = (items: PerpPosition[]) => items.reduce((sum, item) => sum + item.notionalValue + item.unrealizedPnl, 0)
    const formatLPPositions = (positions: LPPosition[]) =>
        positions.map((p) => ({
            ...p,
            feeTier: p.fee ? `${(p.fee / 10000).toFixed(2)}%` : null,
        }))

    try {
        const params = await context.params
        const { account } = params
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

        // Track API user (fire and forget, don't block the API if it fails)
        fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/analytics/track-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: accountAddress }),
        }).catch(() => {
            // Silently ignore tracking failures
        })

        // Fetch positions first to get user's pool addresses
        const positionsData = await positionFetcher.fetchAllPositions(accountAddress)

        const {
            lpData: lpPositions,
            spotData: spotBalances,
            perpData: perpPositions,
            withdrawableUSDC,
            hyperEvmData: hyperEvmBalances,
            fundingRates,
            timings: fetchTimings,
        } = positionsData

        // Fetch HyperEVM nonce
        const hyperEvmNonce = await hyperEvmRpcService.getNonce(accountAddress)

        // Extract unique pool addresses from user's LP positions
        const userPoolAddresses = [...new Set(lpPositions.map((lp) => lp.pool).filter(Boolean))] as string[]

        // Fetch APR only for user's pools (or empty if no pools)
        const poolAPRData =
            userPoolAddresses.length > 0
                ? await poolAPRService.fetchPoolAPRByAddresses(userPoolAddresses)
                : { pools: [], averageAPR24h: 0, totalTVL: 0, totalVolume24h: 0, totalFees24h: 0, lastUpdated: Date.now() }

        // Calculate unclaimed fees total
        const unclaimedFeesTotal = lpPositions.reduce((sum, lp) => sum + (lp.unclaimedFeesUSD || 0), 0)

        // Calculate USD values
        const usdValues = {
            lps: sumUSDValue(lpPositions),
            spots: sumUSDValue(spotBalances),
            perps: sumPerpValue(perpPositions),
            balances: sumUSDValue(hyperEvmBalances || []),
        }

        // Calculate perp breakdown
        const perpsNotionalUSD = perpPositions.reduce((sum, item) => sum + item.notionalValue, 0)
        const perpsPnlUSD = perpPositions.reduce((sum, item) => sum + item.unrealizedPnl, 0)

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

        // Calculate user-specific weighted average LP APRs for different time periods
        const lpAPRs = {
            apr24h: null as number | null,
            apr7d: null as number | null,
            apr30d: null as number | null,
        }

        if (lpPositions.length > 0 && poolAPRData?.pools) {
            let totalValue = 0
            const weightedSums = {
                apr24h: 0,
                apr7d: 0,
                apr30d: 0,
            }

            lpPositions.forEach((position) => {
                if (!position.pool || position.valueUSD <= 0) return

                const poolSnapshot = poolAPRData.pools.find(
                    (pool) =>
                        pool.poolAddress.toLowerCase() === position.pool?.toLowerCase() && pool.dex.toLowerCase() === position.dex.toLowerCase(),
                )

                if (poolSnapshot) {
                    totalValue += position.valueUSD
                    weightedSums.apr24h += poolSnapshot.apr24h * position.valueUSD
                    weightedSums.apr7d += poolSnapshot.apr7d * position.valueUSD
                    weightedSums.apr30d += poolSnapshot.apr30d * position.valueUSD
                } else {
                }
            })

            if (totalValue > 0) {
                lpAPRs.apr24h = weightedSums.apr24h / totalValue
                lpAPRs.apr7d = weightedSums.apr7d / totalValue
                lpAPRs.apr30d = weightedSums.apr30d / totalValue
            } else {
            }
        } else {
        }

        // Calculate user-specific weighted average funding APR for perps
        // Initialize with current funding rate (live)
        const fundingAPRs = {
            current: null as number | null, // Current funding rate
            apr24h: null as number | null, // 24h historical average
            apr7d: null as number | null, // 7d historical average
            apr30d: null as number | null, // 30d historical average
        }

        if (perpPositions.length > 0) {
            // Current funding rate calculation (live rate)
            if (fundingRates && Object.keys(fundingRates).length > 0) {
                let totalNotional = 0
                let weightedFundingSum = 0

                perpPositions.forEach((position) => {
                    const notional = Math.abs(position.notionalValue)
                    const fundingRate = fundingRates[position.asset]

                    if (notional > 0 && fundingRate !== undefined) {
                        totalNotional += notional
                        weightedFundingSum += fundingRate * notional
                    }
                })

                if (totalNotional > 0) {
                    fundingAPRs.current = weightedFundingSum / totalNotional
                }
            }

            // Fetch historical funding APRs from Hyperliquid
            const historicalFunding = await fundingHistoryService.calculateWeightedFundingAPRs(
                perpPositions.map((p) => ({
                    asset: p.asset,
                    notionalValue: p.notionalValue,
                })),
            )

            fundingAPRs.apr24h = historicalFunding.apr24h
            fundingAPRs.apr7d = historicalFunding.apr7d
            fundingAPRs.apr30d = historicalFunding.apr30d
        }

        // Calculate combined APRs for different time periods (weighted by USD value)
        const combinedAPRs = {
            apr24h: null as number | null,
            apr7d: null as number | null,
            apr30d: null as number | null,
        }

        const lpValue = usdValues.lps
        const perpValue = perpAggregates.totalMargin // Use margin for perp weight, not notional
        const totalValue = lpValue + perpValue

        if (totalValue > 0) {
            // 24h combined APR
            if (lpAPRs.apr24h !== null || fundingAPRs.apr24h !== null) {
                let weightedSum = 0
                if (lpAPRs.apr24h !== null) {
                    weightedSum += lpAPRs.apr24h * lpValue
                }
                if (fundingAPRs.apr24h !== null) {
                    weightedSum += fundingAPRs.apr24h * perpValue
                }
                combinedAPRs.apr24h = weightedSum / totalValue
            }

            // 7d combined APR
            if (lpAPRs.apr7d !== null || fundingAPRs.apr7d !== null) {
                let weightedSum = 0
                if (lpAPRs.apr7d !== null) {
                    weightedSum += lpAPRs.apr7d * lpValue
                }
                if (fundingAPRs.apr7d !== null) {
                    weightedSum += fundingAPRs.apr7d * perpValue
                }
                combinedAPRs.apr7d = weightedSum / totalValue
            }

            // 30d combined APR
            if (lpAPRs.apr30d !== null || fundingAPRs.apr30d !== null) {
                let weightedSum = 0
                if (lpAPRs.apr30d !== null) {
                    weightedSum += lpAPRs.apr30d * lpValue
                }
                if (fundingAPRs.apr30d !== null) {
                    weightedSum += fundingAPRs.apr30d * perpValue
                }
                combinedAPRs.apr30d = weightedSum / totalValue
            }
        }

        // Build the account snapshot
        const accountData: AccountSnapshot = {
            success: true,
            schemaVersion: SCHEMA_VERSION.CURRENT, // Use constant for schema version
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
                        lpsUSDWithFees: usdValues.lps + unclaimedFeesTotal,
                        unclaimedFeesUSD: unclaimedFeesTotal,
                        balancesUSD: usdValues.balances,
                        totalUSD: usdValues.lps + unclaimedFeesTotal + usdValues.balances,
                    },
                    deltas: {
                        lpsHYPE: deltaValues.lps,
                        balancesHYPE: deltaValues.balances,
                        totalHYPE: deltaValues.lps + deltaValues.balances,
                    },
                    apr: {
                        weightedAvg24h: lpAPRs.apr24h,
                        weightedAvg7d: lpAPRs.apr7d,
                        weightedAvg30d: lpAPRs.apr30d,
                    },
                },
                hyperCore: {
                    values: {
                        // perps
                        perpsNotionalUSD: perpsNotionalUSD,
                        perpsPnlUSD: perpsPnlUSD,
                        perpsNotionalUSDPlusPnlUsd: usdValues.perps, // This is notional + PnL
                        withdrawableUSDC: withdrawableUSDC || 0,

                        // spot
                        perpsUSD: usdValues.perps, // Keep for backward compatibility
                        spotUSD: usdValues.spots,

                        // total
                        totalUSD: usdValues.perps + usdValues.spots,
                    },
                    deltas: {
                        perpsHYPE: deltaValues.perps,
                        spotHYPE: deltaValues.spots,
                        totalHYPE: deltaValues.perps + deltaValues.spots,
                    },
                    perpAggregates,
                    apr: {
                        currentFundingAPR: fundingAPRs.current,
                        fundingAPR24h: fundingAPRs.apr24h,
                        fundingAPR7d: fundingAPRs.apr7d,
                        fundingAPR30d: fundingAPRs.apr30d,
                    },
                },
                portfolio: {
                    totalUSD: usdValues.lps + unclaimedFeesTotal + usdValues.perps + usdValues.balances + usdValues.spots + (withdrawableUSDC || 0),
                    deployedAUM: usdValues.lps + unclaimedFeesTotal + usdValues.perps,
                    netDeltaHYPE: Object.values(deltaValues).reduce((sum, val) => sum + val, 0),
                    strategyDelta: deltaValues.lps + deltaValues.perps,
                    // strategyDelta: deltaValues.lps - usdValues.perps,
                    apr: {
                        combined24h: combinedAPRs.apr24h,
                        combined7d: combinedAPRs.apr7d,
                        combined30d: combinedAPRs.apr30d,
                    },
                },
            },

            marketData: {
                poolAPR: poolAPRData,
                fundingRates: fundingRates || {},
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

            wallet: {
                hyperEvmNonce,
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
