import { inngest } from '@/lib/inngest'
import { analyticsOrchestrator } from '@/services/06-analytics-orchestrator.service'

/**
 * Main cron job that pulls analytics data and stores it to database
 * Runs every 15 minutes by default
 */
export const pullAndStoreAnalyticsCron = inngest.createFunction(
    {
        id: 'pull-and-store-analytics-cron',
        name: 'Pull and Store LP & Hedge Analytics (Cron)',
    },
    {
        cron: process.env.ANALYTICS_CRON || '*/30 * * * *', // Every 30 minutes
    },
    async ({ step, logger }) => {
        return await step.run('fetch-and-store-analytics', async () => {
            const startTime = Date.now()

            try {
                // Log start of cron run
                logger.info('🚀 Starting analytics cron job', {
                    timestamp: new Date().toISOString(),
                    environment: process.env.NODE_ENV,
                    cron: process.env.ANALYTICS_CRON || '*/30 * * * *',
                })

                // Delegate to orchestrator for the actual analytics logic
                const result = await analyticsOrchestrator.runFullAnalytics()

                const duration = Date.now() - startTime

                if (result.success) {
                    // Log successful completion with metrics
                    logger.info('✅ Analytics cron job completed successfully', {
                        duration: `${duration}ms`,
                        walletsMonitored: result.walletsMonitored,
                        positionsUpdated: result.positionsUpdated,
                        hedgePositions: result.hedgePositions,
                        totalValueUSD: result.totalValueUSD?.toFixed(2),
                        averageFeeAPR: result.averageFeeAPR ? `${(result.averageFeeAPR * 100).toFixed(2)}%` : '0%',
                        oldRunsDeleted: result.oldRunsDeleted,
                        poolStats: result.poolStats,
                        deltaDrift: result.deltaDrift,
                    })
                } else {
                    // Log failure with error details
                    logger.error('❌ Analytics cron job failed', {
                        duration: `${duration}ms`,
                        error: result.error,
                        stack: result.error?.includes('Error') ? result.error : undefined,
                    })

                    // Optionally, you can re-throw to trigger retry logic
                    if (process.env.RETRY_ON_ERROR === 'true') {
                        throw new Error(`Analytics cron failed: ${result.error}`)
                    }
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
                    walletsMonitored: 0,
                    positionsUpdated: 0,
                    hedgePositions: 0,
                    totalValueUSD: 0,
                    averageFeeAPR: 0,
                    oldRunsDeleted: 0,
                }
            }
        })
    },
)
