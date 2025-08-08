import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const walletAddress = searchParams.get('wallet')
        const days = parseInt(searchParams.get('days') || '7')
        const limit = parseInt(searchParams.get('limit') || '100')

        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        // Get position snapshots
        const positionSnapshots = await prisma.positionSnapshot.findMany({
            where: {
                timestamp: {
                    gte: startDate,
                },
                ...(walletAddress
                    ? {
                          position: {
                              ownerAddress: {
                                  equals: walletAddress,
                                  mode: 'insensitive',
                              },
                          },
                      }
                    : {}),
            },
            orderBy: { timestamp: 'desc' },
            take: limit,
            include: {
                position: true,
            },
        })

        // Get hedge snapshots if wallet specified
        let hedgeSnapshots: Awaited<ReturnType<typeof prisma.hedgeSnapshot.findMany>> = []
        if (walletAddress) {
            hedgeSnapshots = await prisma.hedgeSnapshot.findMany({
                where: {
                    timestamp: {
                        gte: startDate,
                    },
                    hedgePosition: {
                        walletAddress: {
                            equals: walletAddress,
                            mode: 'insensitive',
                        },
                    },
                },
                orderBy: { timestamp: 'desc' },
                take: limit,
                include: {
                    hedgePosition: true,
                },
            })
        }

        // Group snapshots by timestamp (roughly) for time series
        const snapshotsByHour = new Map<string, typeof positionSnapshots>()

        for (const snapshot of positionSnapshots) {
            const hourKey = new Date(snapshot.timestamp).toISOString().slice(0, 13) // Group by hour
            if (!snapshotsByHour.has(hourKey)) {
                snapshotsByHour.set(hourKey, [])
            }
            snapshotsByHour.get(hourKey)!.push(snapshot)
        }

        // Format time series data
        const timeSeries = Array.from(snapshotsByHour.entries())
            .map(([hourKey, snapshots]) => {
                const totalValueUSD = snapshots.reduce((sum, s) => sum + s.totalValueUSD, 0)
                const totalUnclaimedFeesUSD = snapshots.reduce((sum, s) => sum + s.unclaimedFeesUSD, 0)
                const averageFeeAPR = snapshots.reduce((sum, s) => sum + s.feeAPR, 0) / snapshots.length
                const positionsInRange = snapshots.filter((s) => s.inRange).length

                // Group by DEX
                const byDex: Record<string, { count: number; value: number; apr: number }> = {}
                for (const snapshot of snapshots) {
                    const dex = snapshot.position.dex
                    if (!byDex[dex]) {
                        byDex[dex] = { count: 0, value: 0, apr: 0 }
                    }
                    byDex[dex].count++
                    byDex[dex].value += snapshot.totalValueUSD
                    byDex[dex].apr = (byDex[dex].apr * (byDex[dex].count - 1) + snapshot.feeAPR) / byDex[dex].count
                }

                return {
                    timestamp: new Date(hourKey + ':00:00.000Z'),
                    totalValueUSD,
                    totalUnclaimedFeesUSD,
                    averageFeeAPR,
                    positionsInRange,
                    totalPositions: snapshots.length,
                    dexBreakdown: byDex,
                    positionSnapshots: snapshots,
                }
            })
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

        return NextResponse.json({
            wallet: walletAddress,
            period: {
                start: startDate,
                end: new Date(),
                days,
            },
            timeSeries,
            hedgeSnapshots,
            summary: {
                dataPoints: timeSeries.length,
                latestRun: timeSeries[0],
                averageValue: timeSeries.reduce((sum, t) => sum + t.totalValueUSD, 0) / timeSeries.length,
                averageAPR: timeSeries.reduce((sum, t) => sum + t.averageFeeAPR, 0) / timeSeries.length,
            },
        })
    } catch (error) {
        console.error('Error fetching analytics history:', error)
        return NextResponse.json({ error: 'Failed to fetch analytics history' }, { status: 500 })
    }
}
