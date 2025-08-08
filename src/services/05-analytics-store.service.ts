import { prisma } from '@/lib/prisma'
import type { LPPosition, PositionSnapshot } from '@prisma/client'

export class LPDatabaseService {
    /**
     * Upsert an LP position - create if new, update if exists
     */
    async upsertPosition(data: {
        tokenId: string
        dex: string
        ownerAddress: string
        poolAddress?: string
        positionManagerAddress: string
        token0Address: string
        token1Address: string
        feeTier: number
        tickLower: number
        tickUpper: number
        liquidity: string
        walletId?: string
    }): Promise<LPPosition> {
        const { liquidity, ...positionData } = data

        return prisma.lPPosition.upsert({
            where: {
                tokenId_dex_positionManagerAddress: {
                    tokenId: data.tokenId,
                    dex: data.dex,
                    positionManagerAddress: data.positionManagerAddress,
                },
            },
            update: {
                ownerAddress: data.ownerAddress,
                poolAddress: data.poolAddress,
                token0Address: data.token0Address,
                token1Address: data.token1Address,
                feeTier: data.feeTier,
                tickLower: data.tickLower,
                tickUpper: data.tickUpper,
                isActive: liquidity !== '0',
                walletId: data.walletId,
                updatedAt: new Date(),
            },
            create: {
                ...positionData,
                isActive: liquidity !== '0',
                walletId: data.walletId,
            },
        })
    }

    /**
     * Create position snapshots
     */
    async createPositionSnapshots(
        positions: Array<{
            tokenId: string
            dex: string
            positionManagerAddress: string
            liquidity: string
            token0Amount: number
            token1Amount: number
            token0Symbol: string
            token1Symbol: string
            token0Price: number
            token1Price: number
            totalValueUSD: number
            unclaimedFees0: number
            unclaimedFees1: number
            unclaimedFeesUSD: number
            feeAPR: number
            poolTick: number
            poolSqrtPriceX96: string
            inRange: boolean
        }>,
    ): Promise<PositionSnapshot[]> {
        const snapshots = await Promise.all(
            positions.map(async (pos) => {
                // First ensure the position exists in the database
                const position = await prisma.lPPosition.findUnique({
                    where: {
                        tokenId_dex_positionManagerAddress: {
                            tokenId: pos.tokenId,
                            dex: pos.dex,
                            positionManagerAddress: pos.positionManagerAddress,
                        },
                    },
                })

                if (!position) {
                    throw new Error(`Position not found: ${pos.tokenId} on ${pos.dex}`)
                }

                return prisma.positionSnapshot.create({
                    data: {
                        positionId: position.id,
                        liquidity: pos.liquidity,
                        token0Amount: pos.token0Amount,
                        token1Amount: pos.token1Amount,
                        token0Symbol: pos.token0Symbol,
                        token1Symbol: pos.token1Symbol,
                        token0Price: pos.token0Price,
                        token1Price: pos.token1Price,
                        totalValueUSD: pos.totalValueUSD,
                        unclaimedFees0: pos.unclaimedFees0,
                        unclaimedFees1: pos.unclaimedFees1,
                        unclaimedFeesUSD: pos.unclaimedFeesUSD,
                        feeAPR: pos.feeAPR,
                        poolTick: pos.poolTick,
                        poolSqrtPriceX96: pos.poolSqrtPriceX96,
                        inRange: pos.inRange,
                    },
                })
            }),
        )

        return snapshots
    }

    /**
     * Get the latest snapshots
     */
    async getLatestSnapshots(): Promise<PositionSnapshot[]> {
        const positions = await prisma.lPPosition.findMany({
            where: { isActive: true },
        })

        const snapshots = await Promise.all(
            positions.map(async (position) => {
                const snapshot = await prisma.positionSnapshot.findFirst({
                    where: { positionId: position.id },
                    orderBy: { timestamp: 'desc' },
                })
                return snapshot
            }),
        )

        return snapshots.filter((s): s is PositionSnapshot => s !== null)
    }

    /**
     * Get all positions for an owner
     */
    async getPositionsByOwner(ownerAddress: string): Promise<LPPosition[]> {
        return prisma.lPPosition.findMany({
            where: { ownerAddress },
            include: {
                snapshots: {
                    orderBy: { timestamp: 'desc' },
                    take: 1,
                },
            },
        })
    }

    /**
     * Get HYPE/USDT0 positions
     */
    async getHypeUsdtPositions(): Promise<LPPosition[]> {
        const hypeAddresses = ['0x0000000000000000000000000000000000000000', '0x5555555555555555555555555555555555555555']
        const usdt0Address = '0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb'

        return prisma.lPPosition.findMany({
            where: {
                OR: [
                    {
                        token0Address: { in: hypeAddresses },
                        token1Address: usdt0Address,
                    },
                    {
                        token0Address: usdt0Address,
                        token1Address: { in: hypeAddresses },
                    },
                ],
                isActive: true,
            },
            include: {
                snapshots: {
                    orderBy: { timestamp: 'desc' },
                    take: 1,
                },
            },
        })
    }

    /**
     * Get historical snapshots for a position
     */
    async getPositionHistory(tokenId: string, dex: string, limit = 100): Promise<PositionSnapshot[]> {
        const position = await prisma.lPPosition.findUnique({
            where: {
                tokenId_dex_positionManagerAddress: {
                    tokenId,
                    dex,
                    positionManagerAddress: '', // Need to know this
                },
            },
        })

        if (!position) {
            return []
        }

        return prisma.positionSnapshot.findMany({
            where: { positionId: position.id },
            orderBy: { timestamp: 'desc' },
            take: limit,
        })
    }

    /**
     * Clean up old snapshots
     */
    async cleanupOldSnapshots(daysToKeep = 30): Promise<number> {
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

        const result = await prisma.positionSnapshot.deleteMany({
            where: {
                timestamp: {
                    lt: cutoffDate,
                },
            },
        })

        return result.count
    }
}

export const lpDatabaseService = new LPDatabaseService()
