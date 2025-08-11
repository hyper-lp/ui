import { NextRequest, NextResponse } from 'next/server'
import { prismaMonitoring } from '@/lib/prisma-monitoring'
import { positionFetcher } from '@/utils'

export async function GET(request: NextRequest, { params }: { params: Promise<{ account: string }> }) {
    try {
        const { account } = await params
        const accountAddress = account.toLowerCase()

        // Get the monitored account
        const monitoredAccount = await prismaMonitoring.monitoredAccount.findUnique({
            where: {
                address: accountAddress,
            },
        })

        // If account is not monitored, fetch data directly from blockchain
        if (!monitoredAccount) {
            try {
                // Use optimized position fetcher with batching
                const {
                    lpData: lpPositions,
                    spotData: spotBalances,
                    perpData: perpPositions,
                } = await positionFetcher.fetchAllPositions(accountAddress)

                // Calculate totals
                const totalLpValue = lpPositions.reduce((sum, p) => sum + p.valueUSD, 0)
                const totalSpotValue = spotBalances.reduce((sum, b) => sum + b.valueUSD, 0)
                const totalPerpValue = perpPositions.reduce((sum, p) => sum + p.notionalValue, 0)

                // Calculate delta exposures - use actual WHYPE amounts from LP positions
                const lpDelta = lpPositions.reduce((sum, p) => {
                    // For each LP position, calculate WHYPE exposure
                    const token0IsHype = p.token0Symbol === 'WHYPE' || p.token0Symbol === 'HYPE'
                    const token1IsHype = p.token1Symbol === 'WHYPE' || p.token1Symbol === 'HYPE'

                    if (token0IsHype && p.token0ValueUSD) {
                        return sum + p.token0ValueUSD
                    } else if (token1IsHype && p.token1ValueUSD) {
                        return sum + p.token1ValueUSD
                    }
                    return sum
                }, 0)
                const spotDelta = spotBalances.filter((b) => b.asset === 'HYPE').reduce((sum, b) => sum + b.valueUSD, 0)
                const perpDelta = perpPositions
                    .filter((p) => p.asset === 'HYPE') // Only HYPE positions affect HYPE delta
                    .reduce((sum, p) => {
                        // Negative size means short position (negative delta)
                        return sum + p.size * p.markPrice
                    }, 0)
                const netDelta = lpDelta + spotDelta + perpDelta

                // Calculate APR components (annualized)
                // Note: These are placeholder calculations - actual APR needs historical data
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

                // Return response for non-monitored accounts with cache headers
                return NextResponse.json(
                    {
                        success: true,
                        account: {
                            address: accountAddress,
                            name: null,
                            isActive: false,
                        },
                        positions: {
                            lp: lpPositions.map((p) => ({
                                ...p,
                                feeTier: p.fee ? `${(p.fee / 10000).toFixed(2)}%` : null,
                            })),
                            perp: perpPositions,
                            spot: spotBalances,
                        },
                        summary: {
                            totalLpValue,
                            totalPerpValue,
                            totalSpotValue,
                            totalValue: totalLpValue + totalPerpValue + totalSpotValue,
                            netDelta,
                            lpDelta,
                            perpDelta,
                            spotDelta,
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
                            'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=120',
                        },
                    },
                )
            } catch (error) {
                console.error('Error fetching spot balances:', error)
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Failed to fetch spot balances from blockchain',
                    },
                    { status: 500 },
                )
            }
        }

        // Get LP positions from database - note these have limited fields
        const lpPositionsFromDb = await prismaMonitoring.lpPosition.findMany({
            where: {
                accountId: monitoredAccount.id,
            },
        })

        // Get perp positions
        const perpPositions = await prismaMonitoring.perpPosition.findMany({
            where: {
                accountId: monitoredAccount.id,
            },
        })

        // Get spot balances
        const spotBalances = await prismaMonitoring.spotBalance.findMany({
            where: {
                accountId: monitoredAccount.id,
            },
        })

        // Get latest account snapshot for summary
        const latestSnapshot = await prismaMonitoring.accountSnapshot.findFirst({
            where: {
                accountId: monitoredAccount.id,
            },
            orderBy: { timestamp: 'desc' },
        })

        // Calculate summary metrics
        const totalLpValue = lpPositionsFromDb.reduce((sum, p) => sum + p.valueUSD.toNumber(), 0)
        const totalPerpValue = perpPositions.reduce((sum, p) => {
            const notionalValue = Math.abs(p.szi.toNumber() * p.markPx.toNumber())
            return sum + notionalValue
        }, 0)
        const totalSpotValue = spotBalances.reduce((sum, b) => sum + b.valueUSD.toNumber(), 0)

        // Calculate delta exposures - for monitored accounts, estimate based on 50/50 assumption
        // since we don't have token amounts stored in the database
        const lpDelta = lpPositionsFromDb.reduce((sum, p) => {
            // Check if this is a HYPE/USDT0 pair
            const hasHype = p.token0Symbol === 'WHYPE' || p.token0Symbol === 'HYPE' || p.token1Symbol === 'WHYPE' || p.token1Symbol === 'HYPE'
            if (hasHype) {
                // Assume 50% exposure for in-range positions, 0% for out-of-range
                return sum + (p.inRange ? p.valueUSD.toNumber() * 0.5 : 0)
            }
            return sum
        }, 0)
        const perpDelta = perpPositions
            .filter((p) => p.asset === 'HYPE') // Only HYPE positions affect HYPE delta
            .reduce((sum, p) => {
                // Negative size means short position (negative delta)
                return sum + p.szi.toNumber() * p.markPx.toNumber()
            }, 0)
        const spotDelta = spotBalances.filter((b) => b.asset === 'HYPE').reduce((sum, b) => sum + b.valueUSD.toNumber(), 0)

        const netDelta = lpDelta + perpDelta + spotDelta

        // Calculate APR components for monitored accounts
        const fundingAPR = perpPositions
            .filter((p) => p.asset === 'HYPE')
            .reduce((sum, p) => {
                // For shorts, positive funding rate means earning
                const dailyFunding = p.fundingPaid.toNumber() / 30 // Rough estimate
                const notional = Math.abs(p.szi.toNumber() * p.markPx.toNumber())
                return sum + (notional > 0 ? (dailyFunding / notional) * 365 : 0)
            }, 0)

        // Format response
        const response = {
            success: true,
            account: {
                address: monitoredAccount.address,
                name: monitoredAccount.name,
                isActive: monitoredAccount.isActive,
            },
            positions: {
                lp: lpPositionsFromDb.map((p) => ({
                    id: p.id,
                    tokenId: p.tokenId,
                    dex: p.dex,
                    token0: null, // Not stored in DB
                    token1: null, // Not stored in DB
                    token0Symbol: p.token0Symbol,
                    token1Symbol: p.token1Symbol,
                    fee: p.feeTier || undefined, // Use feeTier from DB
                    tickLower: p.tickLower,
                    tickUpper: p.tickUpper,
                    liquidity: p.liquidity.toString(),
                    valueUSD: p.valueUSD.toNumber(),
                    inRange: p.inRange,
                    feeTier: p.feeTier ? `${(p.feeTier / 10000).toFixed(2)}%` : null,
                    token0Amount: undefined, // Not stored in DB
                    token1Amount: undefined, // Not stored in DB
                    token0ValueUSD: undefined, // Not stored in DB
                    token1ValueUSD: undefined, // Not stored in DB
                })),
                perp: perpPositions.map((p) => ({
                    id: p.id,
                    asset: p.asset,
                    size: p.szi.toNumber(),
                    entryPrice: p.entryPx.toNumber(),
                    markPrice: p.markPx.toNumber(),
                    marginUsed: p.marginUsed.toNumber(),
                    unrealizedPnl: p.unrealizedPnl.toNumber(),
                    fundingPaid: p.fundingPaid.toNumber(),
                    notionalValue: Math.abs(p.szi.toNumber() * p.markPx.toNumber()),
                })),
                spot: spotBalances.map((b) => ({
                    id: b.id,
                    asset: b.asset,
                    balance: b.balance,
                    valueUSD: b.valueUSD.toNumber(),
                })),
            },
            summary: {
                totalLpValue,
                totalPerpValue,
                totalSpotValue,
                totalValue: totalLpValue + totalPerpValue + totalSpotValue,
                netDelta,
                lpDelta,
                perpDelta,
                spotDelta,
                lastSnapshot: latestSnapshot
                    ? {
                          timestamp: latestSnapshot.timestamp,
                          netAPR: latestSnapshot.netAPR.toNumber(),
                          lpFeeAPR: latestSnapshot.lpFeeAPR.toNumber(),
                          fundingAPR: latestSnapshot.fundingAPR.toNumber(),
                      }
                    : null,
                currentAPR: latestSnapshot
                    ? {
                          lpFeeAPR: latestSnapshot.lpFeeAPR.toNumber(),
                          fundingAPR,
                          netAPR: latestSnapshot.lpFeeAPR.toNumber() + fundingAPR,
                          formula: 'Net APR = LP Fee APR + Funding APR',
                          note: 'LP Fee APR from snapshot, Funding APR estimated from 30-day average',
                      }
                    : {
                          lpFeeAPR: 0, // No historical data for LP fees yet
                          fundingAPR,
                          netAPR: fundingAPR,
                          formula: 'Net APR = LP Fee APR + Funding APR',
                          note: 'Funding APR estimated from 30-day average. LP fee tracking requires historical data.',
                      },
            },
        }

        return NextResponse.json(response, {
            headers: {
                'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=120',
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
