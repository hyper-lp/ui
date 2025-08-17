// Analytics service disabled - all methods return empty/null results
import type { AccountSnapshot } from '@/interfaces/account.interface'

class AnalyticsService {
    async storeSnapshot(address: string): Promise<void> {
        console.log(`Analytics disabled - not storing snapshot for ${address}`)
    }

    async fetchAndStoreSnapshot(address: string): Promise<void> {
        console.log(`Analytics disabled - not fetching/storing snapshot for ${address}`)
    }

    async getLatestSnapshot(address: string): Promise<AccountSnapshot | null> {
        console.log(`Analytics disabled - returning null for ${address}`)
        return null
    }

    async getHistoricalSnapshots(address: string): Promise<AccountSnapshot[]> {
        console.log(`Analytics disabled - returning empty array for ${address}`)
        return []
    }

    async cleanupOldSnapshots(): Promise<number> {
        console.log(`Analytics disabled - cleanup not performed`)
        return 0
    }

    async getPortfolioAnalytics(): Promise<{
        totalUsers: number
        totalSnapshots: number
        averagePortfolioValue: number
        totalPortfolioValue: number
        averageDeltaHYPE: number
        activeAddresses: string[]
    }> {
        console.log('Analytics disabled - returning empty analytics')
        return {
            totalUsers: 0,
            totalSnapshots: 0,
            averagePortfolioValue: 0,
            totalPortfolioValue: 0,
            averageDeltaHYPE: 0,
            activeAddresses: [],
        }
    }

    async getActiveAddresses(): Promise<string[]> {
        console.log('Analytics disabled - returning empty addresses')
        return []
    }

    async getAggregatedMetrics(): Promise<{ totalValue: number; totalDelta: number; averageAPR: number }> {
        console.log('Analytics disabled - returning empty aggregated metrics')
        return {
            totalValue: 0,
            totalDelta: 0,
            averageAPR: 0,
        }
    }
}

export const analyticsService = new AnalyticsService()
