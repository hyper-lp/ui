import type { AccountSnapshot } from '@/interfaces/account.interface'
import { env } from '@/env/t3-env'

/**
 * Simple analytics service for fetching and storing account snapshots
 */
class AnalyticsService {
    /**
     * Fetch snapshot from API and store in database
     */
    async fetchAndStoreSnapshot(address: string): Promise<void> {
        const baseUrl = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

        // Fetch from API
        const response = await fetch(`${baseUrl}/api/snapshot/${address}`)
        if (!response.ok) {
            throw new Error(`Failed to fetch snapshot: ${response.statusText}`)
        }

        const snapshot: AccountSnapshot = await response.json()

        if (!snapshot.success) {
            throw new Error(`Snapshot error: ${snapshot.error}`)
        }

        // Store via API endpoint
        const storeResponse = await fetch(`${baseUrl}/api/analytics/store-snapshot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(snapshot),
        })

        if (!storeResponse.ok) {
            const error = await storeResponse.text()
            throw new Error(`Failed to store snapshot: ${error}`)
        }
    }

    /**
     * Get the latest snapshot for an address
     */
    async getLatestSnapshot(address: string): Promise<AccountSnapshot | null> {
        const { prismaMonitoring } = await import('@/lib/prisma-monitoring')
        const result = await prismaMonitoring.accountSnapshot.findFirst({
            where: {
                address: address.toLowerCase(),
            },
            orderBy: {
                timestamp: 'desc',
            },
        })

        if (!result) return null

        return result.snapshot as unknown as AccountSnapshot
    }

    /**
     * Get historical snapshots for an address
     */
    async getHistoricalSnapshots(address: string, limit = 100): Promise<AccountSnapshot[]> {
        const { prismaMonitoring } = await import('@/lib/prisma-monitoring')
        const results = await prismaMonitoring.accountSnapshot.findMany({
            where: {
                address: address.toLowerCase(),
            },
            orderBy: {
                timestamp: 'desc',
            },
            take: limit,
        })

        return results.map((r) => r.snapshot as unknown as AccountSnapshot)
    }

    /**
     * Clean up old snapshots (older than 7 days by default)
     */
    async cleanupOldSnapshots(daysToKeep = 7): Promise<number> {
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

        const { prismaMonitoring } = await import('@/lib/prisma-monitoring')
        const result = await prismaMonitoring.accountSnapshot.deleteMany({
            where: {
                timestamp: {
                    lt: cutoffDate,
                },
            },
        })

        return result.count
    }

    /**
     * Simple aggregated metrics (simplified version)
     */
    async getAggregatedMetrics(): Promise<{ totalValue: number; totalDelta: number; averageAPR: number }> {
        // Get latest snapshot for each unique address
        const { prismaMonitoring } = await import('@/lib/prisma-monitoring')
        const latestSnapshots = await prismaMonitoring.accountSnapshot.findMany({
            distinct: ['address'],
            orderBy: {
                timestamp: 'desc',
            },
        })

        if (latestSnapshots.length === 0) {
            return { totalValue: 0, totalDelta: 0, averageAPR: 0 }
        }

        let totalValue = 0
        let totalDelta = 0
        let totalAPR = 0
        let aprCount = 0

        for (const record of latestSnapshots) {
            const snapshot = record.snapshot as unknown as AccountSnapshot
            totalValue += snapshot.metrics.portfolio.totalUSD
            totalDelta += snapshot.metrics.portfolio.netDeltaHYPE

            // Add APR if available
            const combinedAPR = snapshot.metrics.portfolio.apr.combined24h
            if (combinedAPR !== null) {
                totalAPR += combinedAPR
                aprCount++
            }
        }

        return {
            totalValue,
            totalDelta,
            averageAPR: aprCount > 0 ? totalAPR / aprCount : 0,
        }
    }
}

export const analyticsService = new AnalyticsService()
