import { NextRequest, NextResponse } from 'next/server'
import { prismaMonitoring } from '@/lib/prisma-monitoring'
import { positionFetcher } from '@/utils/position-fetcher.util'

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
                const { lpData: lpPositions, spotData: spotBalances } = await positionFetcher.fetchAllPositions(accountAddress)

                // Calculate totals
                const totalLpValue = lpPositions.reduce((sum, p) => sum + p.valueUSD, 0)
                const totalSpotValue = spotBalances.reduce((sum, b) => sum + b.valueUSD, 0)

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
                            perp: [],
                            spot: spotBalances,
                        },
                        summary: {
                            totalLpValue,
                            totalPerpValue: 0,
                            totalSpotValue,
                            totalValue: totalLpValue + totalSpotValue,
                            netDelta: totalLpValue * 0.5, // Rough estimate
                            lpDelta: totalLpValue * 0.5, // Assume 50% HYPE exposure in LP
                            perpDelta: 0,
                            spotDelta: spotBalances.filter((b) => b.asset === 'HYPE').reduce((sum, b) => sum + b.valueUSD, 0),
                            lastSnapshot: null,
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

        // Get LP positions
        const lpPositions = await prismaMonitoring.lpPosition.findMany({
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
        const totalLpValue = lpPositions.reduce((sum, p) => sum + p.valueUSD.toNumber(), 0)
        const totalPerpValue = perpPositions.reduce((sum, p) => {
            const notionalValue = Math.abs(p.szi.toNumber() * p.markPx.toNumber())
            return sum + notionalValue
        }, 0)
        const totalSpotValue = spotBalances.reduce((sum, b) => sum + b.valueUSD.toNumber(), 0)

        // Calculate delta exposures
        const lpDelta = totalLpValue * 0.5 // Simplified: assume 50% HYPE exposure in LP
        const perpDelta = perpPositions.reduce((sum, p) => {
            return sum + p.szi.toNumber() * p.markPx.toNumber()
        }, 0)
        const spotDelta = spotBalances.filter((b) => b.asset === 'HYPE').reduce((sum, b) => sum + b.valueUSD.toNumber(), 0)

        const netDelta = lpDelta + perpDelta + spotDelta

        // Format response
        const response = {
            success: true,
            account: {
                address: monitoredAccount.address,
                name: monitoredAccount.name,
                isActive: monitoredAccount.isActive,
            },
            positions: {
                lp: lpPositions.map((p) => ({
                    id: p.id,
                    tokenId: p.tokenId,
                    dex: p.dex,
                    token0Symbol: p.token0Symbol,
                    token1Symbol: p.token1Symbol,
                    liquidity: p.liquidity,
                    valueUSD: p.valueUSD.toNumber(),
                    inRange: p.inRange,
                    feeTier: p.feeTier ? `${(p.feeTier / 10000).toFixed(2)}%` : null,
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
