import { NextRequest, NextResponse } from 'next/server'
import { prismaMonitoring } from '@/lib/prisma-monitoring'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const accountAddress = searchParams.get('account')
        const days = parseInt(searchParams.get('days') || '7')
        const limit = parseInt(searchParams.get('limit') || '100')

        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        // Get account snapshots for the specified time period
        const snapshots = await prismaMonitoring.accountSnapshot.findMany({
            where: {
                timestamp: {
                    gte: startDate,
                },
                ...(accountAddress
                    ? {
                          account: {
                              address: accountAddress,
                          },
                      }
                    : {}),
            },
            orderBy: { timestamp: 'desc' },
            take: limit,
            include: {
                account: true,
            },
        })

        // Format the data for the frontend
        const formattedData = snapshots.map((snapshot) => ({
            id: snapshot.id,
            timestamp: snapshot.timestamp,
            accountAddress: snapshot.account.address,
            accountName: snapshot.account.name,
            lpValue: snapshot.lpValue.toNumber(),
            perpValue: snapshot.perpValue.toNumber(),
            spotValue: snapshot.spotValue.toNumber(),
            totalValue: snapshot.lpValue.toNumber() + snapshot.perpValue.toNumber() + snapshot.spotValue.toNumber(),
            netDelta: snapshot.netDelta.toNumber(),
            lpFeeAPR: snapshot.lpFeeAPR.toNumber(),
            fundingAPR: snapshot.fundingAPR.toNumber(),
            netAPR: snapshot.netAPR.toNumber(),
        }))

        // Calculate summary statistics
        const summary = {
            totalSnapshots: formattedData.length,
            accounts: [...new Set(formattedData.map((s) => s.accountAddress))].length,
            averageValue: formattedData.reduce((sum, s) => sum + s.totalValue, 0) / (formattedData.length || 1),
            averageAPR: formattedData.reduce((sum, s) => sum + s.netAPR, 0) / (formattedData.length || 1),
            maxValue: Math.max(...formattedData.map((s) => s.totalValue), 0),
            minValue: Math.min(...formattedData.map((s) => s.totalValue), 0),
        }

        return NextResponse.json({
            success: true,
            data: formattedData,
            summary,
        })
    } catch (error) {
        console.error('Error fetching analytics history:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch analytics history',
            },
            { status: 500 },
        )
    }
}
