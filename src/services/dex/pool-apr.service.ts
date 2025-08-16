import { DexProtocol } from '@/enums'
import { HYPEREVM_DEXS } from '@/config/hyperevm-dexs.config'
import type {
    PoolAPRData,
    AggregatedPoolAPR,
    SubgraphResponse,
    PoolsQueryResponse,
    PoolDayDatasQueryResponse,
    V3Pool,
    PoolAPRMetrics,
} from '@/interfaces/pool-apr.interface'

/**
 * Service for fetching and calculating pool APR from DEX subgraphs
 */
class PoolAPRService {
    private readonly V3_DEXS = [DexProtocol.HYPERSWAP, DexProtocol.PRJTX, DexProtocol.HYBRA]

    /**
     * Calculate fee APR
     */
    private calculateFeeAPR(feesUSD: number, tvlUSD: number, days: number): number {
        if (tvlUSD === 0) return 0
        return (feesUSD / tvlUSD) * (365 / days) * 100
    }

    /**
     * Fetch data from subgraph with error handling
     */
    private async fetchFromSubgraph<T>(url: string, query: string): Promise<T | null> {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            })

            if (!response.ok) {
                console.error(`Subgraph request failed: ${response.status}`)
                return null
            }

            const result: SubgraphResponse<T> = await response.json()

            if (result.errors) {
                console.error('GraphQL errors:', result.errors)
                return null
            }

            return result.data || null
        } catch (error) {
            console.error(`Failed to fetch from subgraph ${url}:`, error)
            return null
        }
    }

    /**
     * Get HYPE/USDT0 pools query
     */
    private getPoolsQuery(): string {
        return `
            query GetHypeUsdtPools {
                pools(
                    first: 20
                    where: {
                        or: [
                            {
                                token0_: { symbol_in: ["WHYPE", "HYPE"] }
                                token1_: { symbol_in: ["USD₮0", "USDT0", "USDT"] }
                            },
                            {
                                token0_: { symbol_in: ["USD₮0", "USDT0", "USDT"] }
                                token1_: { symbol_in: ["WHYPE", "HYPE"] }
                            }
                        ]
                    }
                    orderBy: totalValueLockedUSD
                    orderDirection: desc
                ) {
                    id
                    feeTier
                    liquidity
                    token0 {
                        id
                        symbol
                        decimals
                    }
                    token1 {
                        id
                        symbol
                        decimals
                    }
                    volumeUSD
                    feesUSD
                    totalValueLockedUSD
                }
            }
        `
    }

    /**
     * Get historical data query
     */
    private getHistoricalDataQuery(poolId: string, daysAgo: number): string {
        const startTime = Math.floor(Date.now() / 1000) - daysAgo * 86400
        return `
            query GetPoolHistoricalData {
                poolDayDatas(
                    where: {
                        pool: "${poolId.toLowerCase()}"
                        date_gte: ${startTime}
                    }
                    orderBy: date
                    orderDirection: asc
                ) {
                    date
                    volumeUSD
                    feesUSD
                    tvlUSD
                }
            }
        `
    }

    /**
     * Calculate pool metrics from historical data
     */
    private async calculatePoolMetrics(pool: V3Pool, subgraphUrl: string): Promise<PoolAPRMetrics> {
        const metrics: PoolAPRMetrics = {
            apr24h: 0,
            apr7d: 0,
            apr30d: 0,
            avgDailyVolume: 0,
            avgDailyFees: 0,
        }

        // Fetch 30 days of historical data
        const query = this.getHistoricalDataQuery(pool.id, 30)
        const data = await this.fetchFromSubgraph<PoolDayDatasQueryResponse>(subgraphUrl, query)

        if (!data?.poolDayDatas || data.poolDayDatas.length === 0) {
            // Use current data as fallback
            const tvl = parseFloat(pool.totalValueLockedUSD)
            const fees24h = parseFloat(pool.feesUSD)
            metrics.apr24h = this.calculateFeeAPR(fees24h, tvl, 1)
            return metrics
        }

        const dayDatas = data.poolDayDatas
        const now = Math.floor(Date.now() / 1000)
        const oneDayAgo = now - 86400
        const sevenDaysAgo = now - 86400 * 7

        // Calculate metrics for different periods
        const last24h = dayDatas.filter((d) => d.date >= oneDayAgo)
        const last7d = dayDatas.filter((d) => d.date >= sevenDaysAgo)
        const last30d = dayDatas

        // 24h APR
        if (last24h.length > 0) {
            const fees24h = last24h.reduce((sum, d) => sum + parseFloat(d.feesUSD), 0)
            const avgTvl24h = last24h.reduce((sum, d) => sum + parseFloat(d.tvlUSD), 0) / last24h.length
            metrics.apr24h = this.calculateFeeAPR(fees24h, avgTvl24h, 1)
        }

        // 7d APR
        if (last7d.length > 0) {
            const fees7d = last7d.reduce((sum, d) => sum + parseFloat(d.feesUSD), 0)
            const avgTvl7d = last7d.reduce((sum, d) => sum + parseFloat(d.tvlUSD), 0) / last7d.length
            const volume7d = last7d.reduce((sum, d) => sum + parseFloat(d.volumeUSD), 0)
            metrics.apr7d = this.calculateFeeAPR(fees7d, avgTvl7d, 7)
            metrics.avgDailyVolume = volume7d / 7
            metrics.avgDailyFees = fees7d / 7
        }

        // 30d APR
        if (last30d.length > 0) {
            const fees30d = last30d.reduce((sum, d) => sum + parseFloat(d.feesUSD), 0)
            const avgTvl30d = last30d.reduce((sum, d) => sum + parseFloat(d.tvlUSD), 0) / last30d.length
            metrics.apr30d = this.calculateFeeAPR(fees30d, avgTvl30d, 30)
        }

        return metrics
    }

    /**
     * Fetch pools from a single DEX
     */
    private async fetchDexPools(dex: DexProtocol): Promise<PoolAPRData[]> {
        const config = HYPEREVM_DEXS[dex]
        if (!config?.subgraphUrl) return []

        const query = this.getPoolsQuery()
        const data = await this.fetchFromSubgraph<PoolsQueryResponse>(config.subgraphUrl, query)

        if (!data?.pools) return []

        const poolsWithAPR: PoolAPRData[] = []

        for (const pool of data.pools) {
            const metrics = await this.calculatePoolMetrics(pool, config.subgraphUrl)

            poolsWithAPR.push({
                dex,
                poolAddress: pool.id,
                feeTier: parseInt(pool.feeTier),
                token0Symbol: pool.token0.symbol,
                token1Symbol: pool.token1.symbol,
                tvlUSD: parseFloat(pool.totalValueLockedUSD),
                volume24h: parseFloat(pool.volumeUSD),
                fees24h: parseFloat(pool.feesUSD),
                ...metrics,
            })
        }

        return poolsWithAPR
    }

    /**
     * Fetch and aggregate pool APR data from all V3 DEXs
     */
    async fetchAllPoolAPR(): Promise<AggregatedPoolAPR> {
        const allPools: PoolAPRData[] = []

        // Fetch from all V3 DEXs in parallel
        const promises = this.V3_DEXS.map((dex) => this.fetchDexPools(dex))
        const results = await Promise.allSettled(promises)

        for (const result of results) {
            if (result.status === 'fulfilled' && result.value) {
                allPools.push(...result.value)
            }
        }

        // Sort by 24h APR descending
        const sortedPools = allPools.sort((a, b) => b.apr24h - a.apr24h)

        // Calculate aggregates
        const poolsWithVolume = allPools.filter((p) => p.volume24h > 0)
        const averageAPR24h = poolsWithVolume.length > 0 ? poolsWithVolume.reduce((sum, p) => sum + p.apr24h, 0) / poolsWithVolume.length : 0

        const totalTVL = allPools.reduce((sum, p) => sum + p.tvlUSD, 0)
        const totalVolume24h = allPools.reduce((sum, p) => sum + p.volume24h, 0)
        const totalFees24h = allPools.reduce((sum, p) => sum + p.fees24h, 0)

        return {
            pools: sortedPools,
            averageAPR24h,
            totalTVL,
            totalVolume24h,
            totalFees24h,
            lastUpdated: Date.now(),
        }
    }
}

export const poolAPRService = new PoolAPRService()
