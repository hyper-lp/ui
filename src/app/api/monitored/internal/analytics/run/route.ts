import { NextRequest, NextResponse } from 'next/server'
import { withApiAuth, checkRateLimit } from '@/middleware/api-auth'
import { orchestratorService as analyticsOrchestrator } from '@/services/analytics/orchestrator.service'
import { prismaMonitoring } from '@/lib/prisma-monitoring'

export const maxDuration = 300 // 5 minutes for full run

/**
 * Run full analytics pipeline
 * This endpoint actually executes the analytics (unlike trigger which just initiates)
 *
 * POST /api/internal/analytics/run
 * Body (optional): {
 *   accounts?: string[],  // Specific accounts to process
 *   skipCleanup?: boolean // Skip old snapshot cleanup
 * }
 */
export const POST = withApiAuth(async (request: NextRequest) => {
    const startTime = Date.now()

    // Rate limiting - max 10 full runs per hour
    const clientId = request.headers.get('X-API-Key') || 'anonymous'
    if (!checkRateLimit(`analytics_run_${clientId}`, 10, 3600000)) {
        return NextResponse.json(
            {
                success: false,
                error: 'Rate limit exceeded - max 10 runs per hour',
            },
            { status: 429 },
        )
    }

    try {
        // const body = await request.json().catch(() => ({}))
        // TODO: Add support for filtering accounts and skipping cleanup
        // const { accounts: requestedAccounts, skipCleanup } = body as {
        //     accounts?: string[]
        //     skipCleanup?: boolean
        // }

        console.log('[Analytics Run] Starting full analytics pipeline')

        // Run the analytics
        const result = await analyticsOrchestrator.runFullAnalytics()

        const duration = Date.now() - startTime

        if (result.success) {
            console.log(`[Analytics Run] Completed successfully in ${duration}ms`)

            return NextResponse.json({
                success: true,
                duration: `${duration}ms`,
                results: {
                    accountsProcessed: result.accountsProcessed,
                    positionsFound: result.positionsFound,
                    metricsCalculated: result.metricsCalculated,
                    snapshotsStored: result.snapshotsStored,
                    oldSnapshotsDeleted: result.oldSnapshotsDeleted,
                    aggregatedMetrics: result.aggregatedMetrics,
                },
            })
        } else {
            console.error(`[Analytics Run] Failed: ${result.error}`)

            return NextResponse.json(
                {
                    success: false,
                    error: result.error,
                    duration: `${duration}ms`,
                },
                { status: 500 },
            )
        }
    } catch (error) {
        const duration = Date.now() - startTime
        console.error('[Analytics Run] Fatal error:', error)

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
                duration: `${duration}ms`,
            },
            { status: 500 },
        )
    }
})

/**
 * Get analytics summary
 * GET /api/internal/analytics/run
 */
export const GET = withApiAuth(async (request: NextRequest) => {
    try {
        const url = new URL(request.url)
        const hours = parseInt(url.searchParams.get('hours') || '24')

        // Get recent snapshots
        const since = new Date(Date.now() - hours * 60 * 60 * 1000)

        const snapshots = await prismaMonitoring.accountSnapshot.findMany({
            where: {
                timestamp: { gte: since },
            },
            orderBy: { timestamp: 'desc' },
            include: {
                account: {
                    select: {
                        address: true,
                        name: true,
                    },
                },
            },
        })

        // Group by account
        interface AccountSummary {
            address: string
            name: string | null
            snapshots: Array<{
                timestamp: Date
                lpValue: number
                perpValue: number
                spotValue: number
                netDelta: number
                netAPR: number
            }>
            latestValue: number
            latestNetDelta: number
            latestNetAPR: number
        }
        const byAccount: Record<string, AccountSummary> = {}

        for (const snapshot of snapshots) {
            const address = snapshot.account.address
            if (!byAccount[address]) {
                byAccount[address] = {
                    address,
                    name: snapshot.account.name,
                    snapshots: [],
                    latestValue: 0,
                    latestNetDelta: 0,
                    latestNetAPR: 0,
                }
            }

            byAccount[address].snapshots.push({
                timestamp: snapshot.timestamp,
                lpValue: snapshot.lpValue.toNumber(),
                perpValue: snapshot.perpValue.toNumber(),
                spotValue: snapshot.spotValue.toNumber(),
                netDelta: snapshot.netDelta.toNumber(),
                netAPR: snapshot.netAPR.toNumber(),
            })

            // Update latest values (first snapshot is most recent)
            if (byAccount[address].snapshots.length === 1) {
                const totalValue = snapshot.lpValue.toNumber() + snapshot.perpValue.toNumber() + snapshot.spotValue.toNumber()
                byAccount[address].latestValue = totalValue
                byAccount[address].latestNetDelta = snapshot.netDelta.toNumber()
                byAccount[address].latestNetAPR = snapshot.netAPR.toNumber()
            }
        }

        // Calculate summary
        const accounts = Object.values(byAccount)
        const totalValue = accounts.reduce((sum, a) => sum + a.latestValue, 0)
        const avgNetAPR = accounts.length > 0 ? accounts.reduce((sum, a) => sum + a.latestNetAPR, 0) / accounts.length : 0

        return NextResponse.json({
            success: true,
            period: `${hours} hours`,
            summary: {
                accountsTracked: accounts.length,
                totalSnapshots: snapshots.length,
                totalValueUSD: totalValue,
                averageNetAPR: `${(avgNetAPR * 100).toFixed(2)}%`,
            },
            accounts: accounts.map((a) => ({
                address: a.address,
                name: a.name,
                latestValue: a.latestValue,
                latestNetDelta: a.latestNetDelta,
                latestNetAPR: `${(a.latestNetAPR * 100).toFixed(2)}%`,
                snapshotCount: a.snapshots.length,
            })),
        })
    } catch (error) {
        console.error('[Analytics Summary] Error:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 },
        )
    }
})
