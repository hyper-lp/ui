/**
 * Position-related interfaces for LP, Spot, and Perp positions
 */

export interface LPPosition {
    id: string
    tokenId: string
    dex: string
    token0: string
    token1: string
    token0Symbol: string
    token1Symbol: string
    fee?: number
    tickLower?: number
    tickUpper?: number
    liquidity: string | number
    inRange: boolean
    valueUSD: number
    token0Amount?: number
    token1Amount?: number
    token0ValueUSD?: number
    token1ValueUSD?: number
    feeTier?: string | null
}

export interface SpotBalance {
    id: string
    asset: string
    balance: string | number
    valueUSD: number
}

export interface PerpPosition {
    id: string
    asset: string
    size: number
    entryPrice: number
    markPrice: number
    marginUsed: number
    unrealizedPnl: number
    fundingPaid: number
    notionalValue: number
}

export interface PoolState {
    sqrtPriceX96: bigint
    tick: number
    liquidity: bigint
}

export interface PoolInfo {
    id: string
    address: string
    token0: string
    token1: string
    fee: number
    liquidity: bigint
    sqrtPriceX96: bigint
    tick: number
    tvlUSD?: number
}

export interface UnifiedPosition {
    id: string
    type: 'lp' | 'spot' | 'perp'
    protocol: string
    asset0?: string
    asset1?: string
    amount0?: number
    amount1?: number
    valueUSD: number
    delta?: number
    metadata?: Record<string, unknown>
}
