#!/usr/bin/env tsx

import { analyticsOrchestrator } from '@/services/06-analytics-orchestrator.service'
import { prismaMonitoring } from '@/lib/prisma-monitoring'

async function runManualCron() {
    console.log('🔄 Running analytics cron manually...\n')
    
    try {
        // Show current monitored accounts
        const accounts = await prismaMonitoring.monitoredAccount.findMany({
            where: { isActive: true }
        })
        
        console.log('📊 Monitored Accounts:')
        accounts.forEach(w => {
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
        console.log(`Accounts Monitored:   ${result.accountsMonitored}`)
        console.log(`Positions Found:      ${result.positionsUpdated}`)
        console.log(`Perp Positions:       ${result.perpPositions || 0}`)
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
        
        // Net delta check
        if (result.netDelta) {
            console.log('\n⚖️ Net Delta Status:')
            console.log('─'.repeat(50))
            if (result.netDelta.needsRebalance) {
                console.log(`⚠️ Rebalance needed for ${result.netDelta.accounts.length} account(s)`)
                console.log(`Total drift: $${result.netDelta.totalDriftUSD.toFixed(2)}`)
                result.netDelta.accounts.forEach(w => {
                    console.log(`  - ${w}`)
                })
            } else {
                console.log('✅ All positions within acceptable delta range')
            }
        }
        
        // Show recent snapshots
        console.log('\n📸 Recent Position Snapshots:')
        console.log('─'.repeat(50))
        const recentSnapshots = await prismaMonitoring.accountSnapshot.findMany({
            take: 5,
            orderBy: { timestamp: 'desc' },
            include: {
                account: true
            }
        })
        
        if (recentSnapshots.length > 0) {
            recentSnapshots.forEach((snapshot: any) => {
                const accountAddress = snapshot.account?.address || 'Unknown'
                const totalValue = snapshot.lpValue.toNumber() + snapshot.perpValue.toNumber() + snapshot.spotValue.toNumber()
                console.log(`  ${accountAddress.slice(0, 10)}... | ` +
                    `Value: $${totalValue.toFixed(2)} | ` +
                    `APR: ${(snapshot.netAPR.toNumber() * 100).toFixed(2)}% | ` +
                    `Delta: ${snapshot.netDelta.toNumber().toFixed(2)}`)
            })
        } else {
            console.log('  No snapshots found')
        }
        
    } catch (error) {
        console.error('❌ Error running cron:', error)
        process.exit(1)
    } finally {
        await prismaMonitoring.$disconnect()
    }
}

// Run the cron
runManualCron()