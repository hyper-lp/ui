#!/usr/bin/env tsx

/**
 * Unified monitoring script for all operations
 * 
 * Usage:
 *   pnpm monitor           - Run full sync
 *   pnpm monitor quick     - Quick sync (positions only)
 *   pnpm monitor status    - Check current status
 *   pnpm monitor pools     - Discover pools
 *   pnpm monitor account <address> - Monitor specific account
 */

import { orchestratorService } from '@/services/orchestrator.service'
import { monitorService } from '@/services/monitor.service'
import { analyticsService } from '@/services/analytics.service'
import { prismaMonitoring } from '@/lib/prisma-monitoring'

async function main() {
    const command = process.argv[2] || 'full'
    const arg = process.argv[3]

    console.log(`\n🚀 Monitor Script - Command: ${command}\n`)

    try {
        switch (command) {
            case 'quick':
                const quickResult = await orchestratorService.quickSync()
                console.log('✅ Quick sync completed:')
                console.log(JSON.stringify(quickResult, null, 2))
                break

            case 'status':
                const status = await orchestratorService.getStatus()
                console.log('📊 Current Status:')
                console.log(`  Accounts: ${status.accounts}`)
                console.log(`  LP Positions: ${status.positions.lp}`)
                console.log(`  Perp Positions: ${status.positions.perp}`)
                console.log(`  Spot Balances: ${status.positions.spot}`)
                console.log(`  Last Snapshot: ${status.lastSnapshot || 'Never'}`)
                console.log('\n💰 Aggregated Metrics:')
                console.log(`  Total Value: $${status.aggregatedMetrics.totalValue.toFixed(2)}`)
                console.log(`  Total Delta: $${status.aggregatedMetrics.totalDelta.toFixed(2)}`)
                console.log(`  Average APR: ${(status.aggregatedMetrics.averageAPR * 100).toFixed(2)}%`)
                break

            case 'pools':
                console.log('🔍 Discovering pools...')
                const pools = await monitorService.discoverHypeUsdtPools(true)
                console.log(`Found ${pools.length} active pools:`)
                pools.forEach(pool => {
                    console.log(`  ${pool.dex}: ${pool.poolAddress.slice(0, 10)}... (Fee: ${pool.fee / 10000}%)`)
                })
                break

            case 'account':
                if (!arg) {
                    console.error('❌ Please provide an account address')
                    process.exit(1)
                }
                console.log(`📊 Monitoring account: ${arg}`)
                
                // Get or create account
                const account = await prismaMonitoring.monitoredAccount.upsert({
                    where: { address: arg.toLowerCase() },
                    create: {
                        address: arg.toLowerCase(),
                        name: `Account ${arg.slice(0, 6)}...${arg.slice(-4)}`,
                        isActive: true,
                    },
                    update: { isActive: true },
                })

                // Fetch positions
                const positions = await monitorService.fetchAllPositions(account)
                console.log(`\nPositions found:`)
                console.log(`  LP: ${positions.lp.length}`)
                console.log(`  Perp: ${positions.perp.length}`)
                console.log(`  Spot: ${positions.spot.length}`)

                // Calculate metrics
                const metrics = await analyticsService.calculateAccountMetrics(account.id)
                console.log(`\nMetrics:`)
                console.log(`  LP Value: $${metrics.lpValue.toFixed(2)}`)
                console.log(`  Perp Value: $${metrics.perpValue.toFixed(2)}`)
                console.log(`  Spot Value: $${metrics.spotValue.toFixed(2)}`)
                console.log(`  Net Delta: $${metrics.netDelta.toFixed(2)}`)
                console.log(`  LP APR: ${(metrics.lpFeeAPR * 100).toFixed(2)}%`)
                console.log(`  Funding APR: ${(metrics.fundingAPR * 100).toFixed(2)}%`)
                console.log(`  Net APR: ${(metrics.netAPR * 100).toFixed(2)}%`)
                break

            case 'full':
            default:
                const result = await orchestratorService.runFullAnalytics()
                if (result.success) {
                    console.log('✅ Full analytics completed successfully!')
                    console.log(`  Duration: ${result.duration}ms`)
                    console.log(`  Accounts: ${result.accountsProcessed}`)
                    console.log(`  Positions: ${result.positionsFound?.total}`)
                    console.log(`  Metrics Calculated: ${result.metricsCalculated}`)
                    console.log(`  Old Snapshots Deleted: ${result.oldSnapshotsDeleted}`)
                    
                    if (result.aggregatedMetrics) {
                        console.log('\n💰 Aggregated Metrics:')
                        console.log(`  Total Value: $${result.aggregatedMetrics.totalValue.toFixed(2)}`)
                        console.log(`  Total Delta: $${result.aggregatedMetrics.totalDelta.toFixed(2)}`)
                        console.log(`  Average APR: ${(result.aggregatedMetrics.averageAPR * 100).toFixed(2)}%`)
                    }
                } else {
                    console.error('❌ Analytics failed:', result.error)
                    process.exit(1)
                }
                break
        }
    } catch (error) {
        console.error('❌ Error:', error)
        process.exit(1)
    }

    process.exit(0)
}

main()