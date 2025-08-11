/**
 * Account and metrics-related interfaces
 */

import type { LPPosition, PerpPosition, SpotBalance } from './positions.interface'

export interface AccountData {
    success: boolean
    account?: {
        address: string
        name: string | null
        isActive: boolean
    }
    positions?: {
        lp: Array<LPPosition>
        perp: Array<PerpPosition>
        spot: Array<SpotBalance>
    }
    summary?: AccountSummary
    error?: string
}

export interface AccountSummary {
    totalLpValue: number
    totalPerpValue: number
    totalSpotValue: number
    totalValue: number
    netDelta: number
    lpDelta: number
    perpDelta: number
    spotDelta: number
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
