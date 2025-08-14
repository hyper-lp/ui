/**
 * @deprecated This service is deprecated. Use services from /analytics, /monitoring, or /discovery instead.
 * Kept for backward compatibility with test scripts.
 */

import { formatUnits } from 'viem'
import { calculateTokenAmounts } from '@/utils/uniswap-v3.util'
import { fetchPoolState, fetchPosition, getTokenMetadata } from '@/services/core/uniswap-pool.service'
import { getTokenPrice } from '@/services/core/token-prices.service'
import { HYPEREVM_DEXS } from '@/config/hyperevm-dexs.config'
import { HYPEREVM_CHAIN_ID } from '@/lib/viem'
import type { DexLPPosition, LPMetrics } from '@/interfaces/dex.interface'
import type { IAnalyticsPullService, AnalyticsResult, DexSummary } from '@/interfaces/analytics.interface'

export class AnalyticsPullService implements IAnalyticsPullService {
    private readonly chainId: number

    constructor(chainId: number = HYPEREVM_CHAIN_ID) {
        this.chainId = chainId
    }

    async pullPositionMetrics(position: DexLPPosition): Promise<LPMetrics | null> {
        try {
            const dexConfig = HYPEREVM_DEXS[position.dex]

            if (!dexConfig) {
                console.error(`Unsupported DEX: ${position.dex}`)
                return null
            }

            if (!dexConfig.isUniswapV3Fork) {
                console.error(`DEX ${position.dex} is not yet supported (not a Uniswap V3 fork)`)
                return null
            }

            if (!position.tokenId) {
                console.error(`No tokenId provided for ${position.dex} position ${position.id}`)
                return null
            }

            const positionManagerAddress = position.positionManagerAddress || dexConfig.positionManagerAddress

            if (!positionManagerAddress) {
                console.error(`No position manager for ${position.dex}`)
                return null
            }

            if (process.env.NODE_ENV === 'development') {
                console.log(`    📈 Fetching metrics for ${position.dex} position ${position.tokenId}...`)
            }

            const positionData = await fetchPosition(BigInt(position.tokenId), positionManagerAddress, this.chainId)

            // Handle special case for HYPE/USDT0 positions
            const actualPoolAddress = position.poolAddress
            if (position.poolAddress.startsWith('HYPE/USDT0-')) {
                // For now, skip fetching pool state for these special positions
                // In production, we'd compute the actual pool address from factory
                // Silently skip without warning
                return null
            }

            const poolState = await fetchPoolState(actualPoolAddress, this.chainId)

            const [token0Meta, token1Meta] = await Promise.all([
                getTokenMetadata(poolState.token0, this.chainId),
                getTokenMetadata(poolState.token1, this.chainId),
            ])

            const [price0, price1] = await Promise.all([getTokenPrice(poolState.token0, this.chainId), getTokenPrice(poolState.token1, this.chainId)])

            const { amount0, amount1 } = calculateTokenAmounts(
                positionData.liquidity,
                poolState.sqrtPriceX96,
                positionData.tickLower,
                positionData.tickUpper,
                poolState.tick,
            )

            const token0Amount = Number(formatUnits(amount0, token0Meta.decimals))
            const token1Amount = Number(formatUnits(amount1, token1Meta.decimals))

            const unclaimedFees0 = Number(formatUnits(positionData.tokensOwed0, token0Meta.decimals))
            const unclaimedFees1 = Number(formatUnits(positionData.tokensOwed1, token1Meta.decimals))

            const totalValueUSD = token0Amount * price0 + token1Amount * price1
            const unclaimedFeesUSD = unclaimedFees0 * price0 + unclaimedFees1 * price1

            const feeAPR = totalValueUSD > 0 ? (unclaimedFeesUSD * 365 * 100) / totalValueUSD : 0

            const inRange = poolState.tick >= positionData.tickLower && poolState.tick < positionData.tickUpper

            if (process.env.NODE_ENV === 'development' && totalValueUSD > 0) {
                console.log(
                    `      💰 Position value: $${totalValueUSD.toFixed(2)}, APR: ${feeAPR.toFixed(2)}%, ${inRange ? '✅ In Range' : '❌ Out of Range'}`,
                )
            }

            return {
                positionId: position.id,
                dex: position.dex,
                timestamp: new Date(),
                totalValueUSD,
                unclaimedFeesUSD,
                feeAPR,
                inRange,
                // Include actual token amounts and prices for full transparency
                token0Amount,
                token1Amount,
                token0Symbol: token0Meta.symbol,
                token1Symbol: token1Meta.symbol,
                token0Price: price0,
                token1Price: price1,
            } as LPMetrics & {
                token0Amount: number
                token1Amount: number
                token0Symbol: string
                token1Symbol: string
                token0Price: number
                token1Price: number
            }
        } catch (error) {
            console.error(`Error pulling metrics for position ${position.id} on ${position.dex}:`, error)
            return null
        }
    }

    async pullAllPositionsMetrics(positions: DexLPPosition[]): Promise<AnalyticsResult> {
        if (process.env.NODE_ENV === 'development') {
            console.log(`\n📊 [Analytics Fetcher] Pulling metrics for ${positions.length} position(s)...`)
        }

        const metricsPromises = positions.map((position) => this.pullPositionMetrics(position))
        const results = await Promise.all(metricsPromises)

        const metrics = results.filter((m): m is LPMetrics => m !== null)

        if (process.env.NODE_ENV === 'development') {
            console.log(`  ✅ Successfully fetched metrics for ${metrics.length}/${positions.length} positions`)

            // Show positions by DEX
            const dexCounts: Record<string, number> = {}
            metrics.forEach((m) => {
                dexCounts[m.dex] = (dexCounts[m.dex] || 0) + 1
            })
            Object.entries(dexCounts).forEach(([dex, count]) => {
                console.log(`    - ${dex}: ${count} position(s)`)
            })
        }

        const byDex = this.calculateDexSummaries(metrics)
        const summary = this.calculateSummary(metrics, byDex)

        return { metrics, summary }
    }

    private calculateDexSummaries(metrics: LPMetrics[]): Record<string, DexSummary> {
        const byDex: Record<string, DexSummary> = {}

        for (const metric of metrics) {
            if (!byDex[metric.dex]) {
                byDex[metric.dex] = {
                    count: 0,
                    totalValueUSD: 0,
                    averageFeeAPR: 0,
                }
            }

            const dexSummary = byDex[metric.dex]
            dexSummary.count++
            dexSummary.totalValueUSD += metric.totalValueUSD
            dexSummary.averageFeeAPR = (dexSummary.averageFeeAPR * (dexSummary.count - 1) + metric.feeAPR) / dexSummary.count
        }

        return byDex
    }

    private calculateSummary(metrics: LPMetrics[], byDex: Record<string, DexSummary>): AnalyticsResult['summary'] {
        const totalValueUSD = metrics.reduce((sum, m) => sum + m.totalValueUSD, 0)
        const totalUnclaimedFeesUSD = metrics.reduce((sum, m) => sum + m.unclaimedFeesUSD, 0)
        const positionsInRange = metrics.filter((m) => m.inRange).length
        const averageFeeAPR = metrics.length > 0 ? metrics.reduce((sum, m) => sum + m.feeAPR, 0) / metrics.length : 0

        return {
            totalValueUSD,
            totalUnclaimedFeesUSD,
            averageFeeAPR,
            positionsInRange,
            byDex,
        }
    }
}

export const analyticsPullService = new AnalyticsPullService()
