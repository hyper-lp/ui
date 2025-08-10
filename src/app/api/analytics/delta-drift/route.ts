import { NextRequest, NextResponse } from 'next/server'
import { prismaMonitoring } from '@/lib/prisma-monitoring'
import { perpMonitorService } from '@/services/03-perp-monitor.service'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const accountAddress = searchParams.get('account')

        if (accountAddress) {
            // Get delta drift for specific account
            const rebalanceCheck = await perpMonitorService.checkRebalanceNeeded(accountAddress)

            return NextResponse.json({
                account: accountAddress,
                needsRebalance: rebalanceCheck.needed,
                currentDrift: rebalanceCheck.currentDrift,
                lpDelta: rebalanceCheck.lpDelta,
                perpDelta: rebalanceCheck.perpDelta,
                netDelta: rebalanceCheck.lpDelta + rebalanceCheck.perpDelta,
            })
        }

        // Get delta drift for all monitored accounts
        const accounts = await prismaMonitoring.monitoredAccount.findMany({
            where: { isActive: true },
        })

        const driftData = await Promise.all(
            accounts.map(async (account) => {
                const check = await perpMonitorService.checkRebalanceNeeded(account.address)
                return {
                    account: account.address,
                    name: account.name,
                    needsRebalance: check.needed,
                    currentDrift: check.currentDrift,
                    lpDelta: check.lpDelta,
                    perpDelta: check.perpDelta,
                    netDelta: check.lpDelta + check.perpDelta,
                }
            }),
        )

        return NextResponse.json({
            accounts: driftData,
            summary: {
                totalAccounts: accounts.length,
                needingRebalance: driftData.filter((d) => d.needsRebalance).length,
                averageDrift: driftData.reduce((sum, d) => sum + d.currentDrift, 0) / driftData.length,
            },
        })
    } catch (error) {
        console.error('Error fetching delta drift:', error)
        return NextResponse.json({ error: 'Failed to fetch delta drift' }, { status: 500 })
    }
}
