import { prismaMonitoring } from '@/lib/prisma-monitoring'
import type { AccountSnapshot } from '@/interfaces/account.interface'

/**
 * Simplified analytics service for storing and retrieving account snapshots
 */
export class AnalyticsService {
    /**
     * Store an account snapshot to the database
     */
    async storeAccountSnapshot(snapshot: AccountSnapshot, address: string): Promise<void> {
        if (!snapshot.success) {
            console.error(`Failed to store snapshot for ${address}: ${snapshot.error}`)
            return
        }

        try {
            await prismaMonitoring.accountSnapshot.create({
                data: {
                    address,
                    timestamp: new Date(snapshot.timestamp),
                    evmAddress: snapshot.evmAddress,
                    coreAddress: snapshot.coreAddress,
                    snapshot: JSON.parse(JSON.stringify(snapshot)), // Ensure it's serializable
                    totalUSD: snapshot.metrics.portfolio.totalUSD,
                    netDeltaHYPE: snapshot.metrics.portfolio.netDeltaHYPE,
                },
            })
        } catch (error) {
            console.error(`Failed to store snapshot for ${address}:`, error)
        }
    }

    /**
     * Fetch account snapshot from API and store it
     */
    async fetchAndStoreSnapshot(address: string, baseUrl = 'http://localhost:3000'): Promise<void> {
        try {
            const response = await fetch(`${baseUrl}/api/snapshot/${address}`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const snapshot: AccountSnapshot = await response.json()
            await this.storeAccountSnapshot(snapshot, address)
        } catch (error) {
            console.error(`Failed to fetch and store snapshot for ${address}:`, error)
        }
    }

    /**
     * Get latest snapshot for an account
     */
    async getLatestSnapshot(address: string): Promise<AccountSnapshot | null> {
        try {
            const record = await prismaMonitoring.accountSnapshot.findFirst({
                where: { address },
                orderBy: { timestamp: 'desc' },
            })

            if (!record) return null

            return record.snapshot as unknown as AccountSnapshot
        } catch (error) {
            console.error(`Failed to get latest snapshot for ${address}:`, error)
            return null
        }
    }

    /**
     * Get historical snapshots for an account
     */
    async getAccountHistory(address: string, hours = 24): Promise<AccountSnapshot[]> {
        const since = new Date(Date.now() - hours * 60 * 60 * 1000)

        try {
            const records = await prismaMonitoring.accountSnapshot.findMany({
                where: {
                    address,
                    timestamp: { gte: since },
                },
                orderBy: { timestamp: 'asc' },
            })

            return records.map((r: { snapshot: unknown }) => r.snapshot as unknown as AccountSnapshot)
        } catch (error) {
            console.error(`Failed to get history for ${address}:`, error)
            return []
        }
    }

    /**
     * Clean up old snapshots (keep last N days)
     */
    async cleanupOldSnapshots(daysToKeep = 7): Promise<number> {
        const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000)

        const result = await prismaMonitoring.accountSnapshot.deleteMany({
            where: {
                timestamp: { lt: cutoffDate },
            },
        })

        return result.count
    }

    /**
     * Get aggregated metrics across all accounts using JSON data
     */
    async getAggregatedMetrics(): Promise<{
        totalValue: number
        totalDelta: number
        averageAPR: number
        accountCount: number
    }> {
        try {
            // Get latest snapshot for each unique address
            const latestSnapshots = await prismaMonitoring.$queryRaw<
                Array<{
                    totalusd: number
                    netdeltahype: number
                    snapshot: unknown
                }>
            >`
                SELECT DISTINCT ON (address)
                    "totalUSD" as totalusd,
                    "netDeltaHYPE" as netdeltahype,
                    snapshot
                FROM "AccountSnapshot"
                ORDER BY address, timestamp DESC
            `

            if (!latestSnapshots || latestSnapshots.length === 0) {
                return {
                    totalValue: 0,
                    totalDelta: 0,
                    averageAPR: 0,
                    accountCount: 0,
                }
            }

            const totalValue = latestSnapshots.reduce((sum: number, s: { totalusd: number }) => sum + s.totalusd, 0)
            const totalDelta = latestSnapshots.reduce((sum: number, s: { netdeltahype: number }) => sum + s.netdeltahype, 0)

            // Calculate average APR from JSON data
            let totalAPR = 0
            let aprCount = 0

            for (const record of latestSnapshots) {
                const snapshot = record.snapshot as unknown as AccountSnapshot
                const combinedAPR = snapshot.metrics?.portfolio?.apr?.combined24h

                if (combinedAPR !== null && combinedAPR !== undefined) {
                    totalAPR += combinedAPR
                    aprCount++
                }
            }

            const averageAPR = aprCount > 0 ? totalAPR / aprCount : 0

            return {
                totalValue,
                totalDelta,
                averageAPR,
                accountCount: latestSnapshots.length,
            }
        } catch (error) {
            console.error('Failed to get aggregated metrics:', error)
            return {
                totalValue: 0,
                totalDelta: 0,
                averageAPR: 0,
                accountCount: 0,
            }
        }
    }

    /**
     * Get all tracked addresses
     */
    async getTrackedAddresses(): Promise<string[]> {
        try {
            const addresses = await prismaMonitoring.accountSnapshot.findMany({
                select: { address: true },
                distinct: ['address'],
            })

            return addresses.map((a: { address: string }) => a.address)
        } catch (error) {
            console.error('Failed to get tracked addresses:', error)
            return []
        }
    }
}

export const analyticsService = new AnalyticsService()
