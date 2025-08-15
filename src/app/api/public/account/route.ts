import { NextRequest, NextResponse } from 'next/server'
import { positionFetcher } from '@/services/core/position-fetcher.service'
import { calculateLpDelta, calculateSpotDelta, calculatePerpDelta, calculateWalletDelta } from '@/utils/delta.util'
import type { AccountData } from '@/interfaces/account.interface'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const evmAddress = searchParams.get('evm')
        const coreAddress = searchParams.get('core')

        if (!evmAddress || !coreAddress) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Both evm and core addresses are required',
                },
                { status: 400 },
            )
        }

        const evmAddressLower = evmAddress.toLowerCase()
        const coreAddressLower = coreAddress.toLowerCase()

        const startTime = Date.now()

        // Fetch HyperEVM positions using evmAddress
        const { lpData: lpPositions, hyperEvmData: hyperEvmBalances, timings: evmTimings } = await positionFetcher.fetchAllPositions(evmAddressLower)

        // Fetch HyperCore positions using coreAddress
        const { spotData: spotBalances, perpData: perpPositions, timings: coreTimings } = await positionFetcher.fetchAllPositions(coreAddressLower)

        // Merge timings
        const timings = {
            lpFetch: evmTimings?.lpFetch || 0,
            evmFetch: evmTimings?.evmFetch || 0,
            spotFetch: coreTimings?.spotFetch || 0,
            perpFetch: coreTimings?.perpFetch || 0,
            total: Date.now() - startTime,
        }

        // Calculate totals (in USD)
        const totalLpValue = lpPositions.reduce((sum, p) => sum + p.valueUSD, 0)
        const totalSpotValue = spotBalances.reduce((sum, b) => sum + b.valueUSD, 0)
        const totalPerpValue = perpPositions.reduce((sum, p) => sum + p.notionalValue, 0)
        const totalHyperEvmValue = hyperEvmBalances?.reduce((sum, b) => sum + b.valueUSD, 0) || 0

        // Calculate delta exposures in HYPE units (not USD)
        const lpDelta = calculateLpDelta(lpPositions)
        const spotDelta = calculateSpotDelta(spotBalances)
        const perpDelta = calculatePerpDelta(perpPositions)
        const hyperEvmDelta = calculateWalletDelta(hyperEvmBalances)
        const netDelta = lpDelta + spotDelta + perpDelta + hyperEvmDelta

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
        const totalValue = totalLpValue + totalPerpValue + totalSpotValue + totalHyperEvmValue

        const accountData: AccountData = {
            success: true,
            account: {
                evmAddress: evmAddressLower,
                coreAddress: coreAddressLower,
                name: null,
                isMonitored: false,
            },
            // New structure - organized by platform
            positions: {
                hyperEvm: {
                    lp: lpPositions.map((p) => ({
                        ...p,
                        feeTier: p.fee ? `${(p.fee / 10000).toFixed(2)}%` : null,
                    })),
                    balances: hyperEvmBalances,
                },
                hyperCore: {
                    perp: perpPositions,
                    spot: spotBalances,
                },
            },
            metrics: {
                hyperEvm: {
                    values: {
                        lpUSD: totalLpValue,
                        balancesUSD: totalHyperEvmValue,
                        totalUSD: totalLpValue + totalHyperEvmValue,
                    },
                    deltas: {
                        lpHYPE: lpDelta,
                        balancesHYPE: hyperEvmDelta,
                        totalHYPE: lpDelta + hyperEvmDelta,
                    },
                },
                hyperCore: {
                    values: {
                        perpUSD: totalPerpValue,
                        spotUSD: totalSpotValue,
                        totalUSD: totalPerpValue + totalSpotValue,
                    },
                    deltas: {
                        perpHYPE: perpDelta,
                        spotHYPE: spotDelta,
                        totalHYPE: perpDelta + spotDelta,
                    },
                },
                portfolio: {
                    totalValueUSD: totalValue,
                    netDeltaHYPE: netDelta,
                    netAPRPercent: netAPR,
                    lpFeeAPRPercent: lpFeeAPR,
                    fundingAPRPercent: fundingAPR,
                },
            },
            snapshots: {
                last: null,
                current: {
                    lpFeeAPRPercent: lpFeeAPR,
                    fundingAPRPercent: fundingAPR,
                    netAPRPercent: netAPR,
                    formula: 'Net APR = LP Fee APR + Funding APR',
                    note: 'Real-time APR calculation requires historical data tracking',
                },
            },
            timings: {
                hyperEvm: {
                    lpMs: timings.lpFetch,
                    balancesMs: timings.evmFetch,
                },
                hyperCore: {
                    perpMs: timings.perpFetch,
                    spotMs: timings.spotFetch,
                },
                totalMs: timings.total,
            },
        }

        // Return response with cache headers
        return NextResponse.json(accountData, {
            headers: {
                'Cache-Control': 'public, max-age=30, s-maxage=30, stale-while-revalidate=60',
            },
        })
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
