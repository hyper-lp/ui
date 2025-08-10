import { NextRequest, NextResponse } from 'next/server'
import { withApiAuth } from '@/middleware/api-auth'
import { prismaMonitoring } from '@/lib/prisma-monitoring'
import { Asset } from '@prisma/client-monitoring'
import { getTokenPrice } from '@/utils/token-prices.util'
import { HYPEREVM_CHAIN_ID } from '@/lib/viem'

export const maxDuration = 60 // 60 seconds for Vercel

// Token addresses on HyperCore
const TOKEN_ADDRESSES = {
    HYPE: '0x0000000000000000000000000000000000000000',
    USDT0: '0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb',
    USDC: '0x02c6a2fa58cc01a18b8d9e00ea48d65e4df26c70', // feUSD as USDC proxy
}

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
                const coreAddress = account.hyperCoreAddress || account.address

                // Fetch spot balances from HyperCore API
                const response = await fetch(`https://api.hyperliquid.xyz/info`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'spotClearinghouseState',
                        user: coreAddress,
                    }),
                })

                const data = await response.json()
                const balances = data.balances || []

                let accountTotalValue = 0
                const processedBalances = []

                // Process each balance
                for (const balance of balances) {
                    const { coin, hold, total } = balance
                    const totalBalance = parseFloat(total)

                    if (totalBalance <= 0) continue

                    // Get token price
                    const tokenAddress = TOKEN_ADDRESSES[coin as keyof typeof TOKEN_ADDRESSES]
                    if (!tokenAddress) {
                        console.log(`[HyperCore Spot Sync] Unknown token: ${coin}`)
                        continue
                    }

                    const price = await getTokenPrice(tokenAddress as `0x${string}`, HYPEREVM_CHAIN_ID)
                    const valueUSD = totalBalance * price

                    // Upsert spot balance
                    await prismaMonitoring.spotBalance.upsert({
                        where: {
                            accountId_asset: {
                                accountId: account.id,
                                asset: coin as Asset,
                            },
                        },
                        create: {
                            accountId: account.id,
                            asset: coin as Asset,
                            balance: totalBalance,
                            valueUSD,
                        },
                        update: {
                            balance: totalBalance,
                            valueUSD,
                        },
                    })

                    processedBalances.push({
                        asset: coin,
                        balance: totalBalance,
                        price,
                        valueUSD,
                        held: parseFloat(hold),
                    })

                    accountTotalValue += valueUSD
                    results.balancesFound++
                }

                // Mark zero balances as inactive
                await prismaMonitoring.spotBalance.updateMany({
                    where: {
                        accountId: account.id,
                        asset: {
                            notIn: processedBalances.map((b) => b.asset),
                        },
                    },
                    data: {
                        balance: 0,
                        valueUSD: 0,
                    },
                })

                results.processed++
                results.totalSpotValue += accountTotalValue
                results.accountResults.push({
                    address: accountAddress,
                    balancesFound: processedBalances.length,
                    totalValue: accountTotalValue,
                    balances: processedBalances.map((b) => ({
                        coin: b.asset,
                        balance: b.balance,
                        valueUSD: b.valueUSD,
                    })),
                })

                console.log(
                    `[HyperCore Spot Sync] ${accountAddress}: Found ${processedBalances.length} balances, value: $${accountTotalValue.toFixed(2)}`,
                )
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
