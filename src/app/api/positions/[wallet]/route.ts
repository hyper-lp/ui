import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ wallet: string }> }) {
    try {
        const { wallet } = await params
        const walletAddress = wallet.toLowerCase()

        // Get LP positions
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
                    take: 1,
                },
                wallet: true,
            },
        })

        // Get hedge positions
        const hedgePositions = await prisma.hedgePosition.findMany({
            where: {
                walletAddress: {
                    equals: walletAddress,
                    mode: 'insensitive',
                },
                isActive: true,
            },
            include: {
                snapshots: {
                    orderBy: { timestamp: 'desc' },
                    take: 1,
                },
            },
        })

        // Calculate summary metrics
        const totalLpValue = lpPositions.reduce((sum, p) => {
            const snapshot = p.snapshots[0]
            return sum + (snapshot?.totalValueUSD || 0)
        }, 0)

        const totalHedgeValue = hedgePositions.reduce((sum, p) => sum + p.notionalValue, 0)

        const totalUnrealizedPnl = hedgePositions.reduce((sum, p) => sum + p.unrealizedPnl, 0)

        return NextResponse.json({
            wallet: walletAddress,
            lpPositions: lpPositions.map((p) => ({
                id: p.id,
                tokenId: p.tokenId,
                dex: p.dex,
                feeTier: p.feeTier,
                isActive: p.isActive,
                latestSnapshot: p.snapshots[0],
            })),
            hedgePositions: hedgePositions.map((h) => ({
                id: h.id,
                asset: h.asset,
                size: h.size,
                entryPrice: h.entryPrice,
                markPrice: h.markPrice,
                unrealizedPnl: h.unrealizedPnl,
                fundingRate: h.currentFundingRate,
                leverage: h.leverage,
                latestSnapshot: h.snapshots[0],
            })),
            summary: {
                totalLpValue,
                totalHedgeValue,
                totalUnrealizedPnl,
                lpPositionCount: lpPositions.length,
                hedgePositionCount: hedgePositions.length,
            },
        })
    } catch (error) {
        console.error('Error fetching positions:', error)
        return NextResponse.json({ error: 'Failed to fetch positions' }, { status: 500 })
    }
}
