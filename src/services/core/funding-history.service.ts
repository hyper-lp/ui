/**
 * Service for fetching historical funding rates from Hyperliquid
 */
class FundingHistoryService {
    private readonly HYPERLIQUID_API = 'https://api.hyperliquid.xyz/info'

    /**
     * Fetch funding history for a specific asset
     * Returns funding snapshots at 8-hour intervals
     */
    async fetchFundingHistory(asset: string, lookbackDays: number = 30): Promise<Array<{ time: number; fundingRate: number }>> {
        try {
            // Calculate start time (milliseconds)
            const endTime = Date.now()
            const startTime = endTime - lookbackDays * 24 * 60 * 60 * 1000

            // Hyperliquid funding history endpoint
            const response = await fetch(this.HYPERLIQUID_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'fundingHistory',
                    coin: asset,
                    startTime: startTime,
                    endTime: endTime,
                }),
            })

            if (!response.ok) {
                console.error(`Failed to fetch funding history: ${response.status}`)
                return []
            }

            const data = await response.json()

            // Parse funding history data
            if (!Array.isArray(data)) {
                console.error('Unexpected funding history format:', data)
                return []
            }

            // Convert to our format
            return data.map((item: { time: number; fundingRate: string }) => ({
                time: item.time,
                fundingRate: parseFloat(item.fundingRate || '0'),
            }))
        } catch (error) {
            console.error('Error fetching funding history:', error)
            return []
        }
    }

    /**
     * Calculate average funding APR for different time periods
     * @param asset - The asset to get funding for (e.g., 'HYPE')
     * @returns Object with 24h, 7d, and 30d annualized funding APRs
     */
    async calculateHistoricalFundingAPRs(asset: string): Promise<{
        apr24h: number | null
        apr7d: number | null
        apr30d: number | null
    }> {
        try {
            // Fetch 30 days of funding history
            const history = await this.fetchFundingHistory(asset, 30)

            if (history.length === 0) {
                return { apr24h: null, apr7d: null, apr30d: null }
            }

            const now = Date.now()
            const oneDayAgo = now - 24 * 60 * 60 * 1000
            const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000

            // Filter data for each period
            const last24h = history.filter((h) => h.time >= oneDayAgo)
            const last7d = history.filter((h) => h.time >= sevenDaysAgo)
            const last30d = history

            // Calculate average funding rate for each period
            // Funding rate is 8-hourly, so we need to annualize it
            const calculateAPR = (data: typeof history) => {
                if (data.length === 0) return null

                // Average 8-hour funding rate
                const avgFundingRate = data.reduce((sum, h) => sum + h.fundingRate, 0) / data.length

                // Convert 8-hour rate to annual APR
                // 3 funding periods per day * 365 days = 1095 periods per year
                const annualizedRate = avgFundingRate * 3 * 365

                // Convert to percentage and invert for shorts (negative funding = shorts earn)
                return -annualizedRate * 100
            }

            return {
                apr24h: calculateAPR(last24h),
                apr7d: calculateAPR(last7d),
                apr30d: calculateAPR(last30d),
            }
        } catch (error) {
            console.error('Error calculating historical funding APRs:', error)
            return { apr24h: null, apr7d: null, apr30d: null }
        }
    }

    /**
     * Calculate weighted average funding APRs for multiple assets
     * @param positions - Array of positions with asset and notional value
     * @returns Weighted average funding APRs for 24h, 7d, 30d
     */
    async calculateWeightedFundingAPRs(positions: Array<{ asset: string; notionalValue: number }>): Promise<{
        apr24h: number | null
        apr7d: number | null
        apr30d: number | null
    }> {
        if (positions.length === 0) {
            return { apr24h: null, apr7d: null, apr30d: null }
        }

        try {
            // Get unique assets
            const uniqueAssets = [...new Set(positions.map((p) => p.asset))]

            // Fetch funding APRs for each asset
            const fundingAPRsByAsset = new Map<string, Awaited<ReturnType<typeof this.calculateHistoricalFundingAPRs>>>()

            await Promise.all(
                uniqueAssets.map(async (asset) => {
                    const aprs = await this.calculateHistoricalFundingAPRs(asset)
                    fundingAPRsByAsset.set(asset, aprs)
                }),
            )

            // Calculate weighted averages
            let totalNotional = 0
            const weightedSums = {
                apr24h: 0,
                apr7d: 0,
                apr30d: 0,
            }

            positions.forEach((position) => {
                const notional = Math.abs(position.notionalValue)
                const aprs = fundingAPRsByAsset.get(position.asset)

                if (notional > 0 && aprs) {
                    totalNotional += notional

                    if (aprs.apr24h !== null) {
                        weightedSums.apr24h += aprs.apr24h * notional
                    }
                    if (aprs.apr7d !== null) {
                        weightedSums.apr7d += aprs.apr7d * notional
                    }
                    if (aprs.apr30d !== null) {
                        weightedSums.apr30d += aprs.apr30d * notional
                    }
                }
            })

            if (totalNotional === 0) {
                return { apr24h: null, apr7d: null, apr30d: null }
            }

            return {
                apr24h: weightedSums.apr24h / totalNotional,
                apr7d: weightedSums.apr7d / totalNotional,
                apr30d: weightedSums.apr30d / totalNotional,
            }
        } catch (error) {
            console.error('Error calculating weighted funding APRs:', error)
            return { apr24h: null, apr7d: null, apr30d: null }
        }
    }
}

export const fundingHistoryService = new FundingHistoryService()
