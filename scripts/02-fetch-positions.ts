#!/usr/bin/env tsx

import { analyticsOrchestrator } from '@/services/06-analytics-orchestrator.service'
import { lpMonitorService } from '@/services/02-lp-monitor.service'
import { prisma } from '@/lib/prisma'
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
            // Fetch positions for all monitored wallets
            printInfo('Fetching positions for all monitored wallets...')
            
            const wallets = await lpMonitorService.getMonitoredWallets()
            if (wallets.length === 0) {
                printError('No monitored wallets found')
                process.exit(1)
            }
            
            const results = await analyticsOrchestrator.fetchPositionsForWallets(wallets)
            
            printSuccess(`Checked ${wallets.length} wallets`)
            console.log(`\n📊 Results:`)
            console.log(`  Total positions: ${results.totalPositions}`)
            
            for (const [wallet, count] of Object.entries(results.byWallet)) {
                if (count > 0) {
                    console.log(`  ${formatAddress(wallet)}: ${count} positions`)
                }
            }
            
            // Show detailed position info
            for (const result of results.results) {
                if (result.positionsFound > 0) {
                    console.log(`\n📍 ${formatAddress(result.wallet.address)} positions:`)
                    for (const position of result.positions) {
                        console.log(`  - ${position.dex} Token #${position.tokenId}`)
                    }
                }
            }
            
        } else if (walletAddress) {
            // Add wallet to monitored list if using --save
            if (shouldSave) {
                const wallet = await prisma.monitoredWallet.upsert({
                    where: { address: walletAddress },
                    update: { isActive: true },
                    create: {
                        address: walletAddress,
                        name: `Wallet ${formatAddress(walletAddress)}`,
                        isActive: true,
                    },
                })
                printSuccess(`Wallet added to monitoring: ${wallet.name}`)
            }
            
            // Fetch positions for specific wallet
            printInfo(`Fetching positions for ${formatAddress(walletAddress)}...`)
            
            const result = await lpMonitorService.discoverPositionsForWallet(walletAddress)
            
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
                printInfo('No HYPE/USDT0 positions found for this wallet')
            }
        }
        
        printSuccess('Position fetching complete!')
        
    } catch (error) {
        console.error('❌ Error:', error)
        process.exit(1)
    }
}

main().catch(console.error)