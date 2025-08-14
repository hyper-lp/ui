import { NextRequest, NextResponse } from 'next/server'
import { withApiAuth } from '@/middleware/api-auth'
import { prismaMonitoring } from '@/lib/prisma-monitoring'
import { v4 as uuidv4 } from 'uuid'

export const maxDuration = 10 // Quick response - just triggers the process

/**
 * Trigger analytics run with platform context
 * Returns immediately with run ID
 *
 * POST /api/internal/analytics/trigger
 * Body (optional): {
 *   accounts?: string[],  // Specific accounts to process
 *   platforms?: {
 *     hyperEvm?: boolean,
 *     hyperCore?: boolean
 *   }
 * }
 */
export const POST = withApiAuth(async (request: NextRequest) => {
    try {
        const body = await request.json().catch(() => ({}))
        const { accounts: requestedAccounts, platforms } = body as {
            accounts?: string[]
            platforms?: {
                hyperEvm?: boolean
                hyperCore?: boolean
            }
        }

        // Generate run ID
        const runId = `run_${Date.now()}_${uuidv4().slice(0, 8)}`

        // Get accounts to process
        let accounts
        if (requestedAccounts && requestedAccounts.length > 0) {
            // Process specific accounts
            accounts = await prismaMonitoring.monitoredAccount.findMany({
                where: {
                    address: { in: requestedAccounts.map((a) => a.toLowerCase()) },
                    isActive: true,
                },
            })
        } else {
            // Process all active accounts
            accounts = await prismaMonitoring.monitoredAccount.findMany({
                where: { isActive: true },
            })
        }

        // Build account sync tasks with platform context
        const syncTasks = accounts.map((account) => {
            const tasks = []

            // Check platform flags (use request override or account settings)
            const shouldSyncHyperEvm = platforms?.hyperEvm ?? account.hasHyperEvm
            const shouldSyncHyperCore = platforms?.hyperCore ?? account.hasHyperCore

            if (shouldSyncHyperEvm) {
                tasks.push('lp')
            }

            if (shouldSyncHyperCore) {
                tasks.push('perp', 'spot')
            }

            return {
                address: account.address,
                name: account.name,
                platforms: {
                    hyperEvm: shouldSyncHyperEvm,
                    hyperCore: shouldSyncHyperCore,
                },
                syncTasks: tasks,
                hyperEvmAddress: account.hyperEvmAddress || account.address,
                hyperCoreAddress: account.hyperCoreAddress || account.address,
            }
        })

        // Store run metadata (could be in Redis or database)
        // For now, we'll just return it
        // TODO: Store runMetadata in database or Redis for status tracking
        // const runMetadata = {
        //     runId,
        //     status: 'initiated',
        //     startTime: new Date().toISOString(),
        //     totalAccounts: accounts.length,
        //     accounts: syncTasks,
        // }

        console.log(`[Analytics Trigger] Initiated run ${runId} for ${accounts.length} accounts`)

        // Log platform distribution
        const hyperEvmCount = syncTasks.filter((t) => t.platforms.hyperEvm).length
        const hyperCoreCount = syncTasks.filter((t) => t.platforms.hyperCore).length
        console.log(`[Analytics Trigger] HyperEVM: ${hyperEvmCount}, HyperCore: ${hyperCoreCount}`)

        return NextResponse.json({
            success: true,
            runId,
            status: 'initiated',
            accounts: syncTasks.map((t) => ({
                address: t.address,
                name: t.name,
                platforms: Object.entries(t.platforms)
                    .filter(([, enabled]) => enabled)
                    .map(([platform]) => platform),
                syncTasks: t.syncTasks,
            })),
            summary: {
                totalAccounts: accounts.length,
                hyperEvmAccounts: hyperEvmCount,
                hyperCoreAccounts: hyperCoreCount,
                estimatedDuration: `${accounts.length * 2}-${accounts.length * 5} seconds`,
            },
        })
    } catch (error) {
        console.error('[Analytics Trigger] Error:', error)
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
 * Get analytics run status
 * GET /api/internal/analytics/trigger?runId=run_123
 */
export const GET = withApiAuth(async (request: NextRequest) => {
    try {
        const url = new URL(request.url)
        const runId = url.searchParams.get('runId')

        if (!runId) {
            // Return last run info
            const lastSnapshot = await prismaMonitoring.accountSnapshot.findFirst({
                orderBy: { createdAt: 'desc' },
            })

            const accountCount = await prismaMonitoring.monitoredAccount.count({
                where: { isActive: true },
            })

            return NextResponse.json({
                success: true,
                lastRun: lastSnapshot
                    ? {
                          timestamp: lastSnapshot.createdAt,
                          accountsProcessed: accountCount,
                      }
                    : null,
                message: 'Provide runId parameter to get specific run status',
            })
        }

        // In a real implementation, fetch run status from storage
        // For now, return a mock status
        return NextResponse.json({
            success: true,
            runId,
            status: 'completed',
            message: 'Run status tracking not yet implemented',
        })
    } catch (error) {
        console.error('[Analytics Status] Error:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 },
        )
    }
})
