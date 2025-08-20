import { NextRequest, NextResponse } from 'next/server'
import { positionFetcher } from '@/services/core/position-fetcher.service'
import { poolAPRService } from '@/services/dex/pool-apr.service'
import { fundingHistoryService } from '@/services/core/funding-history.service'
import { priceAggregator } from '@/services/price/price-aggregator.service'
import { hyperEvmRpcService } from '@/services/evm/hyperevm-rpc.service'
import { calculateLpDelta, calculateSpotDelta, calculatePerpDelta, calculateWalletDelta } from '@/utils/delta.util'
import { MemoryCache, createCachedResponse } from '@/utils/cache.util'
import type { AccountSnapshot } from '@/interfaces/account.interface'
import type { LPPosition, PerpPosition } from '@/interfaces'
import { SCHEMA_VERSION } from '@/constants/schema.constants'

// Simple in-memory cache with 2-second TTL
const cache = new MemoryCache<AccountSnapshot>(2000)

export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ account: string }> },
): Promise<NextResponse<AccountSnapshot | { success: false; error: string }>> {
    const sumUSDValue = (items: Array<{ valueUSD: number }>) => items.reduce((sum, item) => sum + item.valueUSD, 0)
    const sumPerpValue = (items: PerpPosition[]) => items.reduce((sum, item) => sum + item.marginUsed + item.unrealizedPnl, 0)
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
        const cachedData = cache.get(cacheKey)
        if (cachedData) {
            return createCachedResponse(cachedData, true, cache.getCacheAge(cacheKey))
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
        const perpsMarginUSD = perpPositions.reduce((sum, item) => sum + item.marginUsed, 0)
        const perpsMarginUSDPlusPnlUSD = perpsMarginUSD + perpsPnlUSD

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
        const fundingAPRs = {
            avgAPR24h: null as number | null, // 24h historical average
            avgAPR7d: null as number | null, // 7d historical average
            avgAPR30d: null as number | null, // 30d historical average
        }

        if (perpPositions.length > 0) {
            // Fetch historical funding APRs from Hyperliquid
            // Pass margin-weighted positions with direction
            const positionsForFunding = perpPositions.map((p) => ({
                asset: p.asset,
                marginValue: p.marginUsed,
                isShort: p.size < 0,
            }))

            const historicalFunding = await fundingHistoryService.calculateWeightedFundingAPRs(positionsForFunding)

            fundingAPRs.avgAPR24h = historicalFunding.apr24h
            fundingAPRs.avgAPR7d = historicalFunding.apr7d
            fundingAPRs.avgAPR30d = historicalFunding.apr30d
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
            if (lpAPRs.apr24h !== null || fundingAPRs.avgAPR24h !== null) {
                let weightedSum = 0
                if (lpAPRs.apr24h !== null) {
                    weightedSum += lpAPRs.apr24h * lpValue
                }
                if (fundingAPRs.avgAPR24h !== null) {
                    weightedSum += fundingAPRs.avgAPR24h * perpValue
                }
                combinedAPRs.apr24h = weightedSum / totalValue
            }

            // 7d combined APR
            if (lpAPRs.apr7d !== null || fundingAPRs.avgAPR7d !== null) {
                let weightedSum = 0
                if (lpAPRs.apr7d !== null) {
                    weightedSum += lpAPRs.apr7d * lpValue
                }
                if (fundingAPRs.avgAPR7d !== null) {
                    weightedSum += fundingAPRs.avgAPR7d * perpValue
                }
                combinedAPRs.apr7d = weightedSum / totalValue
            }

            // 30d combined APR
            if (lpAPRs.apr30d !== null || fundingAPRs.avgAPR30d !== null) {
                let weightedSum = 0
                if (lpAPRs.apr30d !== null) {
                    weightedSum += lpAPRs.apr30d * lpValue
                }
                if (fundingAPRs.avgAPR30d !== null) {
                    weightedSum += fundingAPRs.avgAPR30d * perpValue
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
                        // perps breakdown
                        perpsNotionalUSD: perpsNotionalUSD,
                        perpsPnlUSD: perpsPnlUSD,
                        perpsNotionalUSDPlusPnlUsd: usdValues.perps, // This is margin + PnL
                        perpsMarginUSD: perpsMarginUSD,
                        perpsMarginUSDPlusPnlUSD: perpsMarginUSDPlusPnlUSD,
                        withdrawableUSDC: withdrawableUSDC || 0,

                        // spot
                        perpsUSD: usdValues.perps, // Keep for backward compatibility (margin + PnL)
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
                        avgFundingAPR24h: fundingAPRs.avgAPR24h,
                        avgFundingAPR7d: fundingAPRs.avgAPR7d,
                        avgFundingAPR30d: fundingAPRs.avgAPR30d,
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
            },

            prices: {
                HYPE:
                    (await positionFetcher.getTokenPrice('HYPE')) ||
                    (await positionFetcher.getTokenPrice('WHYPE')) ||
                    (await priceAggregator.getTokenPrice('HYPE')) ||
                    0,
                USDC: (await positionFetcher.getTokenPrice('USDC')) || 1,
                USDT: (await positionFetcher.getTokenPrice('USDT')) || 1,
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
        cache.set(cacheKey, accountData)

        return createCachedResponse(accountData, false)
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
