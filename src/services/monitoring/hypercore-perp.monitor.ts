import { prismaMonitoring } from '@/lib/prisma-monitoring'
import type { PerpPosition, MonitoredAccount } from '@/generated/prisma-monitoring'
import { Prisma } from '@prisma/client-monitoring'
const { Decimal } = Prisma

// HyperCore API types
interface HyperCorePosition {
    coin: string
    szi: string // size (positive for long, negative for short)
    entryPx: string // entry price
    positionValue: string
    unrealizedPnl: string
    returnOnEquity: string
    leverage: {
        type: string
        value: number
    }
}

interface HyperCoreUserState {
    marginSummary: {
        accountValue: string
        totalMargin: string
    }
    assetPositions: HyperCorePosition[]
}

export class PerpMonitorService {
    private readonly hyperCoreUrl = 'https://api.hyperliquid.xyz'

    /**
     * Fetch positions from HyperCore for an account
     */
    async fetchHyperCorePositions(accountAddress: string): Promise<HyperCorePosition[]> {
        try {
            if (process.env.NODE_ENV === 'development') {
                console.log(`  🔍 [Perp Monitor] Fetching HyperCore positions for ${accountAddress.slice(0, 10)}...`)
            }

            const response = await fetch(`${this.hyperCoreUrl}/info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'clearinghouseState',
                    user: accountAddress,
                }),
            })

            const data: HyperCoreUserState = await response.json()
            const positions = data.assetPositions || []

            if (process.env.NODE_ENV === 'development' && positions.length > 0) {
                console.log(`    ✅ Found ${positions.length} HyperCore position(s)`)
            }

            return positions
        } catch (error) {
            console.error(`Error fetching HyperCore positions for ${accountAddress}:`, error)
            return []
        }
    }

    /**
     * Fetch current funding rates
     */
    async fetchFundingRates(): Promise<Record<string, number>> {
        try {
            const response = await fetch(`${this.hyperCoreUrl}/info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'meta',
                }),
            })

            const data = await response.json()
            const rates: Record<string, number> = {}

            if (data.universe && Array.isArray(data.universe)) {
                for (const market of data.universe) {
                    if (market.funding) {
                        rates[market.name] = parseFloat(market.funding)
                    }
                }
            }

            return rates
        } catch (error) {
            console.error('Error fetching funding rates:', error)
            return {}
        }
    }

    /**
     * Store perp positions in database
     */
    private async storePerpPositions(account: MonitoredAccount, hyperCorePositions: HyperCorePosition[]): Promise<PerpPosition[]> {
        const perpPositions: PerpPosition[] = []

        // Filter for HYPE short positions
        const hypeShorts = hyperCorePositions.filter((pos) => pos.coin === 'HYPE' && parseFloat(pos.szi) < 0)

        for (const pos of hypeShorts) {
            const size = Math.abs(parseFloat(pos.szi))
            const entryPrice = parseFloat(pos.entryPx)
            const positionValue = parseFloat(pos.positionValue)
            const unrealizedPnl = parseFloat(pos.unrealizedPnl)
            const leverage = pos.leverage.value

            // Calculate current mark price from position value
            const markPrice = size > 0 ? Math.abs(positionValue / size) : entryPrice

            // Upsert perp position
            const perpPosition = await prismaMonitoring.perpPosition.upsert({
                where: {
                    accountId_asset: {
                        accountId: account.id,
                        asset: 'HYPE',
                    },
                },
                create: {
                    accountId: account.id,
                    asset: 'HYPE',
                    szi: new Decimal(-size), // Negative for short
                    entryPx: new Decimal(entryPrice),
                    markPx: new Decimal(markPrice),
                    marginUsed: new Decimal(Math.abs(positionValue / leverage)),
                    unrealizedPnl: new Decimal(unrealizedPnl),
                    fundingPaid: new Decimal(0),
                },
                update: {
                    szi: new Decimal(-size),
                    markPx: new Decimal(markPrice),
                    marginUsed: new Decimal(Math.abs(positionValue / leverage)),
                    unrealizedPnl: new Decimal(unrealizedPnl),
                },
            })

            perpPositions.push(perpPosition)
        }

        // Mark closed positions as inactive (set size to 0)
        await prismaMonitoring.perpPosition.updateMany({
            where: {
                accountId: account.id,
                asset: 'HYPE',
                id: {
                    notIn: perpPositions.map((hp) => hp.id),
                },
            },
            data: {
                szi: new Decimal(0),
            },
        })

        return perpPositions
    }

    /**
     * Fetch and store perp positions for an account
     * This is the main method used by API endpoints
     */
    async fetchAndStorePerpPositions(account: MonitoredAccount, addressOverride?: string): Promise<PerpPosition[]> {
        const address = addressOverride || account.address
        const hyperCorePositions = await this.fetchHyperCorePositions(address)
        return this.storePerpPositions(account, hyperCorePositions)
    }

    /**
     * Update or create perp positions for an account
     */
    async updatePerpPositions(account: MonitoredAccount): Promise<PerpPosition[]> {
        const hyperCorePositions = await this.fetchHyperCorePositions(account.address)
        // const fundingRates = await this.fetchFundingRates() // TODO: Use for funding calculations
        await this.fetchFundingRates() // Fetch but don't use yet
        const perpPositions: PerpPosition[] = []

        // Filter for HYPE short positions
        const hypeShorts = hyperCorePositions.filter((pos) => pos.coin === 'HYPE' && parseFloat(pos.szi) < 0)

        if (process.env.NODE_ENV === 'development' && hypeShorts.length > 0) {
            console.log(`    🛡️ Found ${hypeShorts.length} HYPE short position(s)`)
        }

        for (const pos of hypeShorts) {
            const size = Math.abs(parseFloat(pos.szi))
            const entryPrice = parseFloat(pos.entryPx)
            const positionValue = parseFloat(pos.positionValue)
            const unrealizedPnl = parseFloat(pos.unrealizedPnl)
            const leverage = pos.leverage.value
            // const fundingRate = fundingRates['HYPE'] || 0 // TODO: Use for funding calculations

            // Calculate current mark price from position value
            const markPrice = size > 0 ? Math.abs(positionValue / size) : entryPrice

            // Upsert perp position
            const perpPosition = await prismaMonitoring.perpPosition.upsert({
                where: {
                    accountId_asset: {
                        accountId: account.id,
                        asset: 'HYPE',
                    },
                },
                create: {
                    accountId: account.id,
                    asset: 'HYPE',
                    szi: new Decimal(-size), // Negative for short
                    entryPx: new Decimal(entryPrice),
                    markPx: new Decimal(markPrice),
                    marginUsed: new Decimal(Math.abs(positionValue / leverage)),
                    unrealizedPnl: new Decimal(unrealizedPnl),
                    fundingPaid: new Decimal(0),
                },
                update: {
                    szi: new Decimal(-size), // Negative for short
                    markPx: new Decimal(markPrice),
                    marginUsed: new Decimal(Math.abs(positionValue / leverage)),
                    unrealizedPnl: new Decimal(unrealizedPnl),
                    updatedAt: new Date(),
                },
            })

            perpPositions.push(perpPosition)

            // Snapshot creation handled separately in orchestrator
        }

        // Mark closed positions as inactive
        await prismaMonitoring.perpPosition.updateMany({
            where: {
                accountId: account.id,
                asset: 'HYPE',
                id: {
                    notIn: perpPositions.map((hp) => hp.id),
                },
            },
            data: {
                updatedAt: new Date(),
            },
        })

        return perpPositions
    }

    /**
     * Calculate perp value and delta contribution
     */
    calculatePerpMetrics(position: PerpPosition): { valueUSD: number; deltaContribution: number } {
        const szi = position.szi.toNumber()
        const markPx = position.markPx.toNumber()
        const notionalValue = Math.abs(szi * markPx)

        return {
            valueUSD: notionalValue,
            deltaContribution: szi * markPx, // Negative for short
        }
    }

    /**
     * Calculate net delta exposure (LP delta + perp delta)
     */
    calculateNetDelta(lpDelta: number, perpSzi: Prisma.Decimal, perpPrice: Prisma.Decimal): number {
        const perpSize = perpSzi.toNumber()
        const perpPriceNum = perpPrice.toNumber()
        const perpDelta = perpSize * perpPriceNum // Already negative for short
        return lpDelta + perpDelta
    }

    /**
     * Calculate perp effectiveness
     */
    calculatePerpEffectiveness(lpDelta: number, perpDelta: number): number {
        if (lpDelta === 0) return 0

        const coverage = Math.abs(perpDelta / lpDelta)
        // Cap at 100% and convert to percentage
        return Math.min(coverage * 100, 100)
    }

    /**
     * Monitor all accounts for perp positions
     */
    async monitorAllAccounts(): Promise<{
        accountsMonitored: number
        perpPositions: number
        totalPerpValue: number
    }> {
        const accounts = await prismaMonitoring.monitoredAccount.findMany({
            where: { isActive: true },
        })

        let totalPerpPositions = 0
        let totalPerpValue = 0

        if (process.env.NODE_ENV === 'development') {
            console.log(`\n🛡️ [Perp Monitor] Monitoring ${accounts.length} account(s) for perp positions...`)
        }

        for (const account of accounts) {
            const positions = await this.updatePerpPositions(account)
            totalPerpPositions += positions.length
            const positionValue = positions.reduce((sum, p) => {
                const metrics = this.calculatePerpMetrics(p)
                return sum + metrics.valueUSD
            }, 0)
            totalPerpValue += positionValue

            if (process.env.NODE_ENV === 'development' && positions.length > 0) {
                const totalValue = positionValue
                console.log(`    💵 Total perp value for ${account.address.slice(0, 10)}...: $${totalValue.toFixed(2)}`)
            }
        }

        return {
            accountsMonitored: accounts.length,
            perpPositions: totalPerpPositions,
            totalPerpValue,
        }
    }

    /**
     * Check if rebalancing is needed based on net delta
     */
    async checkRebalanceNeeded(
        accountAddress: string,
        threshold: number = 0.05, // 5% default threshold
    ): Promise<{
        needed: boolean
        currentDrift: number
        lpDelta: number
        perpDelta: number
    }> {
        // Get LP positions delta
        await prismaMonitoring.lpPosition.findMany({
            where: {
                accountId: accountAddress,
            },
        })

        // For now, estimate LP delta as 50% of total LP value in HYPE
        // TODO: Calculate actual delta based on pool composition
        const lpDelta = 0

        // Get perp positions delta
        const perpPositions = await prismaMonitoring.perpPosition.findMany({
            where: {
                accountId: accountAddress,
                asset: 'HYPE',
            },
        })

        const perpDelta = perpPositions.reduce((sum, p) => {
            const metrics = this.calculatePerpMetrics(p)
            return sum + metrics.deltaContribution
        }, 0)

        const netDelta = lpDelta + perpDelta
        const totalExposure = Math.abs(lpDelta) + Math.abs(perpDelta)
        const drift = totalExposure > 0 ? Math.abs(netDelta / totalExposure) : 0

        return {
            needed: drift > threshold,
            currentDrift: drift,
            lpDelta,
            perpDelta,
        }
    }

    /**
     * Record a rebalance event
     * Note: RebalanceHistory table removed - implement alternative tracking if needed
     */
    async recordRebalance(
        accountId: string,
        deltaBefore: number,
        deltaAfter: number,
        adjustments: {
            lpType?: string
            perpType?: string
            perpSizeBefore?: number
            perpSizeAfter?: number
            cost: number
        },
    ): Promise<void> {
        // TODO: Implement alternative rebalance tracking if needed
        // For now, just log the event
        console.log('Rebalance event:', {
            accountId,
            deltaBefore,
            deltaAfter,
            adjustments,
            timestamp: new Date(),
        })
    }
}

export const perpMonitorService = new PerpMonitorService()
