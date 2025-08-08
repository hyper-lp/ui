import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const walletAddress = searchParams.get('wallet')

        if (!walletAddress) {
            return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
        }

        // Get LP positions with latest snapshots
        const lpPositions = await prisma.lPPosition.findMany({
            where: {
                ownerAddress: {
                    equals: walletAddress,
                    mode: 'insensitive',
                },
                isActive: true,
            },
            include: {
                snapshots: {
                    orderBy: { timestamp: 'desc' },
                    take: 2, // Get last 2 snapshots for comparison
                },
            },
        })

        // Get hedge positions
        const hedgePositions = await prisma.hedgePosition.findMany({
            where: {
                walletAddress: {
                    equals: walletAddress,
                    mode: 'insensitive',
                },
            },
            include: {
                snapshots: {
                    orderBy: { timestamp: 'desc' },
                    take: 1,
                },
            },
        })

        // Rebalance history removed - costs now tracked differently
        // For now, return empty array for backwards compatibility
        const rebalances: { totalCostUSD: number; timestamp: Date }[] = []

        // Calculate PnL components
        let lpFeesEarned = 0
        let impermanentLoss = 0
        let lpValue = 0

        for (const position of lpPositions) {
            const latestSnapshot = position.snapshots[0]
            if (latestSnapshot) {
                lpValue += latestSnapshot.totalValueUSD
                lpFeesEarned += latestSnapshot.unclaimedFeesUSD

                // TODO: Calculate actual IL based on entry vs current composition
                // For now, estimate IL as 2% of position value if out of range
                if (!latestSnapshot.inRange) {
                    impermanentLoss -= latestSnapshot.totalValueUSD * 0.02
                }
            }
        }

        // Calculate hedge PnL
        let hedgeUnrealizedPnl = 0
        let hedgeRealizedPnl = 0
        let fundingEarned = 0

        for (const hedge of hedgePositions) {
            hedgeUnrealizedPnl += hedge.unrealizedPnl
            hedgeRealizedPnl += hedge.realizedPnl
            fundingEarned += hedge.fundingPaid // Negative means we received funding
        }

        // Calculate rebalance costs
        const rebalanceCosts = rebalances.reduce((sum, r) => sum + r.totalCostUSD, 0)

        // Calculate total PnL
        const totalPnl = lpFeesEarned + impermanentLoss + hedgeUnrealizedPnl + hedgeRealizedPnl + fundingEarned - rebalanceCosts

        return NextResponse.json({
            wallet: walletAddress,
            pnl: {
                total: totalPnl,
                components: {
                    lpFees: lpFeesEarned,
                    impermanentLoss,
                    hedgeUnrealized: hedgeUnrealizedPnl,
                    hedgeRealized: hedgeRealizedPnl,
                    funding: fundingEarned,
                    rebalanceCosts: -rebalanceCosts,
                },
                percentages: {
                    lpFees: lpValue > 0 ? (lpFeesEarned / lpValue) * 100 : 0,
                    impermanentLoss: lpValue > 0 ? (impermanentLoss / lpValue) * 100 : 0,
                    totalReturn: lpValue > 0 ? (totalPnl / lpValue) * 100 : 0,
                },
            },
            positions: {
                lp: {
                    count: lpPositions.length,
                    totalValue: lpValue,
                    feesEarned: lpFeesEarned,
                },
                hedge: {
                    count: hedgePositions.filter((h) => h.isActive).length,
                    unrealizedPnl: hedgeUnrealizedPnl,
                    realizedPnl: hedgeRealizedPnl,
                    fundingEarned,
                },
            },
            rebalances: {
                count: rebalances.length,
                totalCost: rebalanceCosts,
                lastRebalance: rebalances[0]?.timestamp || null,
            },
        })
    } catch (error) {
        console.error('Error calculating PnL:', error)
        return NextResponse.json({ error: 'Failed to calculate PnL' }, { status: 500 })
    }
}
