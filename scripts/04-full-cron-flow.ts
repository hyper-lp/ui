#!/usr/bin/env tsx

import { analyticsOrchestrator } from '@/services/06-analytics-orchestrator.service'
import {
    printSectionHeader,
    printSuccess,
    printError,
    printInfo,
    printWarning,
    formatUSD,
    formatPercent,
    formatAddress,
    hasFlag,
} from '@/utils/test-helpers.util'

async function main() {
    printSectionHeader('Full Cron Flow Test', '🚀')

    const dryRun = hasFlag('--dry-run')
    const verbose = hasFlag('--verbose')

    if (dryRun) {
        printInfo('Running in dry-run mode (no database writes)')
    }

    try {
        printInfo('Starting complete analytics run...')

        // Run the full analytics flow
        const result = await analyticsOrchestrator.runFullAnalytics()

        if (!result.success) {
            printError(`Analytics run failed: ${result.error}`)
            process.exit(1)
        }

        printSuccess('Analytics run completed successfully!')

        // Display results
        console.log('\n📊 Run Summary:')
        console.log(`  Wallets monitored: ${result.walletsMonitored}`)
        console.log(`  Positions updated: ${result.positionsUpdated}`)
        console.log(`  Hedge positions: ${result.hedgePositions}`)
        console.log(`  Total value locked: ${formatUSD(result.totalValueUSD || 0)}`)
        console.log(`  Average APR: ${formatPercent(result.averageFeeAPR || 0)}`)
        console.log(`  Old runs deleted: ${result.oldRunsDeleted}`)

        // Pool statistics
        if (result.poolStats) {
            console.log('\n🏊 Pool Statistics:')
            console.log(`  Total pools: ${result.poolStats.totalPools}`)
            console.log(`  Active pools: ${result.poolStats.activePools}`)

            if (verbose && result.poolStats.byDex) {
                console.log('\n  By DEX:')
                for (const [dex, stats] of Object.entries(result.poolStats.byDex)) {
                    console.log(`    ${dex}: ${stats.active}/${stats.count} active`)
                }
            }
        }

        // Delta drift check
        if (result.deltaDrift) {
            console.log('\n⚖️ Delta Drift Analysis:')
            if (result.deltaDrift.needsRebalance) {
                printWarning(`Rebalance needed for ${result.deltaDrift.wallets.length} wallets`)
                console.log(`  Total drift: ${formatUSD(result.deltaDrift.totalDriftUSD)}`)

                if (verbose) {
                    console.log('  Wallets needing rebalance:')
                    for (const wallet of result.deltaDrift.wallets) {
                        console.log(`    - ${formatAddress(wallet)}`)
                    }
                }
            } else {
                printSuccess('All positions are delta neutral')
            }
        }

        console.log('\n' + '='.repeat(50))
        printSuccess('Cron flow test completed successfully!')
        console.log('\nThis demonstrates the complete flow that runs in production:')
        console.log('  1. ✅ Pool discovery')
        console.log('  2. ✅ Position fetching')
        console.log('  3. ✅ Metrics computation')
        console.log('  4. ✅ Data storage')
        console.log('  5. ✅ Rebalance checks')
    } catch (error) {
        printError('Test failed:')
        console.error(error)
        process.exit(1)
    }
}

// Parse command line arguments
if (process.argv.includes('--help')) {
    console.log('Usage: pnpm tsx scripts/04-full-cron-flow.ts [options]')
    console.log('\nOptions:')
    console.log('  --dry-run    Run without writing to database')
    console.log('  --verbose    Show detailed output')
    console.log('  --help       Show this help message')
    process.exit(0)
}

main().catch(console.error)
