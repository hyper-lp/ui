#!/usr/bin/env tsx

import { analyticsOrchestrator } from '@/services/06-analytics-orchestrator.service'
import { 
    printSectionHeader, 
    printSuccess, 
    formatUSD,
    printPoolSummary,
} from '@/utils/test-helpers.util'

async function main() {
    printSectionHeader('Discovering all HYPE/USDT0 pools on HyperEVM', '🚀')
    
    try {
        // Use orchestrator to discover pools
        const { pools, stats } = await analyticsOrchestrator.discoverPools(true) // force refresh
        
        printSuccess(`Found ${stats.totalPools} total pools (${stats.activePools} active)`)
        
        console.log('\n📊 Pool Statistics:')
        console.log(`  Total liquidity: ${stats.totalLiquidity}`)
        
        console.log('\n📈 Pools by DEX:')
        for (const [dex, dexStats] of Object.entries(stats.byDex)) {
            console.log(`\n  ${dex.toUpperCase()}:`)
            console.log(`    - Total pools: ${dexStats.count}`)
            console.log(`    - Active pools: ${dexStats.active}`)
            console.log(`    - Total liquidity: ${dexStats.liquidity}`)
        }
        
        console.log('\n🏊 Active Pools:')
        for (const pool of pools) {
            console.log(`\n  ${pool.dex} - ${pool.feeLabel} fee`)
            console.log(`    Pool: ${pool.poolAddress}`)
            console.log(`    Liquidity: ${pool.liquidity}`)
            console.log(`    Tick: ${pool.tick}`)
            console.log(`    Active: ${pool.isActive ? '✅' : '❌'}`)
        }
        
        printPoolSummary(pools.map(p => ({
            dex: p.dex,
            fee: p.fee,
            liquidity: p.liquidity,
        })))
        
        printSuccess('Pool discovery complete!')
        
    } catch (error) {
        console.error('❌ Error:', error)
        process.exit(1)
    }
}

main().catch(console.error)