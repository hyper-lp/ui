import { prismaMonitoring } from '@/lib/prisma-monitoring'
import { env } from '@/env/t3-env'
import { getViemClient, HYPEREVM_CHAIN_ID } from '@/lib/viem'
import { getAllPositionManagers, getDexByPositionManager } from '@/config/hyperevm-dexs.config'
import { analyticsPullService } from './04-analytics-fetcher.service'
import { analyticsStoreService } from './05-analytics-store.service'
import { poolDiscoveryService } from './01-pool-discovery.service'
import type { LPPosition } from '@/interfaces/dex.interface'
import type { MonitoredAccount } from '@prisma/client-monitoring'
import { DexProtocol } from '@/enums'

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

export class LPMonitorService {
    private readonly chainId = HYPEREVM_CHAIN_ID // HyperEVM

    /**
     * Get or create monitored accounts from environment or database
     */
    async getMonitoredAccounts(): Promise<MonitoredAccount[]> {
        // First check database for accounts
        const accounts = await prismaMonitoring.monitoredAccount.findMany({
            where: { isActive: true },
        })

        // If no accounts in DB, check environment variable
        if (accounts.length === 0 && env.MONITORED_WALLETS) {
            const addresses = env.MONITORED_WALLETS.split(',').map((addr) => addr.trim())

            // Create accounts in database
            for (const address of addresses) {
                const account = await prismaMonitoring.monitoredAccount.upsert({
                    where: {
                        address,
                    },
                    update: { isActive: true },
                    create: {
                        address,
                        name: `Account ${address.slice(0, 6)}...${address.slice(-4)}`,
                        isActive: true,
                    },
                })
                accounts.push(account)
            }
        }

        return accounts
    }

    /**
     * Fetch all HYPE/USDT0 positions for an account across all DEXs
     * Enhanced version using pool discovery
     */
    async fetchHypeUsdtPositionsForAccount(accountAddress: string, accountId?: string): Promise<LPPosition[]> {
        const allPositions: LPPosition[] = []
        const positionManagers = getAllPositionManagers()
        const client = getViemClient(this.chainId)

        const hypeAddresses = [
            '0x0000000000000000000000000000000000000000', // Native HYPE
            '0x5555555555555555555555555555555555555555', // Wrapped HYPE
        ]
        const usdt0Address = '0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb'

        for (const { protocol, address: positionManagerAddress } of positionManagers) {
            try {
                // Get number of positions owned by user
                const balance = await client.readContract({
                    address: positionManagerAddress as `0x${string}`,
                    abi: POSITION_MANAGER_ABI,
                    functionName: 'balanceOf',
                    args: [accountAddress as `0x${string}`],
                })

                if (Number(balance) === 0) continue

                // Check each position
                for (let i = 0; i < Number(balance); i++) {
                    const tokenId = await client.readContract({
                        address: positionManagerAddress as `0x${string}`,
                        abi: POSITION_MANAGER_ABI,
                        functionName: 'tokenOfOwnerByIndex',
                        args: [accountAddress as `0x${string}`, BigInt(i)],
                    })

                    // Get position details
                    const positionData = await client.readContract({
                        address: positionManagerAddress as `0x${string}`,
                        abi: POSITION_MANAGER_ABI,
                        functionName: 'positions',
                        args: [tokenId],
                    })

                    const positionArray = [...positionData] as unknown as readonly [
                        bigint, // nonce
                        string, // operator
                        string, // token0
                        string, // token1
                        bigint, // fee
                        bigint, // tickLower
                        bigint, // tickUpper
                        bigint, // liquidity
                    ]

                    const [
                        ,
                        ,
                        // nonce - unused
                        // operator - unused
                        token0,
                        token1,
                        fee,
                        tickLower,
                        tickUpper,
                        liquidity,
                    ] = positionArray

                    // Check if it's a HYPE/USDT0 pair
                    const isHypeUsdt0 =
                        (hypeAddresses.includes(token0.toLowerCase()) && token1.toLowerCase() === usdt0Address) ||
                        (hypeAddresses.includes(token1.toLowerCase()) && token0.toLowerCase() === usdt0Address)

                    if (isHypeUsdt0) {
                        const dex = getDexByPositionManager(positionManagerAddress) || protocol

                        allPositions.push({
                            id: `${dex}-${tokenId}`,
                            dex: dex as DexProtocol,
                            poolAddress: `HYPE/USDT0-${fee}` as `0x${string}`,
                            tokenId: tokenId.toString(),
                            positionManagerAddress: positionManagerAddress as `0x${string}`,
                        })

                        // Store in database
                        // Generate a temporary accountId if not provided (for positions discovered without an account)
                        const effectiveAccountId = accountId || `temp-${accountAddress}`
                        await analyticsStoreService.upsertLpPosition({
                            tokenId: tokenId.toString(),
                            dex,
                            accountId: effectiveAccountId,
                            poolAddress: '', // Pool address not available for HYPE/USDT0 positions
                            token0Symbol: 'HYPE', // TODO: Determine from token addresses
                            token1Symbol: 'USDT0', // TODO: Determine from token addresses
                            feeTier: Number(fee),
                            tickLower: Number(tickLower),
                            tickUpper: Number(tickUpper),
                            liquidity: liquidity.toString(),
                            valueUSD: 0, // TODO: Calculate actual value
                            inRange: true, // TODO: Calculate if in range
                        })
                    }
                }
            } catch (error) {
                // Enhanced error logging with context
                const err = error as Error & {
                    shortMessage?: string
                    cause?: unknown
                    code?: string
                    details?: string
                }

                let errorMessage = err.shortMessage || err.message || 'Unknown error'

                // Add more context based on error type
                if (err.code === 'CALL_EXCEPTION') {
                    errorMessage = `Contract call failed: ${errorMessage}`
                } else if (err.code === 'NETWORK_ERROR' || err.code === 'SERVER_ERROR') {
                    errorMessage = `RPC connection error: ${errorMessage}`
                } else if (err.code === 'TIMEOUT') {
                    errorMessage = `Request timeout: ${errorMessage}`
                } else if (errorMessage.includes('HTTP request failed')) {
                    // This is likely an RPC issue
                    errorMessage = `RPC request failed - check if HyperEVM RPC is accessible`
                }

                console.warn(`⚠️ ${protocol} position fetch failed:`, {
                    account: accountAddress.slice(0, 10) + '...',
                    positionManager: positionManagerAddress,
                    error: errorMessage,
                    errorCode: err.code,
                    ...(process.env.NODE_ENV === 'development' && {
                        details: err.details,
                        cause: err.cause,
                    }),
                })
            }
        }

        return allPositions
    }

    /**
     * Fetch and store positions for all monitored accounts
     */
    async fetchAllMonitoredPositions(): Promise<{
        accounts: number
        totalPositions: number
        byAccount: Record<string, number>
    }> {
        const accounts = await this.getMonitoredAccounts()
        const byAccount: Record<string, number> = {}
        let totalPositions = 0

        for (const account of accounts) {
            // Fetching positions for account

            const positions = await this.fetchHypeUsdtPositionsForAccount(account.address, account.id)
            byAccount[account.address] = positions.length
            totalPositions += positions.length

            // Positions are already linked via accountId during creation
        }

        return {
            accounts: accounts.length,
            totalPositions,
            byAccount,
        }
    }

    /**
     * Calculate impermanent loss for a position
     */
    calculateImpermanentLoss(
        initialToken0: number,
        initialToken1: number,
        currentToken0: number,
        currentToken1: number,
        token0Price: number,
        token1Price: number,
    ): { ilUSD: number; ilPercent: number } {
        // Current value
        const currentValue = currentToken0 * token0Price + currentToken1 * token1Price

        // HODL value (if we just held the initial tokens)
        const hodlValue = initialToken0 * token0Price + initialToken1 * token1Price

        // IL calculation
        const ilUSD = currentValue - hodlValue
        const ilPercent = (ilUSD / hodlValue) * 100

        return { ilUSD, ilPercent }
    }

    /**
     * Calculate delta exposure for LP position
     */
    calculateDeltaExposure(token0Amount: number, token1Amount: number, token0Price: number, isToken0Volatile: boolean): number {
        if (isToken0Volatile) {
            // Delta is the value of volatile token in USD
            return token0Amount * token0Price
        } else {
            // If token1 is volatile (shouldn't happen for HYPE/USDT0)
            return token1Amount // token1Price should be 1 for USDT0
        }
    }

    /**
     * Enhanced position discovery using pool discovery service
     * More efficient - only checks active pools and relevant positions
     */
    async discoverPositionsForAccount(
        accountAddress: string,
        accountId?: string,
    ): Promise<{
        positions: LPPosition[]
        poolsChecked: number
        positionsFound: number
    }> {
        const client = getViemClient(this.chainId)
        const allPositions: LPPosition[] = []

        if (process.env.NODE_ENV === 'development') {
            console.log(`\n🔎 [LP Monitor] Discovering positions for account ${accountAddress.slice(0, 10)}...`)
        }

        // Get all active HYPE/USDT0 pools
        const activePools = await poolDiscoveryService.getActiveHypeUsdt0Pools()

        if (process.env.NODE_ENV === 'development') {
            console.log(`  📊 Found ${activePools.length} active HYPE/USDT0 pools to check`)
        }

        // Get all position managers
        const positionManagers = getAllPositionManagers()

        for (const { protocol, address: positionManagerAddress } of positionManagers) {
            try {
                // Get number of positions owned by user
                const balance = await client.readContract({
                    address: positionManagerAddress as `0x${string}`,
                    abi: POSITION_MANAGER_ABI,
                    functionName: 'balanceOf',
                    args: [accountAddress as `0x${string}`],
                })

                if (Number(balance) === 0) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`  ❌ No positions on ${protocol}`)
                    }
                    continue
                }

                if (process.env.NODE_ENV === 'development') {
                    console.log(`  🎯 Found ${balance} position(s) on ${protocol}`)
                }

                // Check each position
                for (let i = 0; i < Number(balance); i++) {
                    const tokenId = await client.readContract({
                        address: positionManagerAddress as `0x${string}`,
                        abi: POSITION_MANAGER_ABI,
                        functionName: 'tokenOfOwnerByIndex',
                        args: [accountAddress as `0x${string}`, BigInt(i)],
                    })

                    // Get position details
                    const positionData = await client.readContract({
                        address: positionManagerAddress as `0x${string}`,
                        abi: POSITION_MANAGER_ABI,
                        functionName: 'positions',
                        args: [tokenId],
                    })

                    const [, , token0, token1, fee, tickLower, tickUpper, liquidity] = [...positionData] as unknown as readonly [
                        bigint,
                        string,
                        string,
                        string,
                        bigint,
                        bigint,
                        bigint,
                        bigint,
                    ]

                    // Check if this is a HYPE/USDT0 position using pool discovery
                    const isHypeUsdt0 = poolDiscoveryService.isHypeUsdt0Pool(
                        '' as `0x${string}`, // We don't have pool address yet
                        { token0: token0 as `0x${string}`, token1: token1 as `0x${string}` },
                    )

                    if (isHypeUsdt0) {
                        const dex = getDexByPositionManager(positionManagerAddress) || protocol

                        // Find the actual pool from discovered pools
                        const matchingPool = activePools.find(
                            (p) =>
                                p.dex === dex &&
                                p.fee === Number(fee) &&
                                ((p.token0.toLowerCase() === token0.toLowerCase() && p.token1.toLowerCase() === token1.toLowerCase()) ||
                                    (p.token0.toLowerCase() === token1.toLowerCase() && p.token1.toLowerCase() === token0.toLowerCase())),
                        )

                        const position: LPPosition = {
                            id: `${dex}-${tokenId}`,
                            dex: dex as DexProtocol,
                            poolAddress: matchingPool?.poolAddress || (`HYPE/USDT0-${fee}` as `0x${string}`),
                            tokenId: tokenId.toString(),
                            positionManagerAddress: positionManagerAddress as `0x${string}`,
                        }

                        allPositions.push(position)

                        // Store in database with enhanced data
                        // Generate a temporary accountId if not provided (for positions discovered without an account)
                        const effectiveAccountId = accountId || `temp-${accountAddress}`
                        await analyticsStoreService.upsertLpPosition({
                            tokenId: tokenId.toString(),
                            dex,
                            accountId: effectiveAccountId,
                            poolAddress: matchingPool?.poolAddress || '',
                            token0Symbol: 'HYPE', // TODO: Determine from token addresses
                            token1Symbol: 'USDT0', // TODO: Determine from token addresses
                            feeTier: Number(fee),
                            tickLower: Number(tickLower),
                            tickUpper: Number(tickUpper),
                            liquidity: liquidity.toString(),
                            valueUSD: 0, // TODO: Calculate actual value
                            inRange: true, // TODO: Calculate if in range
                        })
                    }
                }
            } catch (error) {
                // Enhanced error logging with context
                const err = error as Error & {
                    shortMessage?: string
                    cause?: unknown
                    code?: string
                    details?: string
                }

                let errorMessage = err.shortMessage || err.message || 'Unknown error'

                // Add more context based on error type
                if (err.code === 'CALL_EXCEPTION') {
                    errorMessage = `Contract call failed: ${errorMessage}`
                } else if (err.code === 'NETWORK_ERROR' || err.code === 'SERVER_ERROR') {
                    errorMessage = `RPC connection error: ${errorMessage}`
                } else if (err.code === 'TIMEOUT') {
                    errorMessage = `Request timeout: ${errorMessage}`
                } else if (errorMessage.includes('HTTP request failed')) {
                    // This is likely an RPC issue
                    errorMessage = `RPC request failed - check if HyperEVM RPC is accessible`
                }

                console.warn(`⚠️ ${protocol} position fetch failed:`, {
                    account: accountAddress.slice(0, 10) + '...',
                    positionManager: positionManagerAddress,
                    error: errorMessage,
                    errorCode: err.code,
                    ...(process.env.NODE_ENV === 'development' && {
                        details: err.details,
                        cause: err.cause,
                    }),
                })
            }
        }

        return {
            positions: allPositions,
            poolsChecked: activePools.length,
            positionsFound: allPositions.length,
        }
    }

    /**
     * Fetch and analyze all positions with metrics
     */
    async analyzeAllPositions(): Promise<{
        positions: number
        metrics: unknown[]
        summary: unknown
        accounts: number
    }> {
        const positions = await prismaMonitoring.lpPosition.findMany({
            where: {
                // Filter for HYPE/USDT0 pairs
                OR: [
                    {
                        token0Symbol: 'HYPE',
                        token1Symbol: { in: ['USDT0', 'USDT'] },
                    },
                    {
                        token0Symbol: { in: ['USDT0', 'USDT'] },
                        token1Symbol: 'HYPE',
                    },
                ],
            },
        })

        const lpPositions: LPPosition[] = positions.map((p) => ({
            id: p.id,
            dex: p.dex as DexProtocol,
            poolAddress: p.poolAddress as `0x${string}`,
            tokenId: p.tokenId,
            positionManagerAddress: '' as `0x${string}`, // Not stored in new schema
        }))

        // Pull metrics for all positions
        const result = await analyticsPullService.pullAllPositionsMetrics(lpPositions)

        return {
            positions: positions.length,
            metrics: result.metrics,
            summary: result.summary,
            accounts: [...new Set(positions.map((p) => p.accountId))].length,
        }
    }
}

export const lpMonitorService = new LPMonitorService()
