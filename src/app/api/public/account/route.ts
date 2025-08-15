import { NextRequest, NextResponse } from 'next/server'
import { positionFetcher } from '@/services/core/position-fetcher.service'
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
                return sum + p.size
            }, 0)

        // Net Delta in HYPE units
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
                        lp: totalLpValue,
                        balances: totalHyperEvmValue,
                        total: totalLpValue + totalHyperEvmValue,
                    },
                    deltas: {
                        lp: lpDelta,
                        balances: hyperEvmDelta,
                        total: lpDelta + hyperEvmDelta,
                    },
                },
                hyperCore: {
                    values: {
                        perp: totalPerpValue,
                        spot: totalSpotValue,
                        total: totalPerpValue + totalSpotValue,
                    },
                    deltas: {
                        perp: perpDelta,
                        spot: spotDelta,
                        total: perpDelta + spotDelta,
                    },
                },
                portfolio: {
                    totalValue,
                    netDelta,
                    netAPR,
                    lpFeeAPR,
                    fundingAPR,
                },
            },
            snapshots: {
                last: null,
                current: {
                    lpFeeAPR,
                    fundingAPR,
                    netAPR,
                    formula: 'Net APR = LP Fee APR + Funding APR',
                    note: 'Real-time APR calculation requires historical data tracking',
                },
            },
            timings: {
                hyperEvm: {
                    lp: timings.lpFetch,
                    balances: timings.evmFetch,
                },
                hyperCore: {
                    perp: timings.perpFetch,
                    spot: timings.spotFetch,
                },
                total: timings.total,
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
