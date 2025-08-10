import { prismaMonitoring } from '@/lib/prisma-monitoring'
import { env } from '@/env/t3-env'
import { getViemClient, HYPEREVM_CHAIN_ID } from '@/lib/viem'
import { getAllPositionManagers, getDexByPositionManager, HYPEREVM_DEXS } from '@/config/hyperevm-dexs.config'
import { getPoolAddress, fetchPoolState } from '@/utils/uniswap-v3.util'
// import { positionFetcher } from '@/utils/position-fetcher.util' // TODO: Use this for optimized fetching
import type { Address } from 'viem'
import type { MonitoredAccount, Dex, Asset } from '@prisma/client-monitoring'
import type { DexProtocol } from '@/interfaces/dex.interface'

// Updated UnifiedPosition interface for monitor service
export interface UnifiedPosition {
    id: string
    accountId: string
    platform: 'hyperevm' | 'hypercore'
    type: 'lp' | 'perp' | 'spot'
    dex?: DexProtocol
    asset0?: string
    asset1?: string
    tokenId?: string
    valueUSD: number
    metadata: Record<string, unknown>
}

// Updated PoolInfo interface for monitor service
export interface PoolInfo {
    dex: DexProtocol
    poolAddress: Address
    token0: Address
    token1: Address
    fee: number
    liquidity: bigint
    isActive: boolean
}

// Position manager ABI (minimal)
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
        ],
        stateMutability: 'view',
        type: 'function',
    },
] as const

/**
 * Unified monitoring service for all platforms and position types
 * Handles LP, Perp, and Spot position discovery and tracking
 */
export class MonitorService {
    private poolCache: Map<string, PoolInfo> = new Map()
    private lastPoolFetch: number = 0
    private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

    // Known token addresses
    private readonly HYPE_ADDRESSES = [
        '0x0000000000000000000000000000000000000000', // Native
        '0x5555555555555555555555555555555555555555', // Wrapped
    ]
    private readonly USDT0_ADDRESS = '0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb'

    /**
     * Get or create monitored accounts
     */
    async getMonitoredAccounts(): Promise<MonitoredAccount[]> {
        // Check database first
        const accounts = await prismaMonitoring.monitoredAccount.findMany({
            where: { isActive: true },
        })

        // Fallback to environment variable if no accounts in DB
        if (accounts.length === 0 && env.MONITORED_WALLETS) {
            const addresses = env.MONITORED_WALLETS.split(',').map((addr) => addr.trim())

            for (const address of addresses) {
                const account = await prismaMonitoring.monitoredAccount.upsert({
                    where: { address },
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
     * Discover all active HYPE/USDT0 pools across DEXs
     */
    async discoverHypeUsdtPools(forceRefresh = false): Promise<PoolInfo[]> {
        // Check cache
        if (!forceRefresh && Date.now() - this.lastPoolFetch < this.CACHE_DURATION && this.poolCache.size > 0) {
            return Array.from(this.poolCache.values())
        }

        const pools: PoolInfo[] = []

        // Check each DEX
        for (const [dexKey, dexConfig] of Object.entries(HYPEREVM_DEXS)) {
            if (!dexConfig.factoryAddress) continue

            // Common fee tiers
            const feeTiers = [100, 500, 2000, 2500, 3000, 10000]

            for (const hypeAddress of this.HYPE_ADDRESSES) {
                for (const fee of feeTiers) {
                    try {
                        // Check both token orders
                        const poolAddresses = [
                            await getPoolAddress(
                                hypeAddress as Address,
                                this.USDT0_ADDRESS as Address,
                                fee,
                                dexConfig.factoryAddress,
                                HYPEREVM_CHAIN_ID,
                            ),
                            await getPoolAddress(
                                this.USDT0_ADDRESS as Address,
                                hypeAddress as Address,
                                fee,
                                dexConfig.factoryAddress,
                                HYPEREVM_CHAIN_ID,
                            ),
                        ]

                        for (const poolAddress of poolAddresses) {
                            if (poolAddress && poolAddress !== '0x0000000000000000000000000000000000000000') {
                                try {
                                    const state = await fetchPoolState(poolAddress, HYPEREVM_CHAIN_ID)

                                    if (state.liquidity > 0n) {
                                        const pool: PoolInfo = {
                                            dex: dexKey as DexProtocol,
                                            poolAddress,
                                            token0: state.token0,
                                            token1: state.token1,
                                            fee,
                                            liquidity: state.liquidity,
                                            isActive: true,
                                        }
                                        pools.push(pool)
                                    }
                                } catch {
                                    // Skip invalid pools
                                }
                            }
                        }
                    } catch {
                        // Skip on error
                    }
                }
            }
        }

        // Update cache
        this.poolCache.clear()
        pools.forEach((pool) => {
            this.poolCache.set(`${pool.dex}-${pool.poolAddress}`, pool)
        })
        this.lastPoolFetch = Date.now()

        return pools
    }

    /**
     * Fetch all LP positions for an account on HyperEVM
     */
    async fetchLPPositions(accountAddress: string, accountId: string): Promise<UnifiedPosition[]> {
        const positions: UnifiedPosition[] = []
        const client = getViemClient(HYPEREVM_CHAIN_ID)
        const positionManagers = getAllPositionManagers()

        for (const { protocol, address: pmAddress } of positionManagers) {
            try {
                // Get balance
                const balance = await client.readContract({
                    address: pmAddress as Address,
                    abi: POSITION_MANAGER_ABI,
                    functionName: 'balanceOf',
                    args: [accountAddress as Address],
                })

                if (Number(balance) === 0) continue

                // Check each position
                for (let i = 0; i < Number(balance); i++) {
                    const tokenId = await client.readContract({
                        address: pmAddress as Address,
                        abi: POSITION_MANAGER_ABI,
                        functionName: 'tokenOfOwnerByIndex',
                        args: [accountAddress as Address, BigInt(i)],
                    })

                    const positionData = await client.readContract({
                        address: pmAddress as Address,
                        abi: POSITION_MANAGER_ABI,
                        functionName: 'positions',
                        args: [tokenId],
                    })

                    const [, , token0, token1, fee, tickLower, tickUpper, liquidity] = [...positionData] as unknown as readonly [
                        bigint,
                        bigint,
                        string,
                        string,
                        bigint,
                        bigint,
                        bigint,
                        bigint,
                    ]

                    // Check if HYPE/USDT0
                    const isHypeUsdt0 = this.isHypeUsdtPair(token0, token1)
                    if (!isHypeUsdt0) continue

                    const dex = getDexByPositionManager(pmAddress) || protocol

                    // Store in database
                    await prismaMonitoring.lpPosition.upsert({
                        where: { tokenId: tokenId.toString() },
                        create: {
                            accountId,
                            tokenId: tokenId.toString(),
                            dex: dex.toUpperCase() as Dex,
                            token0Symbol: 'HYPE',
                            token1Symbol: 'USDT0',
                            feeTier: Number(fee),
                            tickLower: Number(tickLower),
                            tickUpper: Number(tickUpper),
                            liquidity: liquidity.toString(),
                            valueUSD: 0, // Will be calculated by analytics
                            inRange: true, // Will be calculated by analytics
                        },
                        update: {
                            liquidity: liquidity.toString(),
                            tickLower: Number(tickLower),
                            tickUpper: Number(tickUpper),
                        },
                    })

                    positions.push({
                        id: `lp-${tokenId}`,
                        accountId,
                        platform: 'hyperevm',
                        type: 'lp',
                        dex: dex as DexProtocol,
                        asset0: 'HYPE',
                        asset1: 'USDT0',
                        tokenId: tokenId.toString(),
                        valueUSD: 0, // Will be calculated
                        metadata: {
                            fee: Number(fee),
                            tickLower: Number(tickLower),
                            tickUpper: Number(tickUpper),
                            liquidity: liquidity.toString(),
                        },
                    })
                }
            } catch (error) {
                console.warn(`Failed to fetch positions from ${protocol}:`, error)
            }
        }

        return positions
    }

    /**
     * Fetch perp positions from HyperCore
     */
    async fetchPerpPositions(accountAddress: string, accountId: string): Promise<UnifiedPosition[]> {
        const positions: UnifiedPosition[] = []

        try {
            const response = await fetch('https://api.hyperliquid.xyz/info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'clearinghouseState',
                    user: accountAddress,
                }),
            })

            const data = await response.json()
            const assetPositions = data.assetPositions || []

            for (const pos of assetPositions) {
                const { position } = pos
                if (!position || !position.coin) continue

                const szi = parseFloat(position.szi)
                if (Math.abs(szi) < 0.00001) continue

                const entryPx = parseFloat(position.entryPx || '0')
                const markPx = parseFloat(position.markPx || '0')
                const positionValue = Math.abs(szi * markPx)
                const unrealizedPnl = parseFloat(position.unrealizedPnl || '0')
                const funding = parseFloat(position.cumFunding?.total || '0')

                // Store in database
                await prismaMonitoring.perpPosition.upsert({
                    where: {
                        accountId_asset: {
                            accountId,
                            asset: position.coin,
                        },
                    },
                    create: {
                        accountId,
                        asset: position.coin,
                        szi,
                        entryPx,
                        markPx,
                        marginUsed: 0, // TODO: Calculate margin used
                        unrealizedPnl,
                        fundingPaid: funding,
                    },
                    update: {
                        szi,
                        markPx,
                        unrealizedPnl,
                        fundingPaid: funding,
                    },
                })

                positions.push({
                    id: `perp-${position.coin}`,
                    accountId,
                    platform: 'hypercore',
                    type: 'perp',
                    asset0: position.coin,
                    valueUSD: positionValue,
                    metadata: {
                        side: szi > 0 ? 'LONG' : 'SHORT',
                        size: Math.abs(szi),
                        entryPrice: entryPx,
                        markPrice: markPx,
                        unrealizedPnl,
                        funding,
                    },
                })
            }
        } catch (error) {
            console.error('Failed to fetch perp positions:', error)
        }

        return positions
    }

    /**
     * Fetch spot balances from HyperCore
     */
    async fetchSpotBalances(accountAddress: string, accountId: string): Promise<UnifiedPosition[]> {
        const positions: UnifiedPosition[] = []

        try {
            const response = await fetch('https://api.hyperliquid.xyz/info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'spotClearinghouseState',
                    user: accountAddress,
                }),
            })

            const data = await response.json()
            const balances = data.balances || []

            for (const balance of balances) {
                const { coin, total } = balance
                const totalBalance = parseFloat(total)
                if (totalBalance <= 0) continue

                // Simple price mapping (should use proper oracle)
                const prices: Record<string, number> = {
                    HYPE: 38.5,
                    USDT0: 1.0,
                    USDC: 1.0,
                }
                const price = prices[coin] || 0
                const valueUSD = totalBalance * price

                // Store in database
                await prismaMonitoring.spotBalance.upsert({
                    where: {
                        accountId_asset: {
                            accountId,
                            asset: coin as Asset,
                        },
                    },
                    create: {
                        accountId,
                        asset: coin as Asset,
                        balance: totalBalance,
                        valueUSD,
                    },
                    update: {
                        balance: totalBalance,
                        valueUSD,
                    },
                })

                positions.push({
                    id: `spot-${coin}`,
                    accountId,
                    platform: 'hypercore',
                    type: 'spot',
                    asset0: coin,
                    valueUSD,
                    metadata: {
                        balance: totalBalance,
                        price,
                    },
                })
            }
        } catch (error) {
            console.error('Failed to fetch spot balances:', error)
        }

        return positions
    }

    /**
     * Fetch all positions for an account across all platforms
     */
    async fetchAllPositions(account: MonitoredAccount): Promise<{
        lp: UnifiedPosition[]
        perp: UnifiedPosition[]
        spot: UnifiedPosition[]
        total: number
    }> {
        const results = await Promise.all([
            account.hasHyperEvm ? this.fetchLPPositions(account.address, account.id) : Promise.resolve([]),
            account.hasHyperCore ? this.fetchPerpPositions(account.hyperCoreAddress || account.address, account.id) : Promise.resolve([]),
            account.hasHyperCore ? this.fetchSpotBalances(account.hyperCoreAddress || account.address, account.id) : Promise.resolve([]),
        ])

        return {
            lp: results[0],
            perp: results[1],
            spot: results[2],
            total: results[0].length + results[1].length + results[2].length,
        }
    }

    /**
     * Sync all monitored accounts
     */
    async syncAllAccounts(): Promise<{
        accounts: number
        lpPositions: number
        perpPositions: number
        spotBalances: number
        errors: string[]
    }> {
        const accounts = await this.getMonitoredAccounts()
        const stats = {
            accounts: accounts.length,
            lpPositions: 0,
            perpPositions: 0,
            spotBalances: 0,
            errors: [] as string[],
        }

        for (const account of accounts) {
            try {
                const positions = await this.fetchAllPositions(account)
                stats.lpPositions += positions.lp.length
                stats.perpPositions += positions.perp.length
                stats.spotBalances += positions.spot.length
            } catch (error) {
                const msg = `Failed to sync ${account.address}: ${error instanceof Error ? error.message : 'Unknown error'}`
                stats.errors.push(msg)
                console.error(msg)
            }
        }

        return stats
    }

    // Helper methods
    private isHypeUsdtPair(token0: string, token1: string): boolean {
        const t0 = token0.toLowerCase()
        const t1 = token1.toLowerCase()
        const hypeAddrs = this.HYPE_ADDRESSES.map((a) => a.toLowerCase())
        const usdt0 = this.USDT0_ADDRESS.toLowerCase()

        return (hypeAddrs.includes(t0) && t1 === usdt0) || (hypeAddrs.includes(t1) && t0 === usdt0)
    }
}

export const monitorService = new MonitorService()
