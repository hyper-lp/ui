#!/usr/bin/env tsx

import { analyticsOrchestrator } from '@/services/06-analytics-orchestrator.service'
import { lpMonitorService } from '@/services/02-lp-monitor.service'
import { prismaMonitoring } from '@/lib/prisma-monitoring'
import {
    printSectionHeader,
    printSuccess,
    printError,
    printInfo,
    parseWalletFromArgs,
    hasFlag,
    formatAddress,
    printPositionSummary,
} from '@/utils/test-helpers.util'

async function main() {
    printSectionHeader('LP Position Fetching', '🔍')
    
    const walletAddress = parseWalletFromArgs()
    const shouldSave = hasFlag('--save')
    const fetchAll = hasFlag('--all')
    
    if (!walletAddress && !fetchAll) {
        printError('Usage: pnpm tsx scripts/02-fetch-positions.ts <wallet_address> [--save]')
        printError('   or: pnpm tsx scripts/02-fetch-positions.ts --all [--save]')
        process.exit(1)
    }
    
    try {
        if (fetchAll) {
            // Fetch positions for all monitored accounts
            printInfo('Fetching positions for all monitored accounts...')
            
            const accounts = await lpMonitorService.getMonitoredAccounts()
            if (accounts.length === 0) {
                printError('No monitored accounts found')
                process.exit(1)
            }
            
            const results = await analyticsOrchestrator.fetchPositionsForAccounts(accounts)
            
            printSuccess(`Checked ${accounts.length} accounts`)
            console.log(`\n📊 Results:`)
            console.log(`  Total positions: ${results.totalPositions}`)
            
            for (const [account, count] of Object.entries(results.byAccount)) {
                if (count > 0) {
                    console.log(`  ${formatAddress(account)}: ${count} positions`)
                }
            }
            
            // Show detailed position info
            for (const result of results.results) {
                if (result.positionsFound > 0) {
                    console.log(`\n📍 ${formatAddress(result.account.address)} positions:`)
                    for (const position of result.positions) {
                        console.log(`  - ${position.dex} Token #${position.tokenId}`)
                    }
                }
            }
            
        } else if (walletAddress) {
            // Add account to monitored list if using --save
            if (shouldSave) {
                const account = await prismaMonitoring.monitoredAccount.upsert({
                    where: { 
                        address: walletAddress,
                    },
                    update: { isActive: true },
                    create: {
                        address: walletAddress,
                        name: `Account ${formatAddress(walletAddress)}`,
                        isActive: true,
                    },
                })
                printSuccess(`Account added to monitoring: ${account.name}`)
            }
            
            // Fetch positions for specific account
            printInfo(`Fetching positions for ${formatAddress(walletAddress)}...`)
            
            const result = await lpMonitorService.discoverPositionsForAccount(walletAddress)
            
            console.log(`\n📊 Results:`)
            console.log(`  Pools checked: ${result.poolsChecked}`)
            console.log(`  Positions found: ${result.positionsFound}`)
            
            if (result.positions.length > 0) {
                console.log('\n📍 Position Details:')
                for (const position of result.positions) {
                    console.log(`  ${position.dex} - Token ID: ${position.tokenId}`)
                    console.log(`    Pool: ${position.poolAddress}`)
                    console.log(`    Manager: ${position.positionManagerAddress}`)
                }
                
                printPositionSummary(result.positions)
                
                if (shouldSave) {
                    printSuccess('Positions saved to database')
                }
            } else {
                printInfo('No HYPE/USDT0 positions found for this account')
            }
        }
        
        printSuccess('Position fetching complete!')
        
    } catch (error) {
        console.error('❌ Error:', error)
        process.exit(1)
    }
}

main().catch(console.error)