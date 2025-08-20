export interface RebalanceMetadata {
    // Rebalance trigger information
    trigger: 'manual' | 'auto' | 'scheduled'
    triggerReason?: string

    // Position changes
    oldPosition: {
        lowerTick: number
        upperTick: number
        liquidity: string
        token0Amount: string
        token1Amount: string
    }
    newPosition: {
        lowerTick: number
        upperTick: number
        liquidity: string
        token0Amount: string
        token1Amount: string
    }

    // Hedge adjustments
    hedgeAdjustment: {
        perpSizeChange: string
        perpDirection: 'long' | 'short'
        fundingRate: number
    }

    // Transaction details
    transactions: {
        txHash: string
        type: 'removeLiquidity' | 'addLiquidity' | 'adjustHedge' | 'swap'
        gasUsed?: string
        gasPrice?: string
        status: 'pending' | 'success' | 'failed'
    }[]

    // Performance metrics
    metrics: {
        deltaDriftBefore: number
        deltaDriftAfter: number
        rebalanceCost: number
        slippage: number
        priceImpact: number
    }

    // Market conditions at rebalance
    marketConditions: {
        hypePrice: number
        usdtPrice: number
        poolTvl: number
        poolVolume24h: number
        gasPrice: string
    }
}

export interface RebalanceEvent {
    id: string
    vaultId: string
    timestamp: Date
    status: 'pending' | 'executed' | 'failed' | 'cancelled'
    poolAddress: string
    vaultAddress: string
    metadata: RebalanceMetadata
    createdAt: Date
    updatedAt: Date
}

export interface Vault {
    id: string
    name: string
    symbol: string
    address: string
    poolAddress: string
    metadata: Record<string, unknown>
    createdAt: Date
    updatedAt: Date
    rebalances?: RebalanceEvent[]
}

export interface RebalanceQueryParams {
    vaultAddress?: string
    status?: 'pending' | 'executed' | 'failed' | 'cancelled'
    startDate?: Date | string
    endDate?: Date | string
    limit?: number
    offset?: number
    orderBy?: 'timestamp' | 'createdAt'
    order?: 'asc' | 'desc'
}

export interface RebalanceResponse {
    success: boolean
    data?: RebalanceEvent[]
    pagination?: {
        total: number
        limit: number
        offset: number
        hasMore: boolean
    }
    error?: string
}
