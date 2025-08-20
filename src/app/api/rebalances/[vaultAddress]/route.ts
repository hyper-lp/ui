import { NextRequest, NextResponse } from 'next/server'
import { prismaKeeper } from '@/lib/prisma-keeper'
import type { RebalanceResponse, RebalanceQueryParams, RebalanceMetadata } from '@/interfaces/rebalance.interface'

export async function GET(request: NextRequest, context: { params: Promise<{ vaultAddress: string }> }): Promise<NextResponse<RebalanceResponse>> {
    try {
        const params = await context.params
        const { vaultAddress } = params
        const searchParams = request.nextUrl.searchParams

        // Parse query parameters
        const queryParams: RebalanceQueryParams = {
            vaultAddress: vaultAddress.toLowerCase(),
            status: (searchParams.get('status') as 'pending' | 'executed' | 'failed' | 'cancelled') || undefined,
            startDate: searchParams.get('startDate') || undefined,
            endDate: searchParams.get('endDate') || undefined,
            limit: parseInt(searchParams.get('limit') || '50'),
            offset: parseInt(searchParams.get('offset') || '0'),
            orderBy: (searchParams.get('orderBy') as 'timestamp' | 'createdAt') || 'timestamp',
            order: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
        }

        // Validate limit
        if (queryParams.limit! > 100) {
            queryParams.limit = 100
        }

        // Build where clause
        const where: Record<string, unknown> = {
            vaultAddress: queryParams.vaultAddress,
        }

        if (queryParams.status) {
            where.status = queryParams.status
        }

        if (queryParams.startDate || queryParams.endDate) {
            const timestampFilter: Record<string, Date> = {}
            if (queryParams.startDate) {
                timestampFilter.gte = new Date(queryParams.startDate)
            }
            if (queryParams.endDate) {
                timestampFilter.lte = new Date(queryParams.endDate)
            }
            where.timestamp = timestampFilter
        }

        // Get total count for pagination
        const totalCount = await prismaKeeper.rebalance.count({ where })

        // Fetch rebalances
        const rebalances = await prismaKeeper.rebalance.findMany({
            where,
            orderBy: {
                [queryParams.orderBy!]: queryParams.order,
            },
            take: queryParams.limit,
            skip: queryParams.offset,
            include: {
                vault: true,
            },
        })

        // Format response
        const formattedRebalances = rebalances.map((rebalance) => ({
            id: rebalance.id,
            vaultId: rebalance.vaultId,
            timestamp: rebalance.timestamp,
            status: rebalance.status as 'pending' | 'executed' | 'failed' | 'cancelled',
            poolAddress: rebalance.poolAddress,
            vaultAddress: rebalance.vaultAddress,
            metadata: rebalance.metadata as unknown as RebalanceMetadata,
            createdAt: rebalance.createdAt,
            updatedAt: rebalance.updatedAt,
            vault: rebalance.vault
                ? {
                      id: rebalance.vault.id,
                      name: rebalance.vault.name,
                      symbol: rebalance.vault.symbol,
                      address: rebalance.vault.address,
                      poolAddress: rebalance.vault.poolAddress,
                      metadata: rebalance.vault.metadata as Record<string, unknown>,
                      createdAt: rebalance.vault.createdAt,
                      updatedAt: rebalance.vault.updatedAt,
                  }
                : undefined,
        }))

        return NextResponse.json({
            success: true,
            data: formattedRebalances,
            pagination: {
                total: totalCount,
                limit: queryParams.limit!,
                offset: queryParams.offset!,
                hasMore: queryParams.offset! + queryParams.limit! < totalCount,
            },
        })
    } catch (error) {
        console.error('Error fetching rebalances:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch rebalances',
            },
            { status: 500 },
        )
    }
}
