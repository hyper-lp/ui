import { inngest } from '@/lib/inngest'
import { orchestratorService } from '@/services/analytics/orchestrator.service'
import { env } from '@/env/t3-env'

/**
 * Main cron job that pulls analytics data and stores it to database
 * Runs every 15 minutes by default
 */
export const pullAndStoreAnalyticsCron = inngest.createFunction(
    {
        id: 'pull-and-store-analytics-cron',
        name: 'Pull and Store LP & Perp Analytics (Cron)',
    },
    {
        cron: env.ANALYTICS_CRON || '*/30 * * * *', // Every 30 minutes
    },
    async ({ step, logger }) => {
        return await step.run('fetch-and-store-analytics', async () => {
            const startTime = Date.now()

            try {
                // Log start of cron run
                logger.info('🚀 Starting analytics cron job', {
                    timestamp: new Date().toISOString(),
                    environment: process.env.NODE_ENV,
                    cron: env.ANALYTICS_CRON || '*/30 * * * *',
                })

                // Delegate to orchestrator for the actual analytics logic
                const result = await orchestratorService.runFullAnalytics()

                const duration = Date.now() - startTime

                if (result.success) {
                    // Log successful completion with metrics
                    logger.info('✅ Analytics cron job completed successfully', {
                        duration: `${duration}ms`,
                        accountsProcessed: result.accountsProcessed,
                        snapshotsStored: result.snapshotsStored,
                        oldSnapshotsDeleted: result.oldSnapshotsDeleted,
                        aggregatedMetrics: result.aggregatedMetrics,
                    })
                } else {
                    // Log failure with error details
                    logger.error('❌ Analytics cron job failed', {
                        duration: `${duration}ms`,
                        error: result.error,
                        stack: result.error?.includes('Error') ? result.error : undefined,
                    })

                    // Optionally, you can re-throw to trigger retry logic
                    // Retry logic can be configured here if needed
                    // Uncomment to enable retry on error:
                    // throw new Error(`Analytics cron failed: ${result.error}`)
                }

                return result
            } catch (error) {
                const duration = Date.now() - startTime

                // Log unexpected errors
                logger.error('💥 Unexpected error in analytics cron job', {
                    duration: `${duration}ms`,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    stack: error instanceof Error ? error.stack : undefined,
                    timestamp: new Date().toISOString(),
                })

                // Return error result
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error occurred',
                    accountsProcessed: 0,
                    snapshotsStored: 0,
                    oldSnapshotsDeleted: 0,
                }
            }
        })
    },
)
