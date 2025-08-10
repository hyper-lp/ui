import { NextRequest, NextResponse } from 'next/server'
import { prismaMonitoring } from '@/lib/prisma-monitoring'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const accountAddress = searchParams.get('account') || searchParams.get('wallet')
        const days = parseInt(searchParams.get('days') || '30')

        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        // Get account if specified
        let accountId: string | undefined
        if (accountAddress) {
            const account = await prismaMonitoring.monitoredAccount.findUnique({
                where: { address: accountAddress },
            })
            if (!account) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Account not found',
                    },
                    { status: 404 },
                )
            }
            accountId = account.id
        }

        // Get LP positions with current value
        const lpPositions = await prismaMonitoring.lpPosition.findMany({
            where: accountId ? { accountId } : {},
        })

        // Get perp positions
        const perpPositions = await prismaMonitoring.perpPosition.findMany({
            where: accountId ? { accountId } : {},
        })

        // Get account snapshots for historical data
        const snapshots = await prismaMonitoring.accountSnapshot.findMany({
            where: {
                ...(accountId ? { accountId } : {}),
                timestamp: {
                    gte: startDate,
                },
            },
            orderBy: { timestamp: 'asc' },
        })

        // Calculate PnL metrics
        let totalUnrealizedPnl = 0
        const totalRealizedPnl = 0
        let totalFundingPaid = 0

        // Sum up perp PnL
        for (const perp of perpPositions) {
            totalUnrealizedPnl += perp.unrealizedPnl.toNumber()
            totalFundingPaid += perp.fundingPaid.toNumber()
        }

        // Calculate LP fees earned (simplified - using snapshots)
        let totalLpFeesEarned = 0
        if (snapshots.length > 0) {
            // Estimate fees based on APR and time period
            for (let i = 1; i < snapshots.length; i++) {
                const prevSnapshot = snapshots[i - 1]
                const currSnapshot = snapshots[i]
                const timeDiffHours = (currSnapshot.timestamp.getTime() - prevSnapshot.timestamp.getTime()) / (1000 * 60 * 60)
                const avgLpValue = (prevSnapshot.lpValue.toNumber() + currSnapshot.lpValue.toNumber()) / 2
                const avgFeeAPR = (prevSnapshot.lpFeeAPR.toNumber() + currSnapshot.lpFeeAPR.toNumber()) / 2

                // Convert APR to hourly rate and calculate fees
                const feesEarned = avgLpValue * avgFeeAPR * (timeDiffHours / (365 * 24))
                totalLpFeesEarned += feesEarned
            }
        }

        // Get current total values
        const currentLpValue = lpPositions.reduce((sum, p) => sum + p.valueUSD.toNumber(), 0)
        const currentPerpValue = perpPositions.reduce((sum, p) => {
            return sum + p.marginUsed.toNumber() + p.unrealizedPnl.toNumber()
        }, 0)

        // Calculate returns
        const totalValue = currentLpValue + currentPerpValue
        const totalPnl = totalUnrealizedPnl + totalRealizedPnl + totalLpFeesEarned - totalFundingPaid
        const returnPercentage = totalValue > 0 ? (totalPnl / totalValue) * 100 : 0

        // Prepare time series data
        const timeSeriesData = snapshots.map((snapshot) => ({
            timestamp: snapshot.timestamp,
            lpValue: snapshot.lpValue.toNumber(),
            perpValue: snapshot.perpValue.toNumber(),
            totalValue: snapshot.lpValue.toNumber() + snapshot.perpValue.toNumber() + snapshot.spotValue.toNumber(),
            netDelta: snapshot.netDelta.toNumber(),
            netAPR: snapshot.netAPR.toNumber(),
        }))

        return NextResponse.json({
            success: true,
            pnl: {
                unrealizedPnl: totalUnrealizedPnl,
                realizedPnl: totalRealizedPnl,
                lpFeesEarned: totalLpFeesEarned,
                fundingPaid: totalFundingPaid,
                totalPnl,
                returnPercentage,
            },
            currentValues: {
                lpValue: currentLpValue,
                perpValue: currentPerpValue,
                totalValue,
            },
            positions: {
                lpCount: lpPositions.length,
                perpCount: perpPositions.length,
                activePerps: perpPositions.length,
            },
            timeSeries: timeSeriesData,
            period: {
                days,
                startDate,
                endDate: new Date(),
            },
        })
    } catch (error) {
        console.error('Error calculating PnL:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to calculate PnL',
            },
            { status: 500 },
        )
    }
}
