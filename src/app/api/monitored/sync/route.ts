import { NextRequest, NextResponse } from 'next/server'
import { withApiAuth, checkRateLimit } from '@/middleware/api-auth'
import { orchestratorService } from '@/services/orchestrator.service'

export const maxDuration = 300 // 5 minutes max

/**
 * Unified sync endpoint for all monitoring operations
 *
 * POST /api/sync
 * Body: {
 *   mode?: 'full' | 'quick' | 'status'  // Default: 'full'
 * }
 *
 * Modes:
 * - full: Complete sync with metrics calculation and snapshot storage
 * - quick: Just sync positions without calculating metrics
 * - status: Get current status without syncing
 */
export const POST = withApiAuth(async (request: NextRequest) => {
    const startTime = Date.now()

    try {
        const body = await request.json().catch(() => ({}))
        const { mode = 'full' } = body as { mode?: 'full' | 'quick' | 'status' }

        // Rate limiting
        const clientId = request.headers.get('X-API-Key') || 'anonymous'
        const rateLimitKey = `sync_${mode}_${clientId}`

        // Different rate limits per mode
        const rateLimits = {
            full: { max: 10, window: 3600000 }, // 10 per hour
            quick: { max: 60, window: 3600000 }, // 60 per hour
            status: { max: 300, window: 3600000 }, // 300 per hour
        }

        const limit = rateLimits[mode]
        if (!checkRateLimit(rateLimitKey, limit.max, limit.window)) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Rate limit exceeded - max ${limit.max} ${mode} syncs per hour`,
                },
                { status: 429 },
            )
        }

        console.log(`[API Sync] Starting ${mode} sync`)

        let result
        switch (mode) {
            case 'quick':
                result = await orchestratorService.quickSync()
                break

            case 'status':
                const status = await orchestratorService.getStatus()
                return NextResponse.json({
                    success: true,
                    mode: 'status',
                    data: status,
                    duration: Date.now() - startTime,
                })

            case 'full':
            default:
                result = await orchestratorService.runFullAnalytics()
                break
        }

        const duration = Date.now() - startTime

        if (result.success) {
            console.log(`[API Sync] ${mode} sync completed in ${duration}ms`)

            return NextResponse.json({
                success: true,
                mode,
                data: {
                    accountsProcessed: result.accountsProcessed,
                    positionsFound: result.positionsFound,
                    metricsCalculated: result.metricsCalculated,
                    snapshotsStored: result.snapshotsStored,
                    oldSnapshotsDeleted: result.oldSnapshotsDeleted,
                    aggregatedMetrics: result.aggregatedMetrics,
                },
                duration,
            })
        } else {
            console.error(`[API Sync] ${mode} sync failed:`, result.error)

            return NextResponse.json(
                {
                    success: false,
                    mode,
                    error: result.error,
                    duration,
                },
                { status: 500 },
            )
        }
    } catch (error) {
        console.error('[API Sync] Fatal error:', error)

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 },
        )
    }
})

/**
 * Get sync status
 * GET /api/sync
 */
export const GET = withApiAuth(async () => {
    try {
        const status = await orchestratorService.getStatus()

        return NextResponse.json({
            success: true,
            data: status,
        })
    } catch (error) {
        console.error('[API Sync] Error getting status:', error)

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 },
        )
    }
})
