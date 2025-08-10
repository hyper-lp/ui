import { NextRequest, NextResponse } from 'next/server'
import { withApiAuth } from '@/middleware/api-auth'
import { perpMonitorService } from '@/services/03-perp-monitor.service'
import { prismaMonitoring } from '@/lib/prisma-monitoring'

export const maxDuration = 60 // 60 seconds for Vercel

/**
 * Sync perpetual positions from HyperCore for specified accounts
 * POST /api/internal/sync/hypercore/perp
 * Body: { accounts: string[] }
 */
export const POST = withApiAuth(async (request: NextRequest) => {
    const startTime = Date.now()

    try {
        const body = await request.json()
        const { accounts } = body as { accounts: string[] }

        if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid request - accounts array required',
                },
                { status: 400 },
            )
        }

        console.log(`[HyperCore Perp Sync] Processing ${accounts.length} accounts`)

        const results = {
            processed: 0,
            positionsFound: 0,
            totalPerpValue: 0,
            errors: [] as string[],
            accountResults: [] as Array<{
                address: string
                positionsFound: number
                totalValue: number
                positions: Array<{
                    asset: string
                    size: number
                    markPrice: number
                    entryPrice: number
                    unrealizedPnl: number
                }>
            }>,
        }

        // Process each account
        for (const accountAddress of accounts) {
            try {
                // Get monitored account
                const account = await prismaMonitoring.monitoredAccount.findUnique({
                    where: { address: accountAddress.toLowerCase() },
                })

                if (!account) {
                    console.log(`[HyperCore Perp Sync] Account not found: ${accountAddress}`)
                    results.errors.push(`Account ${accountAddress} not monitored`)
                    continue
                }

                // Skip if account doesn't have HyperCore activity
                if (!account.hasHyperCore) {
                    console.log(`[HyperCore Perp Sync] Skipping ${accountAddress} - no HyperCore activity`)
                    continue
                }

                // Use the platform-specific address if configured
                const coreAddress = account.hyperCoreAddress || account.address

                // Fetch and store perp positions
                const perpPositions = await perpMonitorService.fetchAndStorePerpPositions(account, coreAddress)

                // Calculate total value
                const totalValue = perpPositions.reduce((sum: number, p) => {
                    const notionalValue = Math.abs(p.szi.toNumber() * p.markPx.toNumber())
                    return sum + notionalValue
                }, 0)

                results.processed++
                results.positionsFound += perpPositions.length
                results.totalPerpValue += totalValue
                results.accountResults.push({
                    address: accountAddress,
                    positionsFound: perpPositions.length,
                    totalValue,
                    positions: perpPositions.map((p) => ({
                        asset: p.asset,
                        size: p.szi.toNumber(),
                        markPrice: p.markPx.toNumber(),
                        entryPrice: p.entryPx.toNumber(),
                        unrealizedPnl: p.unrealizedPnl.toNumber(),
                    })),
                })

                console.log(`[HyperCore Perp Sync] ${accountAddress}: Found ${perpPositions.length} positions, value: $${totalValue.toFixed(2)}`)
            } catch (error) {
                const errorMsg = `Failed to sync ${accountAddress}: ${error instanceof Error ? error.message : 'Unknown error'}`
                console.error(`[HyperCore Perp Sync] ${errorMsg}`)
                results.errors.push(errorMsg)
            }
        }

        const duration = Date.now() - startTime

        return NextResponse.json({
            success: true,
            platform: 'hyperCore',
            syncType: 'perp',
            duration: `${duration}ms`,
            results,
        })
    } catch (error) {
        console.error('[HyperCore Perp Sync] Fatal error:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 },
        )
    }
})

/**
 * Get perp positions for accounts
 * GET /api/internal/sync/hypercore/perp?accounts=addr1,addr2
 */
export const GET = withApiAuth(async (request: NextRequest) => {
    try {
        const url = new URL(request.url)
        const accountsParam = url.searchParams.get('accounts')

        if (!accountsParam) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'accounts parameter required',
                },
                { status: 400 },
            )
        }

        const accounts = accountsParam.split(',').map((a) => a.trim().toLowerCase())

        // Get perp positions for these accounts
        const positions = await prismaMonitoring.perpPosition.findMany({
            where: {
                account: {
                    address: { in: accounts },
                },
            },
            include: {
                account: {
                    select: {
                        address: true,
                        name: true,
                    },
                },
            },
        })

        // Get current funding rates
        const fundingRates = await perpMonitorService.fetchFundingRates()

        return NextResponse.json({
            success: true,
            platform: 'hyperCore',
            dataType: 'perpPositions',
            count: positions.length,
            fundingRates,
            positions: positions.map((p) => ({
                accountAddress: p.account.address,
                accountName: p.account.name,
                asset: p.asset,
                size: p.szi.toNumber(),
                entryPrice: p.entryPx.toNumber(),
                markPrice: p.markPx.toNumber(),
                marginUsed: p.marginUsed.toNumber(),
                unrealizedPnl: p.unrealizedPnl.toNumber(),
                fundingPaid: p.fundingPaid.toNumber(),
                notionalValue: Math.abs(p.szi.toNumber() * p.markPx.toNumber()),
                deltaContribution: p.szi.toNumber() * p.markPx.toNumber(),
            })),
        })
    } catch (error) {
        console.error('[HyperCore Perp Get] Error:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 },
        )
    }
})
