import { prismaMonitoring } from '@/lib/prisma-monitoring'
import type { LpPosition, AccountSnapshot } from '@/generated/prisma-monitoring'
import { Dex, Prisma } from '@prisma/client-monitoring'
const { Decimal } = Prisma

export class AnalyticsStoreService {
    /**
     * Upsert an LP position - create if new, update if exists
     */
    async upsertLpPosition(data: {
        accountId: string
        tokenId: string
        dex: string
        poolAddress?: string
        token0Symbol: string
        token1Symbol: string
        feeTier: number
        tickLower: number
        tickUpper: number
        liquidity: string
        valueUSD: number
        inRange: boolean
    }): Promise<LpPosition> {
        // Map DEX protocol names to enum values
        const dexMapping: Record<string, Dex> = {
            HYPERSWAP: Dex.HYPERSWAP,
            PRJTX: Dex.PRJTX,
            HYBRA: Dex.HYBRA,
        }
        const dexEnum = dexMapping[data.dex.toUpperCase()] || Dex.OTHER

        return prismaMonitoring.lpPosition.upsert({
            where: {
                tokenId: data.tokenId,
            },
            update: {
                accountId: data.accountId,
                poolAddress: data.poolAddress,
                token0Symbol: data.token0Symbol,
                token1Symbol: data.token1Symbol,
                feeTier: data.feeTier,
                tickLower: data.tickLower,
                tickUpper: data.tickUpper,
                liquidity: data.liquidity,
                valueUSD: new Decimal(data.valueUSD),
                inRange: data.inRange,
                updatedAt: new Date(),
            },
            create: {
                accountId: data.accountId,
                tokenId: data.tokenId,
                dex: dexEnum,
                poolAddress: data.poolAddress,
                token0Symbol: data.token0Symbol,
                token1Symbol: data.token1Symbol,
                feeTier: data.feeTier,
                tickLower: data.tickLower,
                tickUpper: data.tickUpper,
                liquidity: data.liquidity,
                valueUSD: new Decimal(data.valueUSD),
                inRange: data.inRange,
            },
        })
    }

    /**
     * Create an account snapshot (5-minute interval)
     */
    async createAccountSnapshot(data: {
        accountId: string
        timestamp?: Date
        lpValue: number
        perpValue: number
        spotValue: number
        netDelta: number
        lpFeeAPR: number
        fundingAPR: number
        netAPR: number
    }): Promise<AccountSnapshot> {
        // Floor timestamp to 5-minute interval
        const timestamp = data.timestamp || new Date()
        const flooredTime = new Date(Math.floor(timestamp.getTime() / (5 * 60 * 1000)) * (5 * 60 * 1000))

        // Check if snapshot already exists for this time bucket
        const existing = await prismaMonitoring.accountSnapshot.findUnique({
            where: {
                accountId_timestamp: {
                    accountId: data.accountId,
                    timestamp: flooredTime,
                },
            },
        })

        if (existing) {
            // Update existing snapshot
            return prismaMonitoring.accountSnapshot.update({
                where: { id: existing.id },
                data: {
                    lpValue: new Decimal(data.lpValue),
                    perpValue: new Decimal(data.perpValue),
                    spotValue: new Decimal(data.spotValue),
                    netDelta: new Decimal(data.netDelta),
                    lpFeeAPR: new Decimal(data.lpFeeAPR),
                    fundingAPR: new Decimal(data.fundingAPR),
                    netAPR: new Decimal(data.netAPR),
                },
            })
        }

        // Create new snapshot
        return prismaMonitoring.accountSnapshot.create({
            data: {
                accountId: data.accountId,
                timestamp: flooredTime,
                lpValue: new Decimal(data.lpValue),
                perpValue: new Decimal(data.perpValue),
                spotValue: new Decimal(data.spotValue),
                netDelta: new Decimal(data.netDelta),
                lpFeeAPR: new Decimal(data.lpFeeAPR),
                fundingAPR: new Decimal(data.fundingAPR),
                netAPR: new Decimal(data.netAPR),
            },
        })
    }

    /**
     * Get recent snapshots for an account
     */
    async getRecentSnapshots(accountId: string, hours: number = 24): Promise<AccountSnapshot[]> {
        const since = new Date(Date.now() - hours * 60 * 60 * 1000)

        return prismaMonitoring.accountSnapshot.findMany({
            where: {
                accountId,
                timestamp: { gte: since },
            },
            orderBy: { timestamp: 'asc' },
        })
    }

    /**
     * Clean up old snapshots (keep only last N days)
     */
    async cleanupOldSnapshots(daysToKeep: number = 30): Promise<number> {
        const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000)

        const result = await prismaMonitoring.accountSnapshot.deleteMany({
            where: {
                timestamp: { lt: cutoffDate },
            },
        })

        return result.count
    }

    /**
     * Get all active LP positions for an account
     */
    async getActiveLpPositions(accountId: string): Promise<LpPosition[]> {
        return prismaMonitoring.lpPosition.findMany({
            where: {
                accountId,
                inRange: true,
            },
        })
    }

    /**
     * Mark LP positions as inactive if liquidity is zero
     */
    async markInactiveLpPositions(tokenIds: string[]): Promise<void> {
        await prismaMonitoring.lpPosition.updateMany({
            where: {
                tokenId: { in: tokenIds },
            },
            data: {
                inRange: false,
                updatedAt: new Date(),
            },
        })
    }
}

export const analyticsStoreService = new AnalyticsStoreService()
