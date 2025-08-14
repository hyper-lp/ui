import { NextRequest, NextResponse } from 'next/server'
import { withApiAuth } from '@/middleware/api-auth'
import { prismaMonitoring } from '@/lib/prisma-monitoring'
import { hyperCoreSpotMonitor } from '@/services/monitors'

export const maxDuration = 60 // 60 seconds for Vercel

/**
 * Sync spot balances from HyperCore for specified accounts
 * POST /api/internal/sync/hypercore/spot
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

        console.log(`[HyperCore Spot Sync] Processing ${accounts.length} accounts`)

        const results = {
            processed: 0,
            balancesFound: 0,
            totalSpotValue: 0,
            errors: [] as string[],
            accountResults: [] as Array<{
                address: string
                balancesFound: number
                totalValue: number
                balances: Array<{
                    coin: string
                    balance: number
                    valueUSD: number
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
                    console.log(`[HyperCore Spot Sync] Account not found: ${accountAddress}`)
                    results.errors.push(`Account ${accountAddress} not monitored`)
                    continue
                }

                // Skip if account doesn't have HyperCore activity
                if (!account.hasHyperCore) {
                    console.log(`[HyperCore Spot Sync] Skipping ${accountAddress} - no HyperCore activity`)
                    continue
                }

                // Use the platform-specific address if configured
                // const coreAddress = account.hyperCoreAddress || account.address

                // Fetch and store spot balances using the monitor service
                const balances = await hyperCoreSpotMonitor.updateAccountBalances(account)

                const accountTotalValue = balances.reduce((sum, b) => sum + b.valueUSD, 0)
                results.balancesFound += balances.length

                results.processed++
                results.totalSpotValue += accountTotalValue
                results.accountResults.push({
                    address: accountAddress,
                    balancesFound: balances.length,
                    totalValue: accountTotalValue,
                    balances: balances.map((b) => ({
                        coin: b.asset,
                        balance: typeof b.balance === 'number' ? b.balance : parseFloat(b.balance.toString()),
                        valueUSD: b.valueUSD,
                    })),
                })

                console.log(`[HyperCore Spot Sync] ${accountAddress}: Found ${balances.length} balances, value: $${accountTotalValue.toFixed(2)}`)
            } catch (error) {
                const errorMsg = `Failed to sync ${accountAddress}: ${error instanceof Error ? error.message : 'Unknown error'}`
                console.error(`[HyperCore Spot Sync] ${errorMsg}`)
                results.errors.push(errorMsg)
            }
        }

        const duration = Date.now() - startTime

        return NextResponse.json({
            success: true,
            platform: 'hyperCore',
            syncType: 'spot',
            duration: `${duration}ms`,
            results,
        })
    } catch (error) {
        console.error('[HyperCore Spot Sync] Fatal error:', error)
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
 * Get spot balances for accounts
 * GET /api/internal/sync/hypercore/spot?accounts=addr1,addr2
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

        // Get spot balances for these accounts
        const balances = await prismaMonitoring.spotBalance.findMany({
            where: {
                account: {
                    address: { in: accounts },
                },
                balance: { gt: 0 }, // Only return non-zero balances
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
            platform: 'hyperCore',
            dataType: 'spotBalances',
            count: balances.length,
            balances: balances.map((b) => ({
                accountAddress: b.account.address,
                accountName: b.account.name,
                asset: b.asset,
                balance: b.balance.toNumber(),
                valueUSD: b.valueUSD.toNumber(),
            })),
        })
    } catch (error) {
        console.error('[HyperCore Spot Get] Error:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 },
        )
    }
})
