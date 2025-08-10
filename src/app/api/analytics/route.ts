import { NextRequest, NextResponse } from 'next/server'
import { withApiAuth } from '@/middleware/api-auth'
import { analyticsService } from '@/services/analytics.service'
import { prismaMonitoring } from '@/lib/prisma-monitoring'

/**
 * Unified analytics endpoint
 *
 * GET /api/analytics
 * Query params:
 * - accountId?: string - Get metrics for specific account
 * - hours?: number - Hours of history (default: 24)
 * - aggregate?: boolean - Get aggregated metrics
 */
export const GET = withApiAuth(async (request: NextRequest) => {
    try {
        const { searchParams } = new URL(request.url)
        const accountId = searchParams.get('accountId')
        const hours = parseInt(searchParams.get('hours') || '24')
        const aggregate = searchParams.get('aggregate') === 'true'

        // Get aggregated metrics
        if (aggregate || !accountId) {
            const metrics = await analyticsService.getAggregatedMetrics()
            return NextResponse.json({
                success: true,
                data: metrics,
            })
        }

        // Get account history
        const history = await analyticsService.getAccountHistory(accountId, hours)

        // Get current positions
        const [lpPositions, perpPositions, spotBalances] = await Promise.all([
            prismaMonitoring.lpPosition.findMany({
                where: { accountId },
                select: {
                    tokenId: true,
                    dex: true,
                    token0Symbol: true,
                    token1Symbol: true,
                    valueUSD: true,
                    inRange: true,
                },
            }),
            prismaMonitoring.perpPosition.findMany({
                where: { accountId },
                select: {
                    asset: true,
                    szi: true,
                    markPx: true,
                    unrealizedPnl: true,
                },
            }),
            prismaMonitoring.spotBalance.findMany({
                where: { accountId, balance: { gt: 0 } },
                select: {
                    asset: true,
                    balance: true,
                    valueUSD: true,
                },
            }),
        ])

        return NextResponse.json({
            success: true,
            data: {
                accountId,
                history,
                currentPositions: {
                    lp: lpPositions.map((p) => ({
                        ...p,
                        valueUSD: p.valueUSD.toNumber(),
                    })),
                    perp: perpPositions.map((p) => ({
                        ...p,
                        szi: p.szi.toNumber(),
                        markPx: p.markPx.toNumber(),
                        unrealizedPnl: p.unrealizedPnl.toNumber(),
                    })),
                    spot: spotBalances.map((b) => ({
                        ...b,
                        balance: b.balance.toNumber(),
                        valueUSD: b.valueUSD.toNumber(),
                    })),
                },
            },
        })
    } catch (error) {
        console.error('[API Analytics] Error:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 },
        )
    }
})
