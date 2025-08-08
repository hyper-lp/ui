#!/usr/bin/env tsx

import { analyticsOrchestrator } from '@/services/06-analytics-orchestrator.service'
import { prisma } from '@/lib/prisma'

async function runManualCron() {
    console.log('🔄 Running analytics cron manually...\n')
    
    try {
        // Show current monitored wallets
        const wallets = await prisma.monitoredWallet.findMany({
            where: { isActive: true }
        })
        
        console.log('📊 Monitored Wallets:')
        wallets.forEach(w => {
            console.log(`  - ${w.address} (${w.name || 'No label'})`)
        })
        console.log('')
        
        // Run the analytics
        console.log('🚀 Starting analytics run...\n')
        const result = await analyticsOrchestrator.runFullAnalytics()
        
        if (!result.success) {
            console.error('❌ Analytics run failed:', result.error)
            process.exit(1)
        }
        
        // Show results
        console.log('\n✅ Analytics Run Complete!\n')
        console.log('📈 Results Summary:')
        console.log('─'.repeat(50))
        console.log(`Wallets Monitored:    ${result.walletsMonitored}`)
        console.log(`Positions Found:      ${result.positionsUpdated}`)
        console.log(`Hedge Positions:      ${result.hedgePositions || 0}`)
        console.log(`Total Value (USD):    $${(result.totalValueUSD || 0).toFixed(2)}`)
        console.log(`Average Fee APR:      ${((result.averageFeeAPR || 0) * 100).toFixed(2)}%`)
        console.log(`Old Snapshots Deleted: ${result.oldRunsDeleted || 0}`)
        
        // Pool stats
        if (result.poolStats) {
            console.log('\n🏊 Pool Statistics:')
            console.log('─'.repeat(50))
            console.log(`Total Pools:    ${result.poolStats.totalPools}`)
            console.log(`Active Pools:   ${result.poolStats.activePools}`)
            
            if (result.poolStats.byDex) {
                console.log('\nBy DEX:')
                Object.entries(result.poolStats.byDex).forEach(([dex, stats]: [string, any]) => {
                    console.log(`  ${dex}: ${stats.active}/${stats.count} active`)
                })
            }
        }
        
        // Delta drift check
        if (result.deltaDrift) {
            console.log('\n⚖️ Delta Drift Status:')
            console.log('─'.repeat(50))
            if (result.deltaDrift.needsRebalance) {
                console.log(`⚠️ Rebalance needed for ${result.deltaDrift.wallets.length} wallet(s)`)
                console.log(`Total drift: $${result.deltaDrift.totalDriftUSD.toFixed(2)}`)
                result.deltaDrift.wallets.forEach(w => {
                    console.log(`  - ${w}`)
                })
            } else {
                console.log('✅ All positions within acceptable delta range')
            }
        }
        
        // Show recent snapshots
        console.log('\n📸 Recent Position Snapshots:')
        console.log('─'.repeat(50))
        const recentSnapshots = await prisma.positionSnapshot.findMany({
            take: 5,
            orderBy: { timestamp: 'desc' },
            include: {
                position: {
                    include: { wallet: true }
                }
            }
        })
        
        if (recentSnapshots.length > 0) {
            recentSnapshots.forEach((snapshot: any) => {
                console.log(`  ${snapshot.position.wallet.address.slice(0, 10)}... | ` +
                    `Value: $${snapshot.totalValueUSD.toFixed(2)} | ` +
                    `APR: ${(snapshot.feeAPR * 100).toFixed(2)}% | ` +
                    `${snapshot.inRange ? '✅ In Range' : '❌ Out of Range'}`)
            })
        } else {
            console.log('  No snapshots found')
        }
        
    } catch (error) {
        console.error('❌ Error running cron:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

// Run the cron
runManualCron()