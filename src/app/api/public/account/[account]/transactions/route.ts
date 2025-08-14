import { NextResponse } from 'next/server'
import { HyperEVMScanService } from '@/services/explorers/hyperevmscan.service'
import { filterDexTransactions, groupTransactionsByDex, getTransactionStats } from '@/services/explorers/transaction-parser'
import type { ParsedDexTransaction } from '@/interfaces/explorers'
import { DexProtocol } from '@/enums'
import { env } from '@/env/t3-env'

interface CachedResponse {
    success: boolean
    account: string
    transactions: ParsedDexTransaction[]
    groupedByDex: Record<DexProtocol, ParsedDexTransaction[]>
    stats: ReturnType<typeof getTransactionStats>
    pagination: {
        limit: number
        startBlock?: number
        endBlock?: number
        total: number
        filteredCount: number
    }
    message?: string
}

// Simple in-memory cache for transactions
const transactionCache = new Map<string, { data: CachedResponse; timestamp: number }>()
const CACHE_TTL = 60000 // 1 minute cache

export async function GET(request: Request, { params }: { params: Promise<{ account: string }> }) {
    try {
        const { account } = await params

        if (!account) {
            return NextResponse.json({ success: false, error: 'Account address is required' }, { status: 400 })
        }

        // Get query parameters
        const { searchParams } = new URL(request.url)
        const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500) // Cap at 500 for performance
        const startBlock = searchParams.get('startblock') ? parseInt(searchParams.get('startblock')!) : undefined
        const endBlock = searchParams.get('endblock') ? parseInt(searchParams.get('endblock')!) : undefined
        const onlyHypeUsdt = searchParams.get('onlyHypeUsdt') === 'true'

        // Parse DEX protocols from query
        const dexParam = searchParams.get('dexes')
        const targetDexes = dexParam
            ? (dexParam.split(',').filter((d) => Object.values(DexProtocol).includes(d as DexProtocol)) as DexProtocol[])
            : [DexProtocol.HYPERSWAP, DexProtocol.HYBRA, DexProtocol.PRJTX, DexProtocol.HYPERBRICK]

        // Check cache first
        const cacheKey = `${account}-${limit}-${onlyHypeUsdt}-${dexParam || 'all'}`
        const cached = transactionCache.get(cacheKey)
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log('Returning cached transactions for', account)
            return NextResponse.json(cached.data)
        }

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

        const responseData = {
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
        }

        // Cache the response
        transactionCache.set(cacheKey, {
            data: responseData,
            timestamp: Date.now(),
        })

        // Clean old cache entries periodically
        if (transactionCache.size > 100) {
            const now = Date.now()
            for (const [key, value] of transactionCache.entries()) {
                if (now - value.timestamp > CACHE_TTL * 2) {
                    transactionCache.delete(key)
                }
            }
        }

        return NextResponse.json(responseData)
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
