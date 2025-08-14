import { prismaMonitoring } from '@/lib/prisma-monitoring'
import { formatUnits } from 'viem'
import { calculateTokenAmounts } from '@/utils/uniswap-v3.util'
import { fetchPoolState, fetchPosition, getTokenMetadata } from '@/services/core/uniswap-pool.service'
import { getTokenPrice } from '@/services/core/token-prices.service'
import { HYPEREVM_DEXS } from '@/config/hyperevm-dexs.config'
import { HYPEREVM_CHAIN_ID } from '@/lib/viem'
import { Prisma } from '@/generated/prisma-monitoring'

export interface PositionMetrics {
    positionId: string
    platform: 'hyperevm' | 'hypercore'
    type: 'lp' | 'perp' | 'spot'
    totalValueUSD: number
    deltaExposure: number
    feeAPR?: number
    fundingAPR?: number
    inRange?: boolean
    metadata?: Record<string, unknown>
}

export interface AccountMetrics {
    accountId: string
    timestamp: Date
    lpValue: number
    perpValue: number
    spotValue: number
    netDelta: number
    lpFeeAPR: number
    fundingAPR: number
    netAPR: number
}

/**
 * Unified analytics service for metrics calculation and storage
 * Handles LP, Perp, and Spot analytics across all platforms
 */
export class AnalyticsService {
    /**
     * Calculate metrics for an LP position
     */
    async calculateLPMetrics(position: { tokenId: string; dex: string; poolAddress?: string }): Promise<PositionMetrics | null> {
        try {
            const dexConfig = HYPEREVM_DEXS[position.dex.toLowerCase() as keyof typeof HYPEREVM_DEXS]
            if (!dexConfig?.positionManagerAddress) return null

            const positionData = await fetchPosition(BigInt(position.tokenId), dexConfig.positionManagerAddress, HYPEREVM_CHAIN_ID)

            // Get pool state
            let poolState
            if (position.poolAddress && !position.poolAddress.startsWith('HYPE/USDT0')) {
                poolState = await fetchPoolState(position.poolAddress as `0x${string}`, HYPEREVM_CHAIN_ID)
            } else {
                // Find pool from factory
                return null // Skip for now if no pool address
            }

            // Get token metadata and prices
            const [token0Meta, token1Meta] = await Promise.all([
                getTokenMetadata(poolState.token0, HYPEREVM_CHAIN_ID),
                getTokenMetadata(poolState.token1, HYPEREVM_CHAIN_ID),
            ])

            const [price0, price1] = await Promise.all([
                getTokenPrice(poolState.token0, HYPEREVM_CHAIN_ID),
                getTokenPrice(poolState.token1, HYPEREVM_CHAIN_ID),
            ])

            // Calculate token amounts
            const { amount0, amount1 } = calculateTokenAmounts(
                positionData.liquidity,
                poolState.sqrtPriceX96,
                positionData.tickLower,
                positionData.tickUpper,
                poolState.tick,
            )

            const token0Amount = Number(formatUnits(amount0, token0Meta.decimals))
            const token1Amount = Number(formatUnits(amount1, token1Meta.decimals))

            const totalValueUSD = token0Amount * price0 + token1Amount * price1

            // Calculate unclaimed fees
            const unclaimedFees0 = Number(formatUnits(positionData.tokensOwed0, token0Meta.decimals))
            const unclaimedFees1 = Number(formatUnits(positionData.tokensOwed1, token1Meta.decimals))
            const unclaimedFeesUSD = unclaimedFees0 * price0 + unclaimedFees1 * price1

            // Calculate APR
            const feeAPR = totalValueUSD > 0 ? (unclaimedFeesUSD * 365 * 100) / totalValueUSD : 0

            // Check if in range
            const inRange = poolState.tick >= positionData.tickLower && poolState.tick < positionData.tickUpper

            // Calculate delta exposure (value of volatile asset)
            const deltaExposure = token0Meta.symbol === 'HYPE' ? token0Amount * price0 : token1Amount * price1

            return {
                positionId: `lp-${position.tokenId}`,
                platform: 'hyperevm',
                type: 'lp',
                totalValueUSD,
                deltaExposure,
                feeAPR,
                inRange,
                metadata: {
                    token0Amount,
                    token1Amount,
                    token0Symbol: token0Meta.symbol,
                    token1Symbol: token1Meta.symbol,
                    unclaimedFeesUSD,
                },
            }
        } catch (error) {
            console.error(`Failed to calculate LP metrics for ${position.tokenId}:`, error)
            return null
        }
    }

    /**
     * Calculate metrics for a perp position
     */
    async calculatePerpMetrics(position: {
        coin: string
        side: string
        size: number
        markPrice: number
        unrealizedPnl: number
        cumulativeFunding: number
    }): Promise<PositionMetrics> {
        const notionalValue = position.size * position.markPrice

        // Delta exposure for perps (negative for shorts)
        const deltaExposure = position.side === 'SHORT' ? -notionalValue : notionalValue

        // Annualized funding rate (simplified - should use actual funding history)
        const fundingAPR =
            position.cumulativeFunding !== 0 && notionalValue > 0 ? (Math.abs(position.cumulativeFunding) * 365 * 100) / notionalValue : 0

        return {
            positionId: `perp-${position.coin}`,
            platform: 'hypercore',
            type: 'perp',
            totalValueUSD: notionalValue,
            deltaExposure,
            fundingAPR,
            metadata: {
                coin: position.coin,
                side: position.side,
                size: position.size,
                markPrice: position.markPrice,
                unrealizedPnl: position.unrealizedPnl,
            },
        }
    }

    /**
     * Calculate metrics for spot balance
     */
    calculateSpotMetrics(balance: { asset: string; balance: number; valueUSD: number }): PositionMetrics {
        // Spot positions have positive delta for volatile assets
        const deltaExposure = balance.asset === 'HYPE' ? balance.valueUSD : 0

        return {
            positionId: `spot-${balance.asset}`,
            platform: 'hypercore',
            type: 'spot',
            totalValueUSD: balance.valueUSD,
            deltaExposure,
            metadata: {
                asset: balance.asset,
                balance: balance.balance,
            },
        }
    }

    /**
     * Store account snapshot
     */
    async storeAccountSnapshot(metrics: AccountMetrics): Promise<void> {
        // Round timestamp to 5 minutes
        const timestamp = new Date(Math.floor(metrics.timestamp.getTime() / (5 * 60 * 1000)) * 5 * 60 * 1000)

        await prismaMonitoring.accountSnapshot.upsert({
            where: {
                accountId_timestamp: {
                    accountId: metrics.accountId,
                    timestamp,
                },
            },
            create: {
                accountId: metrics.accountId,
                timestamp,
                lpValue: new Prisma.Decimal(metrics.lpValue),
                perpValue: new Prisma.Decimal(metrics.perpValue),
                spotValue: new Prisma.Decimal(metrics.spotValue),
                netDelta: new Prisma.Decimal(metrics.netDelta),
                lpFeeAPR: new Prisma.Decimal(metrics.lpFeeAPR),
                fundingAPR: new Prisma.Decimal(metrics.fundingAPR),
                netAPR: new Prisma.Decimal(metrics.netAPR),
            },
            update: {
                lpValue: new Prisma.Decimal(metrics.lpValue),
                perpValue: new Prisma.Decimal(metrics.perpValue),
                spotValue: new Prisma.Decimal(metrics.spotValue),
                netDelta: new Prisma.Decimal(metrics.netDelta),
                lpFeeAPR: new Prisma.Decimal(metrics.lpFeeAPR),
                fundingAPR: new Prisma.Decimal(metrics.fundingAPR),
                netAPR: new Prisma.Decimal(metrics.netAPR),
            },
        })
    }

    /**
     * Calculate and store metrics for an account
     */
    async calculateAccountMetrics(accountId: string): Promise<AccountMetrics> {
        const [lpPositions, perpPositions, spotBalances] = await Promise.all([
            prismaMonitoring.lpPosition.findMany({ where: { accountId } }),
            prismaMonitoring.perpPosition.findMany({ where: { accountId } }),
            prismaMonitoring.spotBalance.findMany({ where: { accountId } }),
        ])

        let lpValue = 0
        let perpValue = 0
        let spotValue = 0
        let lpDelta = 0
        let perpDelta = 0
        let spotDelta = 0
        let totalFeeAPR = 0
        let totalFundingAPR = 0
        let lpCount = 0
        let perpCount = 0

        // Calculate LP metrics
        for (const position of lpPositions) {
            const metrics = await this.calculateLPMetrics({
                tokenId: position.tokenId,
                dex: position.dex,
                poolAddress: position.poolAddress || undefined,
            })

            if (metrics) {
                lpValue += metrics.totalValueUSD
                lpDelta += metrics.deltaExposure
                totalFeeAPR += metrics.feeAPR || 0
                lpCount++

                // Update position in DB
                await prismaMonitoring.lpPosition.update({
                    where: { id: position.id },
                    data: {
                        valueUSD: new Prisma.Decimal(metrics.totalValueUSD),
                        inRange: metrics.inRange || false,
                    },
                })
            }
        }

        // Calculate perp metrics
        for (const position of perpPositions) {
            const metrics = await this.calculatePerpMetrics({
                coin: position.asset,
                side: position.szi.toNumber() > 0 ? 'LONG' : 'SHORT',
                size: Math.abs(position.szi.toNumber()),
                markPrice: position.markPx.toNumber(),
                unrealizedPnl: position.unrealizedPnl.toNumber(),
                cumulativeFunding: position.fundingPaid.toNumber(),
            })

            perpValue += metrics.totalValueUSD
            perpDelta += metrics.deltaExposure
            totalFundingAPR += metrics.fundingAPR || 0
            perpCount++
        }

        // Calculate spot metrics
        for (const balance of spotBalances) {
            const metrics = this.calculateSpotMetrics({
                asset: balance.asset,
                balance: balance.balance.toNumber(),
                valueUSD: balance.valueUSD.toNumber(),
            })

            spotValue += metrics.totalValueUSD
            spotDelta += metrics.deltaExposure
        }

        // Calculate net metrics
        const netDelta = lpDelta + perpDelta + spotDelta
        const lpFeeAPR = lpCount > 0 ? totalFeeAPR / lpCount : 0
        const fundingAPR = perpCount > 0 ? totalFundingAPR / perpCount : 0
        const netAPR = (lpFeeAPR + fundingAPR) / 2

        const metrics: AccountMetrics = {
            accountId,
            timestamp: new Date(),
            lpValue,
            perpValue,
            spotValue,
            netDelta,
            lpFeeAPR,
            fundingAPR,
            netAPR,
        }

        // Store snapshot
        await this.storeAccountSnapshot(metrics)

        return metrics
    }

    /**
     * Clean up old snapshots (keep last 7 days)
     */
    async cleanupOldSnapshots(daysToKeep = 7): Promise<number> {
        const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000)

        const result = await prismaMonitoring.accountSnapshot.deleteMany({
            where: {
                timestamp: { lt: cutoffDate },
            },
        })

        return result.count
    }

    /**
     * Get historical snapshots for an account
     */
    async getAccountHistory(accountId: string, hours = 24): Promise<AccountMetrics[]> {
        const since = new Date(Date.now() - hours * 60 * 60 * 1000)

        const snapshots = await prismaMonitoring.accountSnapshot.findMany({
            where: {
                accountId,
                timestamp: { gte: since },
            },
            orderBy: { timestamp: 'asc' },
        })

        return snapshots.map((s) => ({
            accountId: s.accountId,
            timestamp: s.timestamp,
            lpValue: s.lpValue.toNumber(),
            perpValue: s.perpValue.toNumber(),
            spotValue: s.spotValue.toNumber(),
            netDelta: s.netDelta.toNumber(),
            lpFeeAPR: s.lpFeeAPR.toNumber(),
            fundingAPR: s.fundingAPR.toNumber(),
            netAPR: s.netAPR.toNumber(),
        }))
    }

    /**
     * Get aggregated metrics across all accounts
     */
    async getAggregatedMetrics(): Promise<{
        totalValue: number
        totalDelta: number
        averageAPR: number
        accountCount: number
    }> {
        // Get latest snapshot for each account
        const latestSnapshots = await prismaMonitoring.$queryRaw<
            Array<{
                lpvalue: Prisma.Decimal
                perpvalue: Prisma.Decimal
                spotvalue: Prisma.Decimal
                netdelta: Prisma.Decimal
                netapr: Prisma.Decimal
            }>
        >`
            SELECT DISTINCT ON ("accountId")
                "lpValue" as lpvalue,
                "perpValue" as perpvalue,
                "spotValue" as spotvalue,
                "netDelta" as netdelta,
                "netAPR" as netapr
            FROM "AccountSnapshot"
            ORDER BY "accountId", timestamp DESC
        `

        if (!latestSnapshots || latestSnapshots.length === 0) {
            return {
                totalValue: 0,
                totalDelta: 0,
                averageAPR: 0,
                accountCount: 0,
            }
        }

        const totalValue = latestSnapshots.reduce((sum, s) => sum + s.lpvalue.toNumber() + s.perpvalue.toNumber() + s.spotvalue.toNumber(), 0)

        const totalDelta = latestSnapshots.reduce((sum, s) => sum + s.netdelta.toNumber(), 0)

        const averageAPR = latestSnapshots.reduce((sum, s) => sum + s.netapr.toNumber(), 0) / latestSnapshots.length

        return {
            totalValue,
            totalDelta,
            averageAPR,
            accountCount: latestSnapshots.length,
        }
    }
}

export const analyticsService = new AnalyticsService()
