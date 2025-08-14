/**
 * Account and metrics-related interfaces
 */

import type { LPPosition, PerpPosition, SpotBalance, HyperEvmBalance } from './positions.interface'

export interface AccountData {
    success: boolean
    account?: {
        address?: string
        evmAddress?: string
        coreAddress?: string
        name: string | null
        isActive: boolean
    }
    positions?: {
        lp: Array<LPPosition>
        perp: Array<PerpPosition>
        spot: Array<SpotBalance>
        hyperEvm?: Array<HyperEvmBalance>
    }
    summary?: AccountSummary
    timings?: {
        lpFetch?: number
        perpFetch?: number
        spotFetch?: number
        evmFetch?: number
        total: number
        totalFetch?: number
    }
    error?: string
}

export interface AccountSummary {
    totalLpValue: number
    totalPerpValue: number
    totalSpotValue: number
    totalHyperEvmValue?: number
    totalValue: number
    netDelta: number
    lpDelta: number
    perpDelta: number
    spotDelta: number
    hyperEvmDelta?: number
    lastSnapshot: {
        timestamp: string
        netAPR: number
        lpFeeAPR: number
        fundingAPR: number
    } | null
    currentAPR?: {
        lpFeeAPR: number
        fundingAPR: number
        netAPR: number
        formula: string
        note: string
    }
}

export interface AccountMetrics {
    address: string
    totalValueUSD: number
    lpValueUSD: number
    perpValueUSD: number
    spotValueUSD: number
    netDelta: number
    lpDelta: number
    perpDelta: number
    spotDelta: number
    netAPR: number
    lpFeeAPR: number
    fundingAPR: number
    timestamp: Date
}

export interface PositionMetrics {
    tokenId: string
    dex: string
    valueUSD: number
    token0Amount: number
    token1Amount: number
    token0ValueUSD: number
    token1ValueUSD: number
    inRange: boolean
    feeAPR: number
    impermanentLoss: number
    timestamp: Date
}
