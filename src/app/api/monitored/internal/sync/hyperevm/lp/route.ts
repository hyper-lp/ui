import { NextRequest, NextResponse } from 'next/server'
import { withApiAuth } from '@/middleware/api-auth'
import { lpMonitorService } from '@/services/monitoring'
import { prismaMonitoring } from '@/lib/prisma-monitoring'

export const maxDuration = 60 // 60 seconds for Vercel

/**
 * Sync LP positions from HyperEVM for specified accounts
 * POST /api/internal/sync/hyperevm/lp
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

        console.log(`[HyperEVM LP Sync] Processing ${accounts.length} accounts`)

        const results = {
            processed: 0,
            positionsFound: 0,
            errors: [] as string[],
            accountResults: [] as Array<{
                address: string
                positionsFound: number
                poolsChecked: number
            }>,
        }

        // Process each account
        for (const accountAddress of accounts) {
            try {
                // Get or create monitored account
                const account = await prismaMonitoring.monitoredAccount.findUnique({
                    where: { address: accountAddress.toLowerCase() },
                })

                if (!account) {
                    console.log(`[HyperEVM LP Sync] Account not found: ${accountAddress}`)
                    results.errors.push(`Account ${accountAddress} not monitored`)
                    continue
                }

                // Skip if account doesn't have HyperEVM activity
                if (!account.hasHyperEvm) {
                    console.log(`[HyperEVM LP Sync] Skipping ${accountAddress} - no HyperEVM activity`)
                    continue
                }

                // Use the platform-specific address if configured
                const evmAddress = account.hyperEvmAddress || account.address

                // Discover LP positions
                const discoveryResult = await lpMonitorService.discoverPositionsForAccount(evmAddress)

                results.processed++
                results.positionsFound += discoveryResult.positionsFound
                results.accountResults.push({
                    address: accountAddress,
                    positionsFound: discoveryResult.positionsFound,
                    poolsChecked: discoveryResult.poolsChecked,
                })

                console.log(`[HyperEVM LP Sync] ${accountAddress}: Found ${discoveryResult.positionsFound} positions`)
            } catch (error) {
                const errorMsg = `Failed to sync ${accountAddress}: ${error instanceof Error ? error.message : 'Unknown error'}`
                console.error(`[HyperEVM LP Sync] ${errorMsg}`)
                results.errors.push(errorMsg)
            }
        }

        const duration = Date.now() - startTime

        return NextResponse.json({
            success: true,
            platform: 'hyperEvm',
            syncType: 'lp',
            duration: `${duration}ms`,
            results,
        })
    } catch (error) {
        console.error('[HyperEVM LP Sync] Fatal error:', error)
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
 * Get LP positions for accounts
 * GET /api/internal/sync/hyperevm/lp?accounts=addr1,addr2
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

        // Get LP positions for these accounts
        const positions = await prismaMonitoring.lpPosition.findMany({
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

        return NextResponse.json({
            success: true,
            platform: 'hyperEvm',
            dataType: 'lpPositions',
            count: positions.length,
            positions: positions.map((p) => ({
                accountAddress: p.account.address,
                accountName: p.account.name,
                tokenId: p.tokenId,
                dex: p.dex,
                token0: p.token0Symbol,
                token1: p.token1Symbol,
                valueUSD: p.valueUSD.toNumber(),
                inRange: p.inRange,
                feeTier: p.feeTier,
                liquidity: p.liquidity.toString(),
            })),
        })
    } catch (error) {
        console.error('[HyperEVM LP Get] Error:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 },
        )
    }
})
