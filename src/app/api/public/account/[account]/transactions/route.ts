import { NextResponse } from 'next/server'
import { HyperEVMScanService } from '@/services/explorers/hyperevmscan.service'
import { filterDexTransactions, groupTransactionsByDex, getTransactionStats } from '@/services/explorers/transaction-parser'
import { DexProtocol } from '@/enums'
import { env } from '@/env/t3-env'

export async function GET(request: Request, { params }: { params: Promise<{ account: string }> }) {
    try {
        const { account } = await params

        if (!account) {
            return NextResponse.json({ success: false, error: 'Account address is required' }, { status: 400 })
        }

        // Get query parameters
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '1000') // Default to 1000 transactions
        const startBlock = searchParams.get('startblock') ? parseInt(searchParams.get('startblock')!) : undefined
        const endBlock = searchParams.get('endblock') ? parseInt(searchParams.get('endblock')!) : undefined
        const onlyHypeUsdt = searchParams.get('onlyHypeUsdt') === 'true'

        // Parse DEX protocols from query
        const dexParam = searchParams.get('dexes')
        const targetDexes = dexParam
            ? (dexParam.split(',').filter((d) => Object.values(DexProtocol).includes(d as DexProtocol)) as DexProtocol[])
            : [DexProtocol.HYPERSWAP, DexProtocol.HYBRA, DexProtocol.PRJTX, DexProtocol.HYPERBRICK]

        // Check if API key is configured
        if (!env.HYPEREVM_SCAN_API_KEY) {
            console.warn('HYPEREVM_SCAN_API_KEY not configured - returning empty transactions')
            return NextResponse.json({
                success: true,
                account,
                transactions: [],
                groupedByDex: {},
                stats: {
                    total: 0,
                    byType: {
                        swap: 0,
                        addLiquidity: 0,
                        removeLiquidity: 0,
                        collect: 0,
                        mint: 0,
                        burn: 0,
                        unknown: 0,
                    },
                    byDex: {},
                    successful: 0,
                    failed: 0,
                },
                pagination: {
                    limit,
                    startBlock,
                    endBlock,
                    total: 0,
                    filteredCount: 0,
                },
                message: 'Explorer API key not configured',
            })
        }

        // Create service instance with API key
        const hyperevmscanService = new HyperEVMScanService({
            apiKey: env.HYPEREVM_SCAN_API_KEY,
        })

        // Fetch transactions from HyperEVMScan
        const transactions = await hyperevmscanService.getTransactions({
            address: account,
            limit,
            startBlock,
            endBlock,
        })

        // Filter and parse DEX transactions
        const dexTransactions = filterDexTransactions(transactions, {
            dexProtocols: targetDexes,
            onlyHypeUsdt,
        })

        // Group by DEX
        const groupedByDex = groupTransactionsByDex(dexTransactions)

        // Get statistics
        const stats = getTransactionStats(dexTransactions)

        return NextResponse.json({
            success: true,
            account,
            transactions: dexTransactions,
            groupedByDex,
            stats,
            pagination: {
                limit,
                startBlock,
                endBlock,
                total: transactions.length,
                filteredCount: dexTransactions.length,
            },
        })
    } catch (error) {
        console.error('Error fetching account transactions:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch transactions',
            },
            { status: 500 },
        )
    }
}
