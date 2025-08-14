import { monitorService } from '../monitoring/account-monitor.service'
import { analyticsService } from './analytics.service'
import { prismaMonitoring } from '@/lib/prisma-monitoring'

export interface OrchestratorResult {
    success: boolean
    error?: string
    accountsProcessed?: number
    positionsFound?: {
        lp: number
        perp: number
        spot: number
        total: number
    }
    metricsCalculated?: number
    snapshotsStored?: number
    oldSnapshotsDeleted?: number
    aggregatedMetrics?: {
        totalValue: number
        totalDelta: number
        averageAPR: number
    }
    duration?: number
}

/**
 * Simplified orchestrator that coordinates monitoring and analytics
 */
export class OrchestratorService {
    /**
     * Run full analytics pipeline
     */
    async runFullAnalytics(): Promise<OrchestratorResult> {
        const startTime = Date.now()

        try {
            console.log('[Orchestrator] Starting full analytics run...')

            // Step 1: Sync all accounts and positions
            console.log('[Orchestrator] Step 1: Syncing positions...')
            const syncResult = await monitorService.syncAllAccounts()

            if (syncResult.errors.length > 0) {
                console.warn('[Orchestrator] Sync completed with errors:', syncResult.errors)
            }

            // Step 2: Calculate metrics for all accounts
            console.log('[Orchestrator] Step 2: Calculating metrics...')
            const accounts = await monitorService.getMonitoredAccounts()
            let metricsCalculated = 0

            for (const account of accounts) {
                try {
                    await analyticsService.calculateAccountMetrics(account.id)
                    metricsCalculated++
                } catch (error) {
                    console.error(`[Orchestrator] Failed to calculate metrics for ${account.address}:`, error)
                }
            }

            // Step 3: Clean up old snapshots
            console.log('[Orchestrator] Step 3: Cleaning up old snapshots...')
            const deletedCount = await analyticsService.cleanupOldSnapshots(7)

            // Step 4: Get aggregated metrics
            console.log('[Orchestrator] Step 4: Getting aggregated metrics...')
            const aggregated = await analyticsService.getAggregatedMetrics()

            const duration = Date.now() - startTime

            console.log(`[Orchestrator] Completed in ${duration}ms`)
            console.log(`[Orchestrator] - Accounts: ${accounts.length}`)
            console.log(`[Orchestrator] - LP Positions: ${syncResult.lpPositions}`)
            console.log(`[Orchestrator] - Perp Positions: ${syncResult.perpPositions}`)
            console.log(`[Orchestrator] - Spot Balances: ${syncResult.spotBalances}`)
            console.log(`[Orchestrator] - Total Value: $${aggregated.totalValue.toFixed(2)}`)
            console.log(`[Orchestrator] - Net Delta: $${aggregated.totalDelta.toFixed(2)}`)
            console.log(`[Orchestrator] - Average APR: ${(aggregated.averageAPR * 100).toFixed(2)}%`)

            return {
                success: true,
                accountsProcessed: accounts.length,
                positionsFound: {
                    lp: syncResult.lpPositions,
                    perp: syncResult.perpPositions,
                    spot: syncResult.spotBalances,
                    total: syncResult.lpPositions + syncResult.perpPositions + syncResult.spotBalances,
                },
                metricsCalculated,
                snapshotsStored: metricsCalculated,
                oldSnapshotsDeleted: deletedCount,
                aggregatedMetrics: aggregated,
                duration,
            }
        } catch (error) {
            const duration = Date.now() - startTime
            console.error('[Orchestrator] Fatal error:', error)

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                duration,
            }
        }
    }

    /**
     * Quick sync - just update positions without full metrics calculation
     */
    async quickSync(): Promise<OrchestratorResult> {
        const startTime = Date.now()

        try {
            const syncResult = await monitorService.syncAllAccounts()
            const duration = Date.now() - startTime

            return {
                success: true,
                accountsProcessed: syncResult.accounts,
                positionsFound: {
                    lp: syncResult.lpPositions,
                    perp: syncResult.perpPositions,
                    spot: syncResult.spotBalances,
                    total: syncResult.lpPositions + syncResult.perpPositions + syncResult.spotBalances,
                },
                duration,
            }
        } catch (error) {
            const duration = Date.now() - startTime
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                duration,
            }
        }
    }

    /**
     * Get current status without running sync
     */
    async getStatus(): Promise<{
        accounts: number
        positions: { lp: number; perp: number; spot: number }
        lastSnapshot?: Date
        aggregatedMetrics: Awaited<ReturnType<typeof analyticsService.getAggregatedMetrics>>
    }> {
        const [accounts, lpPositions, perpPositions, spotBalances, aggregated] = await Promise.all([
            monitorService.getMonitoredAccounts(),
            prismaMonitoring.lpPosition.count(),
            prismaMonitoring.perpPosition.count(),
            prismaMonitoring.spotBalance.count({ where: { balance: { gt: 0 } } }),
            analyticsService.getAggregatedMetrics(),
        ])

        // Get last snapshot time
        const lastSnapshot = await prismaMonitoring.accountSnapshot.findFirst({
            orderBy: { timestamp: 'desc' },
            select: { timestamp: true },
        })

        return {
            accounts: accounts.length,
            positions: {
                lp: lpPositions,
                perp: perpPositions,
                spot: spotBalances,
            },
            lastSnapshot: lastSnapshot?.timestamp,
            aggregatedMetrics: aggregated,
        }
    }
}

export const orchestratorService = new OrchestratorService()
