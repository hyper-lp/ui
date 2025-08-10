import { prismaMonitoring } from '@/lib/prisma-monitoring'
import { poolDiscoveryService } from './01-pool-discovery.service'
import { lpMonitorService } from './02-lp-monitor.service'
import { perpMonitorService } from './03-perp-monitor.service'
import { analyticsPullService } from './04-analytics-fetcher.service'
import { analyticsStoreService } from './05-analytics-store.service'
import type { PoolInfo } from './01-pool-discovery.service'
import type { DexLPPosition } from '@/interfaces/dex.interface'
import type { MonitoredAccount } from '@prisma/client-monitoring'

export interface AnalyticsRunResult {
    success: boolean
    error?: string
    accountsMonitored?: number
    positionsUpdated?: number
    perpPositions?: number
    totalValueUSD?: number
    averageFeeAPR?: number
    oldRunsDeleted?: number
    poolStats?: {
        totalPools: number
        activePools: number
        byDex: Record<string, { count: number; active: number; liquidity: bigint }>
    }
    netDelta?: {
        needsRebalance: boolean
        accounts: string[]
        totalDriftUSD: number
    }
}

export interface PositionDiscoveryResult {
    account: MonitoredAccount
    positions: DexLPPosition[]
    poolsChecked: number
    positionsFound: number
}

export interface PositionMetricsResult {
    positionId: string
    dex: string
    totalValueUSD: number
    unclaimedFeesUSD: number
    feeAPR: number
    inRange: boolean
    lpDelta: number
    perpDelta: number
    netDelta: number
    perpEffectiveness: number
}

/**
 * Orchestrates the entire analytics flow for LP monitoring
 * Single source of truth for both production cron and tests
 */
class AnalyticsOrchestrator {
    /**
     * Step 1: Discover all active HYPE/USDT0 pools
     */
    async discoverPools(forceRefresh = false): Promise<{
        pools: PoolInfo[]
        stats: Awaited<ReturnType<typeof poolDiscoveryService.getPoolStatistics>>
    }> {
        const pools = await poolDiscoveryService.getActiveHypeUsdt0Pools(forceRefresh)
        const stats = await poolDiscoveryService.getPoolStatistics()

        if (stats.activePools > 0) {
            console.log(`📊 Discovered ${stats.activePools} active HYPE/USDT0 pools across ${Object.keys(stats.byDex).length} DEXs`)
        }

        return { pools, stats }
    }

    /**
     * Step 2: Fetch positions for all monitored accounts
     */
    async fetchPositionsForAccounts(accounts?: MonitoredAccount[]): Promise<{
        results: PositionDiscoveryResult[]
        totalPositions: number
        byAccount: Record<string, number>
    }> {
        // Get accounts from parameter or database
        const accountsToMonitor = accounts || (await lpMonitorService.getMonitoredAccounts())

        const results: PositionDiscoveryResult[] = []
        const byAccount: Record<string, number> = {}
        let totalPositions = 0

        for (const account of accountsToMonitor) {
            const result = await lpMonitorService.discoverPositionsForAccount(account.address, account.id)

            results.push({
                account,
                positions: result.positions,
                poolsChecked: result.poolsChecked,
                positionsFound: result.positionsFound,
            })

            byAccount[account.address] = result.positionsFound
            totalPositions += result.positionsFound

            if (result.positionsFound > 0) {
                console.log(`📍 Account ${account.address}: ${result.positionsFound} positions found`)
            }
        }

        return {
            results,
            totalPositions,
            byAccount,
        }
    }

    /**
     * Step 3: Compute metrics for all positions
     */
    async computeMetrics(positions: DexLPPosition[]): Promise<{
        metrics: PositionMetricsResult[]
        summary: {
            totalValueUSD: number
            totalUnclaimedFeesUSD: number
            averageFeeAPR: number
            positionsInRange: number
            totalLpDelta: number
            totalPerpDelta: number
            totalNetDelta: number
        }
    }> {
        if (positions.length === 0) {
            return {
                metrics: [],
                summary: {
                    totalValueUSD: 0,
                    totalUnclaimedFeesUSD: 0,
                    averageFeeAPR: 0,
                    positionsInRange: 0,
                    totalLpDelta: 0,
                    totalPerpDelta: 0,
                    totalNetDelta: 0,
                },
            }
        }

        // Pull metrics for all positions
        const pullResult = await analyticsPullService.pullAllPositionsMetrics(positions)

        // Get LP positions from database for additional data
        const dbPositions = await prismaMonitoring.lpPosition.findMany({
            where: {
                tokenId: { in: positions.map((p) => p.tokenId || '') },
            },
        })

        // Calculate enhanced metrics with delta exposure
        const enhancedMetrics: PositionMetricsResult[] = []
        let totalLpDelta = 0
        let totalPerpDelta = 0

        for (const metric of pullResult.metrics) {
            const dbPosition = dbPositions.find((p) => p.id === metric.positionId)

            if (!dbPosition) continue

            // Get perp position for this account
            const perpPosition = await prismaMonitoring.perpPosition.findFirst({
                where: {
                    accountId: dbPosition.accountId,
                    asset: 'HYPE',
                },
            })

            // Calculate delta exposure (casting to get token amounts)
            const metricsWithAmounts = metric as unknown as {
                token0Amount?: number
                token1Amount?: number
                token0Price?: number
                token0Symbol?: string
            }

            const lpDelta = lpMonitorService.calculateDeltaExposure(
                metricsWithAmounts.token0Amount || 0,
                metricsWithAmounts.token1Amount || 0,
                metricsWithAmounts.token0Price || 0,
                metricsWithAmounts.token0Symbol === 'HYPE',
            )

            const perpDelta = perpPosition ? perpPosition.szi.toNumber() * perpPosition.markPx.toNumber() : 0
            const netDelta = lpDelta + perpDelta
            const perpEffectiveness = perpMonitorService.calculatePerpEffectiveness(lpDelta, perpDelta)

            totalLpDelta += lpDelta
            totalPerpDelta += perpDelta

            enhancedMetrics.push({
                positionId: metric.positionId,
                dex: metric.dex,
                totalValueUSD: metric.totalValueUSD,
                unclaimedFeesUSD: metric.unclaimedFeesUSD,
                feeAPR: metric.feeAPR,
                inRange: metric.inRange,
                lpDelta,
                perpDelta,
                netDelta,
                perpEffectiveness,
            })
        }

        return {
            metrics: enhancedMetrics,
            summary: {
                ...pullResult.summary,
                totalLpDelta,
                totalPerpDelta,
                totalNetDelta: totalLpDelta + totalPerpDelta,
            },
        }
    }

    /**
     * Step 4: Store position snapshots
     */
    async storeSnapshots(metrics: PositionMetricsResult[]): Promise<number> {
        // Transform metrics for storage
        // Transform metrics for storage
        /* const positions = metrics.map((m) => {
            const metricsWithDetails = m as unknown as Record<string, unknown>
            return {
                tokenId: String(metricsWithDetails.tokenId || ''),
                dex: m.dex,
                positionManagerAddress: '',
                liquidity: '0',
                token0Amount: 0,
                token1Amount: 0,
                token0Symbol: '',
                token1Symbol: '',
                token0Price: 0,
                token1Price: 0,
                totalValueUSD: m.totalValueUSD,
                unclaimedFees0: 0,
                unclaimedFees1: 0,
                unclaimedFeesUSD: m.unclaimedFeesUSD,
                feeAPR: m.feeAPR,
                poolTick: 0,
                poolSqrtPriceX96: '0',
                inRange: m.inRange,
            }
        }) */

        // Position snapshots now handled at account level
        // await analyticsStoreService.createAccountSnapshot(...)

        // Store account snapshots instead of individual position snapshots
        let snapshotsCreated = 0
        const accountMetrics = new Map<string, { lpValue: number; perpValue: number; netDelta: number; lpFeeAPR: number }>()

        // Aggregate metrics by account
        for (const metric of metrics) {
            // Need to get account ID from position
            // This is simplified - in reality you'd need to track account per position
            const accountId = 'default' // TODO: Get from position data

            if (!accountMetrics.has(accountId)) {
                accountMetrics.set(accountId, { lpValue: 0, perpValue: 0, netDelta: 0, lpFeeAPR: 0 })
            }

            const current = accountMetrics.get(accountId)!
            current.lpValue += metric.totalValueUSD
            current.netDelta += metric.netDelta
            current.lpFeeAPR = metric.feeAPR // Simplified - should be weighted average
        }

        // Create snapshots for each account
        for (const [accountId, metrics] of accountMetrics) {
            await analyticsStoreService.createAccountSnapshot({
                accountId,
                lpValue: metrics.lpValue,
                perpValue: metrics.perpValue,
                spotValue: 0, // TODO: Add spot tracking
                netDelta: metrics.netDelta,
                lpFeeAPR: metrics.lpFeeAPR,
                fundingAPR: 0, // TODO: Get from perp positions
                netAPR: metrics.lpFeeAPR, // Simplified
            })
            snapshotsCreated++
        }

        // Clean up old snapshots (keep 30 days)
        await analyticsStoreService.cleanupOldSnapshots(30)

        return snapshotsCreated
    }

    /**
     * Step 5: Check for rebalance needs
     */
    async checkRebalanceNeeds(accounts: MonitoredAccount[]): Promise<{
        needsRebalance: boolean
        accounts: string[]
        totalDriftUSD: number
    }> {
        const accountsNeedingRebalance: string[] = []
        let totalDriftUSD = 0

        for (const account of accounts) {
            const rebalanceCheck = await perpMonitorService.checkRebalanceNeeded(account.id)

            if (rebalanceCheck.needed) {
                accountsNeedingRebalance.push(account.address)
                totalDriftUSD += Math.abs(rebalanceCheck.currentDrift || 0)
                console.log(`⚠️ Rebalance needed for account ${account.address}: $${rebalanceCheck.currentDrift.toFixed(2)} drift`)
            }
        }

        return {
            needsRebalance: accountsNeedingRebalance.length > 0,
            accounts: accountsNeedingRebalance,
            totalDriftUSD,
        }
    }

    /**
     * Run the complete analytics flow
     * This is the main entry point for the cron job
     */
    async runFullAnalytics(): Promise<AnalyticsRunResult> {
        try {
            if (process.env.NODE_ENV === 'development') {
                console.log('\n' + '='.repeat(60))
                console.log('🚀 [Analytics Orchestrator] Starting full analytics run...')
                console.log('='.repeat(60))
            }

            // Step 1: Discover pools
            if (process.env.NODE_ENV === 'development') {
                console.log('\n📍 Step 1: Pool Discovery')
            }
            const { stats: poolStats } = await this.discoverPools()

            // Step 2: Fetch positions
            if (process.env.NODE_ENV === 'development') {
                console.log('\n📍 Step 2: Fetching LP Positions')
            }
            const accounts = await lpMonitorService.getMonitoredAccounts()
            if (process.env.NODE_ENV === 'development') {
                console.log(`  👛 Monitoring ${accounts.length} account(s)`)
                accounts.forEach((w) => console.log(`    - ${w.address} (${w.name || 'no label'})`))
            }
            const positionResults = await this.fetchPositionsForAccounts(accounts)

            // Collect all positions
            const allPositions = positionResults.results.flatMap((r) => r.positions)

            if (process.env.NODE_ENV === 'development') {
                console.log(`  📦 Total positions found: ${allPositions.length}`)
            }

            if (allPositions.length === 0) {
                if (process.env.NODE_ENV === 'development') {
                    console.log('\n⚠️ No LP positions found. Ending analytics run.')
                }
                return {
                    success: true,
                    accountsMonitored: accounts.length,
                    positionsUpdated: 0,
                    perpPositions: 0,
                    totalValueUSD: 0,
                    averageFeeAPR: 0,
                    oldRunsDeleted: 0,
                    poolStats: {
                        totalPools: poolStats.totalPools,
                        activePools: poolStats.activePools,
                        byDex: poolStats.byDex,
                    },
                }
            }

            // Step 3: Fetch perp positions
            if (process.env.NODE_ENV === 'development') {
                console.log('\n📍 Step 3: Fetching Perp Positions')
            }
            const perpResult = await perpMonitorService.monitorAllAccounts()
            if (process.env.NODE_ENV === 'development') {
                console.log(`  🛡️ Found ${perpResult.perpPositions} perp position(s)`)
            }

            // Step 4: Compute metrics
            if (process.env.NODE_ENV === 'development') {
                console.log('\n📍 Step 4: Computing Metrics')
            }
            const { metrics, summary } = await this.computeMetrics(allPositions)
            if (process.env.NODE_ENV === 'development') {
                console.log(`  💰 Total Value: $${summary.totalValueUSD.toFixed(2)}`)
                console.log(`  📈 Average APR: ${(summary.averageFeeAPR * 100).toFixed(2)}%`)
                console.log(`  🎯 In Range: ${summary.positionsInRange}/${metrics.length}`)
            }

            // Step 5: Store snapshots
            if (process.env.NODE_ENV === 'development') {
                console.log('\n📍 Step 5: Storing Snapshots')
            }
            const deleted = await this.storeSnapshots(metrics)
            if (process.env.NODE_ENV === 'development') {
                console.log(`  💾 Stored ${metrics.length} snapshot(s)`)
                console.log(`  🗑️ Deleted ${deleted} old snapshot(s)`)
            }

            // Step 6: Check rebalance needs
            if (process.env.NODE_ENV === 'development') {
                console.log('\n📍 Step 6: Checking Rebalance Needs')
            }
            const netDelta = await this.checkRebalanceNeeds(accounts)
            if (process.env.NODE_ENV === 'development') {
                if (netDelta.needsRebalance) {
                    console.log(`  ⚠️ Rebalance needed for ${netDelta.accounts.length} account(s)`)
                    console.log(`  💸 Total drift: $${netDelta.totalDriftUSD.toFixed(2)}`)
                } else {
                    console.log(`  ✅ All positions within acceptable delta range`)
                }
            }

            if (process.env.NODE_ENV === 'development') {
                console.log('✅ Analytics run completed successfully')
            }

            return {
                success: true,
                accountsMonitored: accounts.length,
                positionsUpdated: metrics.length,
                perpPositions: perpResult.perpPositions,
                totalValueUSD: summary.totalValueUSD,
                averageFeeAPR: summary.averageFeeAPR,
                oldRunsDeleted: deleted,
                poolStats: {
                    totalPools: poolStats.totalPools,
                    activePools: poolStats.activePools,
                    byDex: poolStats.byDex,
                },
                netDelta,
            }
        } catch (error) {
            console.error('❌ Analytics run failed:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            }
        }
    }
}

export const analyticsOrchestrator = new AnalyticsOrchestrator()
