#!/usr/bin/env tsx

import { poolDiscoveryService } from '@/services/discovery/pool-discovery.service'
import { printSectionHeader, printSuccess, printPoolSummary } from '@/utils/test-helpers.util'

async function main() {
    printSectionHeader('Discovering all HYPE/USDT0 pools on HyperEVM', '🚀')

    try {
        // Use pool discovery service to discover pools
        const pools = await poolDiscoveryService.discoverAllHypeUsdt0Pools(true) // force refresh
        
        // Calculate stats from pools
        const stats = {
            totalPools: pools.length,
            activePools: pools.filter(p => p.isActive).length,
            totalLiquidity: pools.reduce((sum, p) => sum + p.liquidity, 0n),
            byDex: pools.reduce((acc, p) => {
                if (!acc[p.dex]) {
                    acc[p.dex] = { count: 0, active: 0, liquidity: 0n }
                }
                acc[p.dex].count++
                if (p.isActive) acc[p.dex].active++
                acc[p.dex].liquidity += p.liquidity
                return acc
            }, {} as Record<string, { count: number; active: number; liquidity: bigint }>)
        }

        printSuccess(`Found ${stats.totalPools} total pools (${stats.activePools} active)`)

        console.log('\n📊 Pool Statistics:')
        console.log(`  Total liquidity: ${stats.totalLiquidity}`)

        console.log('\n📈 Pools by DEX:')
        for (const [dex, dexStats] of Object.entries(stats.byDex)) {
            const dexData = dexStats as { count: number; active: number; liquidity: bigint }
            console.log(`\n  ${dex.toUpperCase()}:`)
            console.log(`    - Total pools: ${dexData.count}`)
            console.log(`    - Active pools: ${dexData.active}`)
            console.log(`    - Total liquidity: ${dexData.liquidity.toString()}`)
        }

        console.log('\n🏊 Active Pools:')
        for (const pool of pools) {
            console.log(`\n  ${pool.dex} - ${pool.feeLabel} fee`)
            console.log(`    Pool: ${pool.poolAddress}`)
            console.log(`    Liquidity: ${pool.liquidity}`)
            console.log(`    Tick: ${pool.tick}`)
            console.log(`    Active: ${pool.isActive ? '✅' : '❌'}`)
        }

        printPoolSummary(
            pools.map((p) => ({
                dex: p.dex,
                fee: p.fee,
                liquidity: p.liquidity,
            })),
        )

        printSuccess('Pool discovery complete!')
    } catch (error) {
        console.error('❌ Error:', error)
        process.exit(1)
    }
}

main().catch(console.error)
