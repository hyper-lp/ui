import { NextRequest, NextResponse } from 'next/server'
import { positionFetcher } from '@/services/core/position-fetcher.service'

export async function GET(request: NextRequest, { params }: { params: Promise<{ account: string }> }) {
    try {
        const { account } = await params
        const accountAddress = account.toLowerCase()

        // Track timing for each fetch
        const startTime = Date.now()

        // Fetch all positions from blockchain (all accounts are treated as non-monitored)
        const {
            lpData: lpPositions,
            spotData: spotBalances,
            perpData: perpPositions,
            hyperEvmData: hyperEvmBalances,
            timings: fetchTimings,
        } = await positionFetcher.fetchAllPositions(accountAddress)

        // Merge timings
        const timings = { ...fetchTimings }

        // Calculate totals (in USD)
        const totalLpValue = lpPositions.reduce((sum, p) => sum + p.valueUSD, 0)
        const totalSpotValue = spotBalances.reduce((sum, b) => sum + b.valueUSD, 0)
        const totalPerpValue = perpPositions.reduce((sum, p) => sum + p.notionalValue, 0)
        const totalHyperEvmValue = hyperEvmBalances?.reduce((sum, b) => sum + b.valueUSD, 0) || 0

        // Calculate delta exposures in HYPE units (not USD)
        // LP Delta: Sum of actual HYPE/WHYPE amounts in LP positions
        const lpDelta = lpPositions.reduce((sum, p) => {
            const token0IsHype = p.token0Symbol === 'WHYPE' || p.token0Symbol === 'HYPE'
            const token1IsHype = p.token1Symbol === 'WHYPE' || p.token1Symbol === 'HYPE'

            if (token0IsHype && p.token0Amount) {
                return sum + p.token0Amount
            } else if (token1IsHype && p.token1Amount) {
                return sum + p.token1Amount
            }
            return sum
        }, 0)

        // Spot Delta: HYPE balance in spot (already in HYPE units)
        const spotDelta = spotBalances.filter((b) => b.asset === 'HYPE').reduce((sum, b) => sum + Number(b.balance), 0)

        // HyperEVM Delta: HYPE/WHYPE balance on EVM (convert from wei to HYPE units)
        const hyperEvmDelta =
            hyperEvmBalances
                ?.filter((b) => b.symbol === 'HYPE' || b.symbol === 'WHYPE')
                .reduce((sum, b) => {
                    // Balance is in wei, convert to HYPE units
                    const balance = Number(b.balance) / Math.pow(10, b.decimals)
                    return sum + balance
                }, 0) || 0

        // Perp Delta: Perp position size (already in HYPE units for HYPE perps)
        const perpDelta = perpPositions
            .filter((p) => p.asset === 'HYPE')
            .reduce((sum, p) => {
                // Size is already in HYPE units, negative means short
                console.log(`Perp ${p.asset}: size=${p.size} HYPE`)
                return sum + p.size
            }, 0)

        // Net Delta in HYPE units
        const netDelta = lpDelta + spotDelta + perpDelta + hyperEvmDelta

        console.log(
            `Delta Summary (HYPE units): LP=${lpDelta.toFixed(4)}, Perp=${perpDelta.toFixed(4)}, Spot=${spotDelta.toFixed(4)}, EVM=${hyperEvmDelta.toFixed(4)}, Net=${netDelta.toFixed(4)}`,
        )

        // Calculate APR components (annualized)
        const lpFeeAPR = 0 // Would need to track fees over time
        const fundingAPR = perpPositions
            .filter((p) => p.asset === 'HYPE')
            .reduce((sum, p) => {
                // Estimate based on current funding (would need historical average)
                // Negative position earns funding when rate is positive
                const dailyFunding = p.fundingPaid / 30 // Rough estimate
                const notional = Math.abs(p.size * p.markPrice)
                return sum + (notional > 0 ? (dailyFunding / notional) * 365 : 0)
            }, 0)
        const netAPR = lpFeeAPR + fundingAPR

        // Calculate total time
        timings.total = Date.now() - startTime

        // Return response with cache headers
        return NextResponse.json(
            {
                success: true,
                account: {
                    address: accountAddress,
                    name: null,
                    isActive: false, // All accounts are non-monitored
                },
                timings,
                positions: {
                    lp: lpPositions.map((p) => ({
                        ...p,
                        feeTier: p.fee ? `${(p.fee / 10000).toFixed(2)}%` : null,
                    })),
                    perp: perpPositions,
                    spot: spotBalances,
                    hyperEvm: hyperEvmBalances,
                },
                summary: {
                    totalLpValue,
                    totalPerpValue,
                    totalSpotValue,
                    totalHyperEvmValue,
                    totalValue: totalLpValue + totalPerpValue + totalSpotValue + totalHyperEvmValue,
                    netDelta, // In HYPE units
                    lpDelta, // In HYPE units
                    perpDelta, // In HYPE units
                    spotDelta, // In HYPE units
                    hyperEvmDelta, // In HYPE units
                    lastSnapshot: null,
                    currentAPR: {
                        lpFeeAPR,
                        fundingAPR,
                        netAPR,
                        formula: 'Net APR = LP Fee APR + Funding APR',
                        note: 'Real-time APR calculation requires historical data tracking',
                    },
                },
            },
            {
                headers: {
                    'Cache-Control': 'public, max-age=30, s-maxage=30, stale-while-revalidate=60',
                },
            },
        )
    } catch (error) {
        console.error('Error fetching positions:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch positions',
            },
            { status: 500 },
        )
    }
}
