import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hedgeMonitorService } from '@/services/03-hedge-monitor.service'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const walletAddress = searchParams.get('wallet')

        if (walletAddress) {
            // Get delta drift for specific wallet
            const rebalanceCheck = await hedgeMonitorService.checkRebalanceNeeded(walletAddress)

            return NextResponse.json({
                wallet: walletAddress,
                needsRebalance: rebalanceCheck.needed,
                currentDrift: rebalanceCheck.currentDrift,
                lpDelta: rebalanceCheck.lpDelta,
                hedgeDelta: rebalanceCheck.hedgeDelta,
                netDelta: rebalanceCheck.lpDelta + rebalanceCheck.hedgeDelta,
            })
        }

        // Get delta drift for all monitored wallets
        const wallets = await prisma.monitoredWallet.findMany({
            where: { isActive: true },
        })

        const driftData = await Promise.all(
            wallets.map(async (wallet) => {
                const check = await hedgeMonitorService.checkRebalanceNeeded(wallet.address)
                return {
                    wallet: wallet.address,
                    name: wallet.name,
                    needsRebalance: check.needed,
                    currentDrift: check.currentDrift,
                    lpDelta: check.lpDelta,
                    hedgeDelta: check.hedgeDelta,
                    netDelta: check.lpDelta + check.hedgeDelta,
                }
            }),
        )

        return NextResponse.json({
            wallets: driftData,
            summary: {
                totalWallets: wallets.length,
                needingRebalance: driftData.filter((d) => d.needsRebalance).length,
                averageDrift: driftData.reduce((sum, d) => sum + d.currentDrift, 0) / driftData.length,
            },
        })
    } catch (error) {
        console.error('Error fetching delta drift:', error)
        return NextResponse.json({ error: 'Failed to fetch delta drift' }, { status: 500 })
    }
}
