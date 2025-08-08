import { prisma } from '@/lib/prisma'
import { poolDiscoveryService } from './01-pool-discovery.service'
import { lpMonitorService } from './02-lp-monitor.service'
import { hedgeMonitorService } from './03-hedge-monitor.service'
import { analyticsPullService } from './04-analytics-fetcher.service'
import { lpDatabaseService } from './05-analytics-store.service'
import type { PoolInfo } from './01-pool-discovery.service'
import type { LPPosition } from '@/interfaces/dex.interface'
import type { MonitoredWallet } from '@prisma/client'

export interface AnalyticsRunResult {
    success: boolean
    error?: string
    walletsMonitored?: number
    positionsUpdated?: number
    hedgePositions?: number
    totalValueUSD?: number
    averageFeeAPR?: number
    oldRunsDeleted?: number
    poolStats?: {
        totalPools: number
        activePools: number
        byDex: Record<string, { count: number; active: number; liquidity: bigint }>
    }
    deltaDrift?: {
        needsRebalance: boolean
        wallets: string[]
        totalDriftUSD: number
    }
}

export interface PositionDiscoveryResult {
    wallet: MonitoredWallet
    positions: LPPosition[]
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
    hedgeDelta: number
    netDelta: number
    hedgeEffectiveness: number
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
     * Step 2: Fetch positions for all monitored wallets
     */
    async fetchPositionsForWallets(wallets?: MonitoredWallet[]): Promise<{
        results: PositionDiscoveryResult[]
        totalPositions: number
        byWallet: Record<string, number>
    }> {
        // Get wallets from parameter or database
        const walletsToMonitor = wallets || (await lpMonitorService.getMonitoredWallets())

        const results: PositionDiscoveryResult[] = []
        const byWallet: Record<string, number> = {}
        let totalPositions = 0

        for (const wallet of walletsToMonitor) {
            const result = await lpMonitorService.discoverPositionsForWallet(wallet.address, wallet.id)

            results.push({
                wallet,
                positions: result.positions,
                poolsChecked: result.poolsChecked,
                positionsFound: result.positionsFound,
            })

            byWallet[wallet.address] = result.positionsFound
            totalPositions += result.positionsFound

            if (result.positionsFound > 0) {
                console.log(`📍 Wallet ${wallet.address}: ${result.positionsFound} positions found`)
            }
        }

        return {
            results,
            totalPositions,
            byWallet,
        }
    }

    /**
     * Step 3: Compute metrics for all positions
     */
    async computeMetrics(positions: LPPosition[]): Promise<{
        metrics: PositionMetricsResult[]
        summary: {
            totalValueUSD: number
            totalUnclaimedFeesUSD: number
            averageFeeAPR: number
            positionsInRange: number
            totalLpDelta: number
            totalHedgeDelta: number
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
                    totalHedgeDelta: 0,
                    totalNetDelta: 0,
                },
            }
        }

        // Pull metrics for all positions
        const pullResult = await analyticsPullService.pullAllPositionsMetrics(positions)

        // Get LP positions from database for additional data
        const dbPositions = await prisma.lPPosition.findMany({
            where: {
                tokenId: { in: positions.map((p) => p.tokenId || '') },
                isActive: true,
            },
            include: {
                wallet: true,
                snapshots: {
                    orderBy: { timestamp: 'desc' },
                    take: 1,
                },
            },
        })

        // Calculate enhanced metrics with delta exposure
        const enhancedMetrics: PositionMetricsResult[] = []
        let totalLpDelta = 0
        let totalHedgeDelta = 0

        for (const metric of pullResult.metrics) {
            const dbPosition = dbPositions.find((p) => p.id === metric.positionId)

            if (!dbPosition) continue

            // Get hedge position for this wallet
            const hedgePosition = await prisma.hedgePosition.findFirst({
                where: {
                    walletAddress: dbPosition.ownerAddress,
                    asset: 'HYPE',
                    isActive: true,
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

            const hedgeDelta = hedgePosition ? -hedgePosition.notionalValue : 0
            const netDelta = lpDelta + hedgeDelta
            const hedgeEffectiveness = hedgeMonitorService.calculateHedgeEffectiveness(lpDelta, hedgeDelta)

            totalLpDelta += lpDelta
            totalHedgeDelta += hedgeDelta

            enhancedMetrics.push({
                positionId: metric.positionId,
                dex: metric.dex,
                totalValueUSD: metric.totalValueUSD,
                unclaimedFeesUSD: metric.unclaimedFeesUSD,
                feeAPR: metric.feeAPR,
                inRange: metric.inRange,
                lpDelta,
                hedgeDelta,
                netDelta,
                hedgeEffectiveness,
            })
        }

        return {
            metrics: enhancedMetrics,
            summary: {
                ...pullResult.summary,
                totalLpDelta,
                totalHedgeDelta,
                totalNetDelta: totalLpDelta + totalHedgeDelta,
            },
        }
    }

    /**
     * Step 4: Store position snapshots
     */
    async storeSnapshots(metrics: PositionMetricsResult[]): Promise<number> {
        // Transform metrics for storage
        const positions = metrics.map((m) => {
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
        })

        await lpDatabaseService.createPositionSnapshots(positions)

        // Clean up old snapshots (keep 30 days)
        const deleted = await lpDatabaseService.cleanupOldSnapshots(30)

        return deleted
    }

    /**
     * Step 5: Check for rebalance needs
     */
    async checkRebalanceNeeds(wallets: MonitoredWallet[]): Promise<{
        needsRebalance: boolean
        wallets: string[]
        totalDriftUSD: number
    }> {
        const walletsNeedingRebalance: string[] = []
        let totalDriftUSD = 0

        for (const wallet of wallets) {
            const rebalanceCheck = await hedgeMonitorService.checkRebalanceNeeded(wallet.address)

            if (rebalanceCheck.needed) {
                walletsNeedingRebalance.push(wallet.address)
                totalDriftUSD += Math.abs(rebalanceCheck.currentDrift || 0)
                console.log(`⚠️ Rebalance needed for wallet ${wallet.address}: $${rebalanceCheck.currentDrift.toFixed(2)} drift`)
            }
        }

        return {
            needsRebalance: walletsNeedingRebalance.length > 0,
            wallets: walletsNeedingRebalance,
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
            const wallets = await lpMonitorService.getMonitoredWallets()
            if (process.env.NODE_ENV === 'development') {
                console.log(`  👛 Monitoring ${wallets.length} wallet(s)`)
                wallets.forEach((w) => console.log(`    - ${w.address} (${w.name || 'no label'})`))
            }
            const positionResults = await this.fetchPositionsForWallets(wallets)

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
                    walletsMonitored: wallets.length,
                    positionsUpdated: 0,
                    hedgePositions: 0,
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

            // Step 3: Fetch hedge positions
            if (process.env.NODE_ENV === 'development') {
                console.log('\n📍 Step 3: Fetching Hedge Positions')
            }
            const hedgeResult = await hedgeMonitorService.monitorAllWallets()
            if (process.env.NODE_ENV === 'development') {
                console.log(`  🛡️ Found ${hedgeResult.hedgePositions} hedge position(s)`)
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
            const deltaDrift = await this.checkRebalanceNeeds(wallets)
            if (process.env.NODE_ENV === 'development') {
                if (deltaDrift.needsRebalance) {
                    console.log(`  ⚠️ Rebalance needed for ${deltaDrift.wallets.length} wallet(s)`)
                    console.log(`  💸 Total drift: $${deltaDrift.totalDriftUSD.toFixed(2)}`)
                } else {
                    console.log(`  ✅ All positions within acceptable delta range`)
                }
            }

            if (process.env.NODE_ENV === 'development') {
                console.log('✅ Analytics run completed successfully')
            }

            return {
                success: true,
                walletsMonitored: wallets.length,
                positionsUpdated: metrics.length,
                hedgePositions: hedgeResult.hedgePositions,
                totalValueUSD: summary.totalValueUSD,
                averageFeeAPR: summary.averageFeeAPR,
                oldRunsDeleted: deleted,
                poolStats: {
                    totalPools: poolStats.totalPools,
                    activePools: poolStats.activePools,
                    byDex: poolStats.byDex,
                },
                deltaDrift,
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
