import { prisma } from '@/lib/prisma'
import type { HedgePosition, HedgeSnapshot, MonitoredWallet } from '@prisma/client'

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

export class HedgeMonitorService {
    private readonly hyperCoreUrl = 'https://api.hyperliquid.xyz'

    /**
     * Fetch positions from HyperCore for a wallet
     */
    async fetchHyperCorePositions(walletAddress: string): Promise<HyperCorePosition[]> {
        try {
            if (process.env.NODE_ENV === 'development') {
                console.log(`  🔍 [Hedge Monitor] Fetching HyperCore positions for ${walletAddress.slice(0, 10)}...`)
            }

            const response = await fetch(`${this.hyperCoreUrl}/info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'clearinghouseState',
                    user: walletAddress,
                }),
            })

            const data: HyperCoreUserState = await response.json()
            const positions = data.assetPositions || []

            if (process.env.NODE_ENV === 'development' && positions.length > 0) {
                console.log(`    ✅ Found ${positions.length} HyperCore position(s)`)
            }

            return positions
        } catch (error) {
            console.error(`Error fetching HyperCore positions for ${walletAddress}:`, error)
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
     * Update or create hedge positions for a wallet
     */
    async updateHedgePositions(wallet: MonitoredWallet): Promise<HedgePosition[]> {
        const hyperCorePositions = await this.fetchHyperCorePositions(wallet.address)
        const fundingRates = await this.fetchFundingRates()
        const hedgePositions: HedgePosition[] = []

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
            const fundingRate = fundingRates['HYPE'] || 0

            // Calculate current mark price from position value
            const markPrice = size > 0 ? Math.abs(positionValue / size) : entryPrice

            // Upsert hedge position
            const hedgePosition = await prisma.hedgePosition.upsert({
                where: {
                    id: `${wallet.address}-HYPE-short`, // Unique ID per wallet-asset
                },
                create: {
                    id: `${wallet.address}-HYPE-short`,
                    walletAddress: wallet.address,
                    walletId: wallet.id,
                    asset: 'HYPE',
                    size,
                    notionalValue: Math.abs(positionValue),
                    entryPrice,
                    markPrice,
                    margin: Math.abs(positionValue / leverage),
                    leverage,
                    unrealizedPnl,
                    currentFundingRate: fundingRate,
                    isActive: true,
                },
                update: {
                    size,
                    notionalValue: Math.abs(positionValue),
                    markPrice,
                    margin: Math.abs(positionValue / leverage),
                    leverage,
                    unrealizedPnl,
                    currentFundingRate: fundingRate,
                    isActive: true,
                    updatedAt: new Date(),
                },
            })

            hedgePositions.push(hedgePosition)

            // Create snapshot
            await this.createHedgeSnapshot(hedgePosition, fundingRate)
        }

        // Mark closed positions as inactive
        await prisma.hedgePosition.updateMany({
            where: {
                walletAddress: wallet.address,
                asset: 'HYPE',
                id: {
                    notIn: hedgePositions.map((hp) => hp.id),
                },
                isActive: true,
            },
            data: {
                isActive: false,
                closedAt: new Date(),
            },
        })

        return hedgePositions
    }

    /**
     * Create a snapshot of hedge position
     */
    async createHedgeSnapshot(position: HedgePosition, fundingRate: number): Promise<HedgeSnapshot> {
        // Calculate funding paid since last snapshot
        const lastSnapshot = await prisma.hedgeSnapshot.findFirst({
            where: { hedgePositionId: position.id },
            orderBy: { timestamp: 'desc' },
        })

        let fundingPaid = 0
        if (lastSnapshot) {
            const hoursSinceLastSnapshot = (Date.now() - lastSnapshot.timestamp.getTime()) / (1000 * 60 * 60)
            // Negative because we're short (we receive funding when rate is positive)
            fundingPaid = -position.notionalValue * fundingRate * hoursSinceLastSnapshot
        }

        return prisma.hedgeSnapshot.create({
            data: {
                hedgePositionId: position.id,
                size: position.size,
                markPrice: position.markPrice,
                notionalValue: position.notionalValue,
                margin: position.margin,
                unrealizedPnl: position.unrealizedPnl,
                fundingRate,
                fundingPaid,
                deltaExposure: -position.notionalValue, // Negative delta for short
            },
        })
    }

    /**
     * Calculate net delta exposure (LP delta - hedge delta)
     */
    calculateNetDelta(lpDelta: number, hedgeSize: number, hedgePrice: number): number {
        const hedgeDelta = -hedgeSize * hedgePrice // Negative for short
        return lpDelta + hedgeDelta
    }

    /**
     * Calculate hedge effectiveness
     */
    calculateHedgeEffectiveness(lpDelta: number, hedgeDelta: number): number {
        if (lpDelta === 0) return 0

        const coverage = Math.abs(hedgeDelta / lpDelta)
        // Cap at 100% and convert to percentage
        return Math.min(coverage * 100, 100)
    }

    /**
     * Monitor all wallets for hedge positions
     */
    async monitorAllWallets(): Promise<{
        walletsMonitored: number
        hedgePositions: number
        totalHedgeValue: number
    }> {
        const wallets = await prisma.monitoredWallet.findMany({
            where: { isActive: true },
        })

        let totalHedgePositions = 0
        let totalHedgeValue = 0

        if (process.env.NODE_ENV === 'development') {
            console.log(`\n🛡️ [Hedge Monitor] Monitoring ${wallets.length} wallet(s) for hedge positions...`)
        }

        for (const wallet of wallets) {
            const positions = await this.updateHedgePositions(wallet)
            totalHedgePositions += positions.length
            totalHedgeValue += positions.reduce((sum, p) => sum + p.notionalValue, 0)

            if (process.env.NODE_ENV === 'development' && positions.length > 0) {
                const totalValue = positions.reduce((sum, p) => sum + p.notionalValue, 0)
                console.log(`    💵 Total hedge value for ${wallet.address.slice(0, 10)}...: $${totalValue.toFixed(2)}`)
            }
        }

        return {
            walletsMonitored: wallets.length,
            hedgePositions: totalHedgePositions,
            totalHedgeValue,
        }
    }

    /**
     * Check if rebalancing is needed based on delta drift
     */
    async checkRebalanceNeeded(
        walletAddress: string,
        threshold: number = 0.05, // 5% default threshold
    ): Promise<{
        needed: boolean
        currentDrift: number
        lpDelta: number
        hedgeDelta: number
    }> {
        // Get LP positions delta
        await prisma.lPPosition.findMany({
            where: {
                ownerAddress: walletAddress,
                isActive: true,
            },
        })

        // For now, estimate LP delta as 50% of total LP value in HYPE
        // TODO: Calculate actual delta based on pool composition
        const lpDelta = 0

        // Get hedge positions delta
        const hedgePositions = await prisma.hedgePosition.findMany({
            where: {
                walletAddress,
                isActive: true,
                asset: 'HYPE',
            },
        })

        const hedgeDelta = hedgePositions.reduce(
            (sum, p) => sum - p.notionalValue, // Negative for shorts
            0,
        )

        const netDelta = lpDelta + hedgeDelta
        const totalExposure = Math.abs(lpDelta) + Math.abs(hedgeDelta)
        const drift = totalExposure > 0 ? Math.abs(netDelta / totalExposure) : 0

        return {
            needed: drift > threshold,
            currentDrift: drift,
            lpDelta,
            hedgeDelta,
        }
    }

    /**
     * Record a rebalance event
     * Note: RebalanceHistory table removed - implement alternative tracking if needed
     */
    async recordRebalance(
        walletAddress: string,
        deltaBefore: number,
        deltaAfter: number,
        adjustments: {
            lpType?: string
            hedgeType?: string
            hedgeSizeBefore?: number
            hedgeSizeAfter?: number
            cost: number
        },
    ): Promise<void> {
        // TODO: Implement alternative rebalance tracking if needed
        // For now, just log the event
        console.log('Rebalance event:', {
            walletAddress,
            deltaBefore,
            deltaAfter,
            adjustments,
            timestamp: new Date(),
        })
    }
}

export const hedgeMonitorService = new HedgeMonitorService()
