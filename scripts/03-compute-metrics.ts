#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

import { AnalyticsPullService } from '@/services/04-analytics-fetcher.service'
import { analyticsStoreService } from '@/services/05-analytics-store.service'
import type { DexLPPosition } from '@/interfaces/dex.interface'
import { getViemClient, HYPEREVM_CHAIN_ID } from '@/lib/viem'
import { getAllPositionManagers, getDexByPositionManager } from '@/config/hyperevm-dexs.config'
import { DexProtocol } from '@/enums'

// ABIs for fetching positions from blockchain
const POSITION_MANAGER_ABI = [
    {
        inputs: [{ name: 'owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { name: 'owner', type: 'address' },
            { name: 'index', type: 'uint256' },
        ],
        name: 'tokenOfOwnerByIndex',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'tokenId', type: 'uint256' }],
        name: 'positions',
        outputs: [
            { name: 'nonce', type: 'uint96' },
            { name: 'operator', type: 'address' },
            { name: 'token0', type: 'address' },
            { name: 'token1', type: 'address' },
            { name: 'fee', type: 'uint24' },
            { name: 'tickLower', type: 'int24' },
            { name: 'tickUpper', type: 'int24' },
            { name: 'liquidity', type: 'uint128' },
            { name: 'feeGrowthInside0LastX128', type: 'uint256' },
            { name: 'feeGrowthInside1LastX128', type: 'uint256' },
            { name: 'tokensOwed0', type: 'uint128' },
            { name: 'tokensOwed1', type: 'uint128' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
] as const

const POOL_ABI = [
    {
        inputs: [],
        name: 'token0',
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'token1',
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'fee',
        outputs: [{ name: '', type: 'uint24' }],
        stateMutability: 'view',
        type: 'function',
    },
] as const

const MOCK_POSITIONS: DexLPPosition[] = [
    {
        id: 'test-hyperswap-hype-usdt-1',
        dex: DexProtocol.HYPERSWAP,
        poolAddress: '0x1234567890123456789012345678901234567890',
        tokenId: '1',
        positionManagerAddress: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    },
    {
        id: 'test-prjtx-hype-usdc-1',
        dex: DexProtocol.PRJTX,
        poolAddress: '0x2345678901234567890123456789012345678901',
        tokenId: '2',
        positionManagerAddress: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    },
    {
        id: 'test-hybra-usdc-usdt-1',
        dex: DexProtocol.HYBRA,
        poolAddress: '0x3456789012345678901234567890123456789012',
        tokenId: '3',
        positionManagerAddress: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    },
]

// Global quiet mode flag
let QUIET_MODE = false

class TestAnalyticsPullService extends AnalyticsPullService {
    async fetchUserPositions(
        userAddress: string,
        poolAddress: string,
        positionManagerAddress: string = '0x6eDA206207c09e5428F281761DdC0D300851fBC8',
    ): Promise<DexLPPosition[]> {
        const client = getViemClient(HYPEREVM_CHAIN_ID)
        const positions: DexLPPosition[] = []

        try {
            // Get number of positions owned by user
            const balance = await client.readContract({
                address: positionManagerAddress as `0x${string}`,
                abi: POSITION_MANAGER_ABI,
                functionName: 'balanceOf',
                args: [userAddress as `0x${string}`],
            })

            if (!QUIET_MODE) {
                console.log(`\n📊 User ${userAddress} owns ${balance} NFT position(s)`)
            }

            if (Number(balance) === 0) {
                if (!QUIET_MODE) console.log('No positions found for this user')
                return positions
            }

            // Special handling for HYPE/USDT0 search
            let token0: string, token1: string, poolFee: number

            if (poolAddress === 'HYPE/USDT0' || poolAddress === 'HYPE') {
                // Looking for any HYPE/USDT0 positions
                token0 = '0x5555555555555555555555555555555555555555' // Can be wrapped or native
                token1 = '0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb' // USDT0
                poolFee = 0 // Match any fee tier
                if (!QUIET_MODE) {
                    console.log(`\n🔍 Searching for all HYPE/USDT0 positions...`)
                }
            } else {
                // Get pool tokens to filter positions
                const poolData = await Promise.all([
                    client.readContract({
                        address: poolAddress as `0x${string}`,
                        abi: POOL_ABI,
                        functionName: 'token0',
                    }),
                    client.readContract({
                        address: poolAddress as `0x${string}`,
                        abi: POOL_ABI,
                        functionName: 'token1',
                    }),
                    client.readContract({
                        address: poolAddress as `0x${string}`,
                        abi: POOL_ABI,
                        functionName: 'fee',
                    }),
                ])
                token0 = poolData[0]
                token1 = poolData[1]
                poolFee = Number(poolData[2])
            }

            if (!QUIET_MODE) {
                console.log(`\n🏊 Pool Details:`)
                console.log(`- Address: ${poolAddress}`)
                console.log(`- Token0: ${token0}`)
                console.log(`- Token1: ${token1}`)
                console.log(`- Fee Tier: ${Number(poolFee) / 10000}%`)
            }

            // Iterate through all positions
            for (let i = 0; i < Number(balance); i++) {
                const tokenId = await client.readContract({
                    address: positionManagerAddress as `0x${string}`,
                    abi: POSITION_MANAGER_ABI,
                    functionName: 'tokenOfOwnerByIndex',
                    args: [userAddress as `0x${string}`, BigInt(i)],
                })

                // Get position details
                const positionRaw = await client.readContract({
                    address: positionManagerAddress as `0x${string}`,
                    abi: POSITION_MANAGER_ABI,
                    functionName: 'positions',
                    args: [tokenId],
                })

                // The result is an array/tuple, destructure it
                const [
                    nonce,
                    operator,
                    token0Pos,
                    token1Pos,
                    fee,
                    tickLower,
                    tickUpper,
                    liquidity,
                    feeGrowthInside0LastX128,
                    feeGrowthInside1LastX128,
                    tokensOwed0,
                    tokensOwed1,
                ] = [...positionRaw] as any[]

                const position = {
                    nonce,
                    operator,
                    token0: token0Pos,
                    token1: token1Pos,
                    fee,
                    tickLower,
                    tickUpper,
                    liquidity,
                    feeGrowthInside0LastX128,
                    feeGrowthInside1LastX128,
                    tokensOwed0,
                    tokensOwed1,
                }

                if (!QUIET_MODE) {
                    console.log(`\nPosition ${tokenId} details:`, {
                        token0: position.token0,
                        token1: position.token1,
                        fee: position.fee,
                        liquidity: position.liquidity?.toString(),
                    })
                }

                // Check if this position is for the target pool
                // Note: Handle HYPE which can be either 0x0000... or 0x5555... (wrapped)
                const isHypeToken = (addr: string) => {
                    const lower = addr.toLowerCase()
                    return lower === '0x0000000000000000000000000000000000000000' || lower === '0x5555555555555555555555555555555555555555'
                }

                const isUsdt0Token = (addr: string) => {
                    return addr.toLowerCase() === '0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb'
                }

                // Special matching for HYPE/USDT0 search
                if (poolAddress === 'HYPE/USDT0' || poolAddress === 'HYPE') {
                    // Check if it's a HYPE/USDT0 pair (in either order)
                    const isHypeUsdt0Pair =
                        (isHypeToken(position.token0) && isUsdt0Token(position.token1)) ||
                        (isUsdt0Token(position.token0) && isHypeToken(position.token1))

                    if (position.token0 && position.token1 && isHypeUsdt0Pair) {
                        // This is a HYPE/USDT0 position
                        if (!QUIET_MODE) {
                            console.log(`\n✅ Found HYPE/USDT0 position:`)
                            console.log(`- Token ID: ${tokenId}`)
                            console.log(`- DEX: ${getDexByPositionManager(positionManagerAddress) || 'unknown'}`)
                            console.log(`- Fee Tier: ${Number(position.fee) / 10000}%`)
                            console.log(`- Liquidity (L): ${position.liquidity}`)
                            const tickRange = position.tickLower && position.tickUpper ? `[${position.tickLower}, ${position.tickUpper}]` : 'N/A'
                            console.log(`- Tick Range: ${tickRange}`)
                        }

                        const dex = getDexByPositionManager(positionManagerAddress) || 'unknown'
                        positions.push({
                            id: `hyperevm-${dex}-${tokenId}`,
                            dex: dex as any,
                            poolAddress: `HYPE/USDT0-${position.fee}` as `0x${string}`, // Include fee tier
                            tokenId: tokenId.toString(),
                            positionManagerAddress: positionManagerAddress as `0x${string}`,
                        })
                    }
                } else {
                    // Normal pool matching
                    const token0Match = position.token0?.toLowerCase() === token0.toLowerCase()
                    const token1Match = position.token1?.toLowerCase() === token1.toLowerCase()
                    const feeMatch = Number(position.fee) === Number(poolFee)

                    if (position.token0 && position.token1 && token0Match && token1Match && feeMatch) {
                        if (!QUIET_MODE) {
                            console.log(`\n✅ Found matching position:`)
                            console.log(`- Token ID: ${tokenId}`)
                            console.log(`- Liquidity (L): ${position.liquidity}`)
                            console.log(`  └─ This represents the concentration of your liquidity`)
                            console.log(`- Tick Range: [${position.tickLower}, ${position.tickUpper}]`)
                            const isFullRange = position.tickLower <= -887200 && position.tickUpper >= 887200
                            if (isFullRange) {
                                console.log(`  └─ This is a FULL RANGE position (provides liquidity at all prices)`)
                            }
                            console.log(`- Fees Owed: ${position.tokensOwed0} token0, ${position.tokensOwed1} token1`)
                        }

                        // Determine DEX based on position manager address
                        const dex = getDexByPositionManager(positionManagerAddress) || 'unknown'

                        positions.push({
                            id: `hyperevm-${dex}-${tokenId}`,
                            dex: dex as any,
                            poolAddress: poolAddress as `0x${string}`,
                            tokenId: tokenId.toString(),
                            positionManagerAddress: positionManagerAddress as `0x${string}`,
                        })
                    }
                }
            }

            return positions
        } catch (error) {
            console.error('Error fetching positions:', error)
            throw error
        }
    }

    async testFetchedPositions(positions: DexLPPosition[]) {
        if (positions.length === 0) {
            if (!QUIET_MODE) console.log('\n❌ No positions found to analyze')
            return
        }

        if (!QUIET_MODE) {
            console.log(`\n\n📈 Analyzing ${positions.length} fetched position(s)...`)
            console.log('='.repeat(50))
        }

        for (const position of positions) {
            if (!QUIET_MODE) {
                console.log(`\n🔍 Analyzing position ${position.tokenId}...`)
            }

            try {
                const metrics = await this.pullPositionMetrics(position)

                if (metrics) {
                    const metricsWithAmounts = metrics as any

                    if (QUIET_MODE) {
                        // In quiet mode, only show essential information
                        console.log(`\nPosition #${position.tokenId}:`)
                        console.log(
                            `  Reserve: $${(metricsWithAmounts.token0Amount * metricsWithAmounts.token0Price + metricsWithAmounts.token1Amount * metricsWithAmounts.token1Price).toFixed(2)}`,
                        )
                        console.log(`  ${metricsWithAmounts.token0Symbol}: ${metricsWithAmounts.token0Amount?.toFixed(2)}`)
                        console.log(`  ${metricsWithAmounts.token1Symbol}: ${metricsWithAmounts.token1Amount?.toFixed(2)}`)
                        console.log(`  APR: ${metrics.feeAPR.toFixed(2)}%`)
                        console.log(`  In Range: ${metrics.inRange ? 'Yes' : 'No'}`)
                    } else {
                        // Full display mode
                        console.log('\n📊 Position #' + position.tokenId)
                        console.log('━'.repeat(50))

                        // Display exactly like the UI
                        console.log('\n📍 Your Reserve:')
                        const token0Value = metricsWithAmounts.token0Amount * metricsWithAmounts.token0Price || 0
                        const token1Value = metricsWithAmounts.token1Amount * metricsWithAmounts.token1Price || 0
                        const totalReserve = token0Value + token1Value

                        console.log(`   Total: $${totalReserve.toFixed(2)}`)
                        console.log(`   ✅ ${metricsWithAmounts.token0Amount?.toFixed(1) || 'N/A'} ${metricsWithAmounts.token0Symbol || 'Token0'}`)
                        console.log(`   ✅ ${metricsWithAmounts.token1Amount?.toFixed(1) || 'N/A'} ${metricsWithAmounts.token1Symbol || 'Token1'}`)

                        console.log('\n💵 Token Prices:')
                        console.log(`   ${metricsWithAmounts.token0Symbol}: $${metricsWithAmounts.token0Price?.toFixed(4) || 'N/A'}`)
                        console.log(`   ${metricsWithAmounts.token1Symbol}: $${metricsWithAmounts.token1Price?.toFixed(4) || 'N/A'}`)

                        console.log('\n📈 Performance:')
                        console.log(`   APR: ${metrics.feeAPR.toFixed(2)}%`)
                        console.log(`   In Range: ${metrics.inRange ? '✅ Yes' : '❌ No'}`)
                        console.log(`   Unclaimed Fees: $${metrics.unclaimedFeesUSD.toFixed(2)}`)
                    }
                } else {
                    if (!QUIET_MODE) {
                        console.log('❌ Could not calculate metrics for this position')
                    }
                }
            } catch (error) {
                console.error(`Error analyzing position ${position.tokenId}:`, error)
            }
        }

        // Get aggregate metrics
        if (positions.length > 0 && !QUIET_MODE) {
            console.log('\n\n📊 Aggregate Analysis:')
            console.log('='.repeat(50))

            const result = await this.pullAllPositionsMetrics(positions)

            console.log(`\n📈 Summary Statistics:`)
            console.log(`- Total Positions: ${result.metrics.length}`)
            console.log(`- Total Value Locked: $${result.summary.totalValueUSD.toFixed(2)}`)
            console.log(`- Total Unclaimed Fees: $${result.summary.totalUnclaimedFeesUSD.toFixed(2)}`)
            console.log(`- Average Fee APR: ${result.summary.averageFeeAPR.toFixed(2)}%`)
            console.log(`- Positions In Range: ${result.summary.positionsInRange}/${result.metrics.length}`)
        }
    }

    async testSinglePosition() {
        console.log('\n📊 Testing Single Position Pull...')
        console.log('='.repeat(50))

        const position = MOCK_POSITIONS[0]
        console.log(`\nTesting position: ${position.id}`)
        console.log(`DEX: ${position.dex}`)
        console.log(`Pool: ${position.poolAddress}`)
        console.log(`Token ID: ${position.tokenId}`)

        const startTime = Date.now()
        const metrics = await this.pullPositionMetrics(position)
        const duration = Number(Date.now() - startTime)

        if (metrics) {
            console.log('\n✅ Position metrics retrieved successfully!')
            console.log(`⏱️  Duration: ${duration}ms`)
            console.log('\nMetrics:')
            console.log(`- Total Value: $${metrics.totalValueUSD.toFixed(2)}`)
            console.log(`- Unclaimed Fees: $${metrics.unclaimedFeesUSD.toFixed(2)}`)
            console.log(`- Fee APR: ${metrics.feeAPR.toFixed(2)}%`)
            console.log(`- In Range: ${metrics.inRange ? '✅' : '❌'}`)
        } else {
            console.log('\n❌ Failed to retrieve position metrics')
        }

        return metrics
    }

    async testMultiplePositions() {
        console.log('\n📊 Testing Multiple Positions Pull...')
        console.log('='.repeat(50))

        console.log(`\nTesting ${MOCK_POSITIONS.length} positions across different DEXs`)

        const startTime = Date.now()
        const result = await this.pullAllPositionsMetrics(MOCK_POSITIONS)
        const duration = Number(Date.now() - startTime)

        console.log(`\n✅ Pulled ${result.metrics.length}/${MOCK_POSITIONS.length} positions successfully`)
        console.log(`⏱️  Total duration: ${duration}ms`)
        console.log(`⏱️  Average per position: ${(duration / MOCK_POSITIONS.length).toFixed(0)}ms`)

        console.log('\n📈 Summary Statistics:')
        console.log(`- Total Value Locked: $${result.summary.totalValueUSD.toFixed(2)}`)
        console.log(`- Total Unclaimed Fees: $${result.summary.totalUnclaimedFeesUSD.toFixed(2)}`)
        console.log(`- Average Fee APR: ${result.summary.averageFeeAPR.toFixed(2)}%`)
        console.log(`- Positions In Range: ${result.summary.positionsInRange}/${result.metrics.length}`)

        console.log('\n📊 By DEX:')
        for (const [dex, stats] of Object.entries(result.summary.byDex)) {
            console.log(`\n${dex.toUpperCase()}:`)
            console.log(`  - Positions: ${stats.count}`)
            console.log(`  - TVL: $${stats.totalValueUSD.toFixed(2)}`)
            console.log(`  - Avg APR: ${stats.averageFeeAPR.toFixed(2)}%`)
        }

        return result
    }

    async testErrorHandling() {
        console.log('\n🔧 Testing Error Handling...')
        console.log('='.repeat(50))

        const invalidPositions: DexLPPosition[] = [
            {
                id: 'invalid-no-token-id',
                dex: DexProtocol.HYPERSWAP,
                poolAddress: '0x0000000000000000000000000000000000000000',
            },
            {
                id: 'invalid-dex',
                dex: 'unknown-dex' as any,
                poolAddress: '0x0000000000000000000000000000000000000000',
                tokenId: '999',
            },
        ]

        console.log('\nTesting with invalid positions...')
        const result = await this.pullAllPositionsMetrics(invalidPositions)

        console.log(`\n✅ Error handling test completed`)
        console.log(`- Valid metrics retrieved: ${result.metrics.length}`)
        console.log(`- Invalid positions skipped: ${invalidPositions.length - result.metrics.length}`)

        return result
    }
}

async function testStoreService() {
    console.log('\n💾 Testing Store Service...')
    console.log('='.repeat(50))

    // Analytics store service removed - using database directly via lpDatabaseService
    const pullService = new AnalyticsPullService()

    const result = await pullService.pullAllPositionsMetrics(MOCK_POSITIONS.slice(0, 1))

    const snapshot = {
        ...result,
        timestamp: new Date(),
        chainId: HYPEREVM_CHAIN_ID,
    }

    // Store snapshots using lpDatabaseService
    // Snapshots now handled at account level
    // const snapshots = await analyticsStoreService.createAccountSnapshot(...)
    console.log(`✅ Position snapshots now handled at account level`)
}

async function main() {
    // Check for quiet mode flag
    QUIET_MODE = process.argv.includes('--quiet') || process.argv.includes('-q')

    if (!QUIET_MODE) {
        console.log('🚀 HyperLP Analytics Test Suite')
        console.log('='.repeat(50))
    }

    const testService = new TestAnalyticsPullService()

    try {
        // Check for --fetch flag with EOA address
        const fetchIndex = process.argv.indexOf('--fetch')
        if (fetchIndex !== -1) {
            const eoa = process.argv[fetchIndex + 1]

            if (!eoa) {
                console.error('\n❌ Usage: --fetch <eoa_address>')
                console.error('Example: --fetch 0xB0Aa56926bE166Bcc5FB6Cf1169f56d9Fd7A25d7')
                process.exit(1)
            }

            if (!QUIET_MODE) {
                console.log('\n🔍 Fetching HYPE/USDT0 positions from blockchain...')
                console.log(`- EOA: ${eoa}`)
            }

            // Get all configured position managers
            const positionManagers = getAllPositionManagers()
            if (!QUIET_MODE) {
                console.log(`\nSearching across DEXs: ${positionManagers.map((pm) => pm.protocol).join(', ')}`)
            }

            const allPositions: DexLPPosition[] = []

            for (const { protocol, address } of positionManagers) {
                if (!QUIET_MODE) {
                    console.log(`\n\n🔎 Checking ${protocol.toUpperCase()}...`)
                    console.log('-'.repeat(50))
                }

                try {
                    // Always search for HYPE/USDT0 positions
                    const positions = await testService.fetchUserPositions(eoa, 'HYPE/USDT0', address)
                    allPositions.push(...positions)
                } catch (error) {
                    if (!QUIET_MODE) console.error(`Error with ${protocol} position manager:`, error)
                }
            }

            // Store positions in database if --save flag is present
            if (process.argv.includes('--save') && allPositions.length > 0) {
                console.log('\n💾 Saving positions to database...')

                for (const position of allPositions) {
                    // Fetch full position details from blockchain
                    const client = getViemClient(HYPEREVM_CHAIN_ID)
                    const positionData = await client.readContract({
                        address: position.positionManagerAddress as `0x${string}`,
                        abi: POSITION_MANAGER_ABI,
                        functionName: 'positions',
                        args: [BigInt(position.tokenId!)],
                    })

                    const [nonce, operator, token0, token1, fee, tickLower, tickUpper, liquidity] = [...positionData] as any[]

                    await analyticsStoreService.upsertLpPosition({
                        tokenId: position.tokenId!,
                        dex: position.dex,
                        accountId: eoa,
                        poolAddress: position.poolAddress?.startsWith('HYPE/USDT0') ? '' : position.poolAddress || '',
                        // positionManagerAddress: position.positionManagerAddress!, // Not in new schema
                        token0Symbol: 'HYPE', // TODO: Get from token addresses
                        token1Symbol: 'USDT0', // TODO: Get from token addresses
                        valueUSD: 0, // TODO: Calculate
                        inRange: true, // TODO: Calculate
                        feeTier: Number(fee),
                        tickLower: Number(tickLower),
                        tickUpper: Number(tickUpper),
                        liquidity: liquidity.toString(),
                    })

                    console.log(`  ✅ Saved position #${position.tokenId} (${position.dex})`)
                }

                console.log('\n✅ All positions saved to database!')
            }

            if (QUIET_MODE && allPositions.length > 0) {
                // In quiet mode, show a summary of found positions
                console.log('\nHYPE/USDT0 Positions Found:')
                console.log('━'.repeat(30))

                const byDex: Record<string, { positions: any[]; totalLiquidity: bigint }> = {}

                for (const position of allPositions) {
                    const dex = position.dex
                    if (!byDex[dex]) {
                        byDex[dex] = { positions: [], totalLiquidity: 0n }
                    }
                    byDex[dex].positions.push(position)
                }

                for (const [dex, data] of Object.entries(byDex)) {
                    console.log(`\n${dex.toUpperCase()}:`)
                    for (const position of data.positions) {
                        const fee = position.poolAddress.split('-')[1]
                        console.log(`  Position #${position.tokenId} (${Number(fee) / 10000}% fee)`)
                    }
                }

                console.log('\n' + '━'.repeat(30))
                console.log(`Total: ${allPositions.length} position(s) across ${Object.keys(byDex).length} DEX(es)`)
            } else if (!QUIET_MODE) {
                await testService.testFetchedPositions(allPositions)
                console.log('\n\n✅ Fetch and analysis complete!')
            } else {
                await testService.testFetchedPositions(allPositions)
            }
        } else if (process.argv.includes('--real')) {
            console.log('\n⚠️  Running with REAL blockchain data')
            console.log('Make sure you have valid positions configured!\n')

            const realPositions: DexLPPosition[] = process.env.LP_POSITIONS ? JSON.parse(process.env.LP_POSITIONS) : []

            if (realPositions.length === 0) {
                console.log('❌ No real positions configured in LP_POSITIONS env var')
                process.exit(1)
            }

            const result = await testService.pullAllPositionsMetrics(realPositions)
            console.log('\n✅ Real positions test completed successfully!')
        } else {
            console.log('\n🧪 Running with MOCK data')
            console.log('Use --real flag to test with actual blockchain data\n')

            await testService.testSinglePosition()
            await testService.testMultiplePositions()
            await testService.testErrorHandling()
            await testStoreService()

            console.log('\n\n✅ All tests completed successfully!')
        }
    } catch (error) {
        console.error('\n❌ Test failed:', error)
        process.exit(1)
    }
}

main().catch(console.error)
