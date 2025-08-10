import { inngest } from '@/lib/inngest'
import { env } from '@/env/t3-env'

/**
 * Analytics cron job that uses the new API endpoints
 * This provides better separation of concerns and platform-aware syncing
 */
export const pullAndStoreAnalyticsApiCron = inngest.createFunction(
    {
        id: 'pull-and-store-analytics-api-cron',
        name: 'Pull and Store Analytics via API (Platform-Aware)',
    },
    {
        cron: env.ANALYTICS_CRON || '*/30 * * * *', // Every 30 minutes
    },
    async ({ step, logger }) => {
        const apiKey = env.INTERNAL_API_KEY
        const baseUrl = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

        if (!apiKey) {
            logger.error('❌ INTERNAL_API_KEY not configured')
            return {
                success: false,
                error: 'API key not configured',
            }
        }

        const headers = {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
        }

        // Step 1: Trigger analytics run and get account context
        const triggerResult = await step.run('trigger-analytics', async () => {
            const startTime = Date.now()

            try {
                logger.info('🚀 Triggering analytics run')

                const response = await fetch(`${baseUrl}/api/internal/analytics/trigger`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({}), // Process all accounts
                })

                const data = await response.json()

                if (!data.success) {
                    throw new Error(data.error || 'Failed to trigger analytics')
                }

                logger.info('✅ Analytics triggered', {
                    runId: data.runId,
                    accounts: data.summary.totalAccounts,
                    hyperEvmAccounts: data.summary.hyperEvmAccounts,
                    hyperCoreAccounts: data.summary.hyperCoreAccounts,
                })

                return {
                    success: true,
                    runId: data.runId,
                    accounts: data.accounts,
                    duration: Date.now() - startTime,
                }
            } catch (error) {
                logger.error('❌ Failed to trigger analytics', {
                    error: error instanceof Error ? error.message : 'Unknown error',
                })
                throw error
            }
        })

        if (!triggerResult.success) {
            return triggerResult
        }

        // Step 2: Sync data from platforms in parallel
        const syncResult = await step.run('sync-platforms', async () => {
            const startTime = Date.now()
            const { accounts } = triggerResult

            // Group accounts by platform
            const hyperEvmAccounts = accounts
                .filter((a: { platforms: string[] }) => a.platforms.includes('hyperEvm'))
                .map((a: { address: string }) => a.address)

            const hyperCoreAccounts = accounts
                .filter((a: { platforms: string[] }) => a.platforms.includes('hyperCore'))
                .map((a: { address: string }) => a.address)

            logger.info('📊 Syncing platforms', {
                hyperEvmAccounts: hyperEvmAccounts.length,
                hyperCoreAccounts: hyperCoreAccounts.length,
            })

            const syncPromises = []
            interface SyncResults {
                hyperEvm: { lp: unknown }
                hyperCore: { perp: unknown; spot: unknown }
                errors: string[]
            }
            const results: SyncResults = {
                hyperEvm: { lp: null },
                hyperCore: { perp: null, spot: null },
                errors: [],
            }

            // Sync HyperEVM LP positions
            if (hyperEvmAccounts.length > 0) {
                syncPromises.push(
                    fetch(`${baseUrl}/api/internal/sync/hyperevm/lp`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ accounts: hyperEvmAccounts }),
                    })
                        .then((r) => r.json())
                        .then((data) => {
                            results.hyperEvm.lp = data
                            logger.info('✅ HyperEVM LP sync complete', {
                                processed: data.results?.processed,
                                positions: data.results?.positionsFound,
                            })
                        })
                        .catch((error) => {
                            const msg = `HyperEVM LP sync failed: ${error.message}`
                            results.errors.push(msg)
                            logger.error(msg)
                        }),
                )
            }

            // Sync HyperCore perp positions
            if (hyperCoreAccounts.length > 0) {
                syncPromises.push(
                    fetch(`${baseUrl}/api/internal/sync/hypercore/perp`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ accounts: hyperCoreAccounts }),
                    })
                        .then((r) => r.json())
                        .then((data) => {
                            results.hyperCore.perp = data
                            logger.info('✅ HyperCore Perp sync complete', {
                                processed: data.results?.processed,
                                positions: data.results?.positionsFound,
                            })
                        })
                        .catch((error) => {
                            const msg = `HyperCore Perp sync failed: ${error.message}`
                            results.errors.push(msg)
                            logger.error(msg)
                        }),
                )

                // Sync HyperCore spot balances
                syncPromises.push(
                    fetch(`${baseUrl}/api/internal/sync/hypercore/spot`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ accounts: hyperCoreAccounts }),
                    })
                        .then((r) => r.json())
                        .then((data) => {
                            results.hyperCore.spot = data
                            logger.info('✅ HyperCore Spot sync complete', {
                                processed: data.results?.processed,
                                balances: data.results?.balancesFound,
                            })
                        })
                        .catch((error) => {
                            const msg = `HyperCore Spot sync failed: ${error.message}`
                            results.errors.push(msg)
                            logger.error(msg)
                        }),
                )
            }

            // Wait for all syncs to complete
            await Promise.all(syncPromises)

            return {
                success: results.errors.length === 0,
                duration: Date.now() - startTime,
                results,
            }
        })

        // Step 3: Run analytics computation
        const analyticsResult = await step.run('compute-analytics', async () => {
            const startTime = Date.now()

            try {
                logger.info('🧮 Computing analytics and creating snapshots')

                const response = await fetch(`${baseUrl}/api/internal/analytics/run`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({}),
                })

                const data = await response.json()

                if (!data.success) {
                    throw new Error(data.error || 'Analytics computation failed')
                }

                logger.info('✅ Analytics computed successfully', {
                    duration: data.duration,
                    accountsMonitored: data.results.accountsMonitored,
                    positionsUpdated: data.results.positionsUpdated,
                    totalValueUSD: data.results.totalValueUSD,
                    netAPR: data.results.averageFeeAPR,
                })

                return {
                    success: true,
                    duration: Date.now() - startTime,
                    results: data.results,
                } as const
            } catch (error) {
                logger.error('❌ Analytics computation failed', {
                    error: error instanceof Error ? error.message : 'Unknown error',
                })
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    duration: Date.now() - startTime,
                    results: null,
                } as const
            }
        })

        // Final summary
        const totalDuration = triggerResult.duration + syncResult.duration + analyticsResult.duration

        logger.info('📊 Cron job complete', {
            runId: triggerResult.runId,
            totalDuration: `${totalDuration}ms`,
            success: analyticsResult.success,
            syncErrors: syncResult.results.errors.length,
        })

        return {
            success: analyticsResult.success,
            runId: triggerResult.runId,
            duration: totalDuration,
            summary: analyticsResult.results,
        }
    },
)
