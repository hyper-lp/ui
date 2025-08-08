import type { LPMetrics, LPPosition } from './dex.interface'

export interface AnalyticsSummary {
    totalValueUSD: number
    totalUnclaimedFeesUSD: number
    averageFeeAPR: number
    positionsInRange: number
    byDex: Record<string, DexSummary>
}

export interface DexSummary {
    count: number
    totalValueUSD: number
    averageFeeAPR: number
}

export interface AnalyticsResult {
    metrics: LPMetrics[]
    summary: AnalyticsSummary
}

export interface AnalyticsSnapshot extends AnalyticsResult {
    id?: string
    timestamp: Date
    chainId: number
}

export interface IAnalyticsPullService {
    pullPositionMetrics(position: LPPosition): Promise<LPMetrics | null>
    pullAllPositionsMetrics(positions: LPPosition[]): Promise<AnalyticsResult>
}

export interface IAnalyticsStoreService {
    saveSnapshot(snapshot: AnalyticsSnapshot): Promise<void>
    getLatestSnapshot(): Promise<AnalyticsSnapshot | null>
    getSnapshotsByDateRange(startDate: Date, endDate: Date): Promise<AnalyticsSnapshot[]>
    deleteOldSnapshots(daysToKeep: number): Promise<number>
}
