import { HYPEREVM_DEXS } from '@/config/hyperevm-dexs.config'
import { getPoolAddress, fetchPoolState } from '@/utils/uniswap-v3.util'
import { HYPEREVM_CHAIN_ID } from '@/lib/viem'
import type { Address } from 'viem'
import type { DexProtocol } from '@/interfaces/dex.interface'

export interface PoolInfo {
    dex: DexProtocol
    poolAddress: Address
    token0: Address
    token1: Address
    fee: number
    feeLabel: string
    liquidity: bigint
    sqrtPriceX96: bigint
    tick: number
    isActive: boolean
}

// Token addresses on HyperEVM
const HYPE_ADDRESSES = {
    NATIVE: '0x0000000000000000000000000000000000000000' as Address,
    WRAPPED: '0x5555555555555555555555555555555555555555' as Address,
}

const USDT0_ADDRESS = '0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb' as Address

// Common fee tiers used across DEXs
const FEE_TIERS = [
    { fee: 100, label: '0.01%' },
    { fee: 500, label: '0.05%' },
    { fee: 2000, label: '0.20%' },
    { fee: 2500, label: '0.25%' },
    { fee: 3000, label: '0.30%' },
    { fee: 10000, label: '1.00%' },
]

class PoolDiscoveryService {
    private poolCache: Map<string, PoolInfo> = new Map()
    private lastFetchTime: number = 0
    private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

    /**
     * Discover all HYPE/USDT0 pools across all configured DEXs
     */
    async discoverAllHypeUsdt0Pools(forceRefresh = false): Promise<PoolInfo[]> {
        // Check cache
        if (!forceRefresh && Date.now() - this.lastFetchTime < this.CACHE_DURATION && this.poolCache.size > 0) {
            return Array.from(this.poolCache.values())
        }

        const allPools: PoolInfo[] = []

        // Check each DEX
        for (const [dexKey, dexConfig] of Object.entries(HYPEREVM_DEXS)) {
            if (!dexConfig.factoryAddress) continue

            const pools = await this.discoverPoolsForDex(dexKey as DexProtocol, dexConfig.factoryAddress)
            allPools.push(...pools)
        }

        // Update cache
        this.poolCache.clear()
        for (const pool of allPools) {
            this.poolCache.set(`${pool.dex}-${pool.poolAddress}`, pool)
        }
        this.lastFetchTime = Date.now()

        return allPools
    }

    /**
     * Discover HYPE/USDT0 pools for a specific DEX
     */
    private async discoverPoolsForDex(dex: DexProtocol, factoryAddress: Address): Promise<PoolInfo[]> {
        const pools: PoolInfo[] = []
        const errors: { pool: string; error: string }[] = []

        if (process.env.NODE_ENV === 'development') {
            console.log(`🔍 [Pool Discovery] Scanning ${dex} for HYPE/USDT0 pools...`)
        }

        // Check both HYPE addresses (native and wrapped)
        for (const [hypeType, hypeAddress] of Object.entries(HYPE_ADDRESSES)) {
            for (const { fee, label } of FEE_TIERS) {
                try {
                    // Try both token orders
                    const poolAddresses = await this.checkBothTokenOrders(hypeAddress, USDT0_ADDRESS, fee, factoryAddress)

                    for (const poolAddress of poolAddresses) {
                        if (poolAddress && poolAddress !== '0x0000000000000000000000000000000000000000') {
                            // Fetch pool state to check if active
                            try {
                                const state = await fetchPoolState(poolAddress, HYPEREVM_CHAIN_ID)

                                if (process.env.NODE_ENV === 'development' && state.liquidity > 0n) {
                                    console.log(`  ✅ Found active pool on ${dex}: ${poolAddress.slice(0, 10)}... (${hypeType}, ${label})`)
                                }

                                const poolInfo: PoolInfo = {
                                    dex,
                                    poolAddress,
                                    token0: state.token0,
                                    token1: state.token1,
                                    fee,
                                    feeLabel: label,
                                    liquidity: state.liquidity,
                                    sqrtPriceX96: state.sqrtPriceX96,
                                    tick: state.tick,
                                    isActive: state.liquidity > 0n,
                                }

                                pools.push(poolInfo)
                            } catch (stateError) {
                                // Pool exists but might not be initialized or RPC issue
                                const err = stateError as Error & { code?: string }
                                const errorMsg =
                                    err.code === 'NETWORK_ERROR'
                                        ? 'RPC connection failed'
                                        : err.code === 'CALL_EXCEPTION'
                                          ? 'Pool not initialized or invalid'
                                          : err.message || 'Unknown error'

                                errors.push({
                                    pool: `${poolAddress.slice(0, 10)}... (${label})`,
                                    error: errorMsg,
                                })

                                if (process.env.NODE_ENV === 'development') {
                                    console.warn(`  ⚠️ Failed to fetch state for pool ${poolAddress.slice(0, 10)}... on ${dex}: ${errorMsg}`)
                                }
                            }
                        }
                    }
                } catch (lookupError) {
                    // Error checking if pool exists - could be RPC issue or factory issue
                    const err = lookupError as Error & { code?: string }
                    if (err.code === 'NETWORK_ERROR' || err.code === 'SERVER_ERROR' || err.message?.includes('HTTP')) {
                        const errorMsg = `RPC error checking ${hypeType} ${label} pool: ${err.message}`
                        errors.push({ pool: `${hypeType}-${label}`, error: errorMsg })

                        if (process.env.NODE_ENV === 'development') {
                            console.error(`  ❌ ${dex}: ${errorMsg}`)
                        }
                    }
                    // Otherwise silently skip - pool doesn't exist for this combination
                }
            }
        }

        // Log summary of errors if any
        if (errors.length > 0 && process.env.NODE_ENV === 'development') {
            console.log(`  ⚠️ ${dex} discovery completed with ${errors.length} error(s):`)
            errors.slice(0, 3).forEach(({ pool, error }) => {
                console.log(`    - ${pool}: ${error}`)
            })
            if (errors.length > 3) {
                console.log(`    ... and ${errors.length - 3} more error(s)`)
            }
        }

        return pools
    }

    /**
     * Check both token orders to find pools
     */
    private async checkBothTokenOrders(token0: Address, token1: Address, fee: number, factoryAddress: Address): Promise<Address[]> {
        const pools: Address[] = []

        // Order 1: token0/token1
        const pool1 = await getPoolAddress(token0, token1, fee, factoryAddress, HYPEREVM_CHAIN_ID)
        if (pool1 && pool1 !== '0x0000000000000000000000000000000000000000') {
            pools.push(pool1)
        }

        // Order 2: token1/token0 (only if different from pool1)
        const pool2 = await getPoolAddress(token1, token0, fee, factoryAddress, HYPEREVM_CHAIN_ID)
        if (pool2 && pool2 !== '0x0000000000000000000000000000000000000000' && pool2 !== pool1) {
            pools.push(pool2)
        }

        return pools
    }

    /**
     * Get only active pools (with liquidity > 0)
     */
    async getActiveHypeUsdt0Pools(forceRefresh = false): Promise<PoolInfo[]> {
        const allPools = await this.discoverAllHypeUsdt0Pools(forceRefresh)
        return allPools.filter((pool) => pool.isActive)
    }

    /**
     * Get pools for a specific DEX
     */
    async getPoolsByDex(dex: DexProtocol, onlyActive = true): Promise<PoolInfo[]> {
        const allPools = await this.discoverAllHypeUsdt0Pools()
        const dexPools = allPools.filter((pool) => pool.dex === dex)
        return onlyActive ? dexPools.filter((pool) => pool.isActive) : dexPools
    }

    /**
     * Check if a specific pool address is a HYPE/USDT0 pool
     */
    isHypeUsdt0Pool(poolAddress: Address, poolInfo?: { token0: Address; token1: Address }): boolean {
        if (!poolInfo) {
            // Check cache
            const cached = Array.from(this.poolCache.values()).find((p) => p.poolAddress.toLowerCase() === poolAddress.toLowerCase())
            if (cached) return true
            return false
        }

        const token0Lower = poolInfo.token0.toLowerCase()
        const token1Lower = poolInfo.token1.toLowerCase()
        const hypeAddresses = Object.values(HYPE_ADDRESSES).map((a) => a.toLowerCase())
        const usdt0Lower = USDT0_ADDRESS.toLowerCase()

        return (
            (hypeAddresses.includes(token0Lower) && token1Lower === usdt0Lower) || (hypeAddresses.includes(token1Lower) && token0Lower === usdt0Lower)
        )
    }

    /**
     * Get summary statistics for discovered pools
     */
    async getPoolStatistics(): Promise<{
        totalPools: number
        activePools: number
        totalLiquidity: bigint
        byDex: Record<DexProtocol, { count: number; active: number; liquidity: bigint }>
    }> {
        const pools = await this.discoverAllHypeUsdt0Pools()

        const stats = {
            totalPools: pools.length,
            activePools: pools.filter((p) => p.isActive).length,
            totalLiquidity: 0n,
            byDex: {} as Record<DexProtocol, { count: number; active: number; liquidity: bigint }>,
        }

        for (const pool of pools) {
            stats.totalLiquidity += pool.liquidity

            if (!stats.byDex[pool.dex]) {
                stats.byDex[pool.dex] = { count: 0, active: 0, liquidity: 0n }
            }

            stats.byDex[pool.dex].count++
            if (pool.isActive) {
                stats.byDex[pool.dex].active++
                stats.byDex[pool.dex].liquidity += pool.liquidity
            }
        }

        return stats
    }
}

export const poolDiscoveryService = new PoolDiscoveryService()
