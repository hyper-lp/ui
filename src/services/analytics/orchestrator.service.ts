import { analyticsService } from './analytics.service'
import { env } from '@/env/t3-env'

export interface OrchestratorResult {
    success: boolean
    error?: string
    accountsProcessed?: number
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
 * Simplified orchestrator that coordinates snapshot fetching and storage
 */
export class OrchestratorService {
    /**
     * Get accounts to monitor from environment or database
     */
    private getMonitoredAccounts(): string[] {
        // Get from environment variable
        if (env.MONITORED_WALLETS) {
            return env.MONITORED_WALLETS.split(',').map((addr) => addr.trim().toLowerCase())
        }
        return []
    }

    /**
     * Run full analytics pipeline
     */
    async runFullAnalytics(): Promise<OrchestratorResult> {
        const startTime = Date.now()

        try {
            console.log('[Orchestrator] Starting full analytics run...')

            // Step 1: Get accounts to monitor
            const accounts = this.getMonitoredAccounts()
            if (accounts.length === 0) {
                console.warn('[Orchestrator] No accounts to monitor')
                return {
                    success: false,
                    error: 'No accounts configured for monitoring',
                    duration: Date.now() - startTime,
                }
            }

            console.log(`[Orchestrator] Monitoring ${accounts.length} accounts`)

            // Step 2: Fetch and store snapshots for all accounts
            console.log('[Orchestrator] Step 2: Fetching and storing snapshots...')
            let snapshotsStored = 0
            const baseUrl = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

            for (const account of accounts) {
                try {
                    await analyticsService.fetchAndStoreSnapshot(account, baseUrl)
                    snapshotsStored++
                } catch (error) {
                    console.error(`[Orchestrator] Failed to process ${account}:`, error)
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
            console.log(`[Orchestrator] - Accounts Processed: ${accounts.length}`)
            console.log(`[Orchestrator] - Snapshots Stored: ${snapshotsStored}`)
            console.log(`[Orchestrator] - Old Snapshots Deleted: ${deletedCount}`)
            console.log(`[Orchestrator] - Total Value: $${aggregated.totalValue.toFixed(2)}`)
            console.log(`[Orchestrator] - Net Delta: ${aggregated.totalDelta.toFixed(2)} HYPE`)
            console.log(`[Orchestrator] - Average APR: ${aggregated.averageAPR.toFixed(2)}%`)

            return {
                success: true,
                accountsProcessed: accounts.length,
                snapshotsStored,
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
     * Quick sync - just fetch latest snapshots without storing
     */
    async quickSync(): Promise<OrchestratorResult> {
        const startTime = Date.now()

        try {
            const accounts = this.getMonitoredAccounts()
            const baseUrl = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

            let successCount = 0
            for (const account of accounts) {
                try {
                    const response = await fetch(`${baseUrl}/api/snapshot/${account}`)
                    if (response.ok) successCount++
                } catch (error) {
                    console.error(`[Orchestrator] Failed to check ${account}:`, error)
                }
            }

            const duration = Date.now() - startTime

            return {
                success: true,
                accountsProcessed: successCount,
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
}

export const orchestratorService = new OrchestratorService()
