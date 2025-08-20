import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import type { RebalanceResponse, RebalanceMetadata } from '@/interfaces/rebalance.interface'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL_KEEPER,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

// Simple in-memory cache with 5-second TTL
const CACHE_TTL = 1000 // 1 second
const cache = new Map<string, { data: RebalanceResponse; timestamp: number }>()

export async function GET(request: NextRequest, context: { params: Promise<{ vaultAddress: string }> }): Promise<NextResponse<RebalanceResponse>> {
    try {
        const params = await context.params
        const { vaultAddress } = params
        const searchParams = request.nextUrl.searchParams

        // Parse query parameters
        const requestedLimit = parseInt(searchParams.get('limit') || '50')
        const limit = Math.min(Math.max(1, requestedLimit), 500) // Clamp between 1 and 500
        const offset = parseInt(searchParams.get('offset') || '0')
        const status = searchParams.get('status') || null
        const orderBy = searchParams.get('orderBy') || 'timestamp'
        const order = (searchParams.get('order') || 'desc').toUpperCase()

        // Create cache key from parameters
        const cacheKey = `${vaultAddress}-${limit}-${offset}-${status}-${orderBy}-${order}`

        // Check cache first
        const cached = cache.get(cacheKey)
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return NextResponse.json(cached.data, {
                headers: {
                    'X-Cache': 'HIT',
                    'X-Cache-Age': String(Date.now() - cached.timestamp),
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                },
            })
        }

        const client = await pool.connect()

        // Build WHERE clause conditions
        const conditions = [`r."vaultAddress" = $1`]
        const values: (string | number)[] = [vaultAddress]
        let paramCount = 1

        if (status) {
            paramCount++
            conditions.push(`r.status = $${paramCount}`)
            values.push(status)
        }

        const whereClause = conditions.join(' AND ')

        // Get total count for pagination
        const countResult = await client.query(
            `SELECT COUNT(*) as total 
             FROM "Rebalance" r 
             WHERE ${whereClause}`,
            values,
        )
        const totalCount = parseInt(countResult.rows[0].total)

        // Fetch rebalances with vault info
        paramCount++
        values.push(limit)
        paramCount++
        values.push(offset)

        const result = await client.query(
            `SELECT 
                r.id,
                r."vaultId",
                r.timestamp,
                r.status,
                r."poolAddress",
                r."vaultAddress",
                r.metadata,
                r."createdAt",
                r."updatedAt",
                v.id as vault_id,
                v.name as vault_name,
                v."fullName" as vault_fullname,
                v.address as vault_address,
                v."lastSync" as vault_lastsync,
                v."createdAt" as vault_created,
                v."updatedAt" as vault_updated
             FROM "Rebalance" r
             LEFT JOIN "Vault" v ON r."vaultId" = v.id
             WHERE ${whereClause}
             ORDER BY r."${orderBy}" ${order}
             LIMIT $${paramCount - 1} OFFSET $${paramCount}`,
            values,
        )

        // Format response
        const formattedRebalances = result.rows.map((row) => ({
            id: row.id,
            vaultId: row.vaultId,
            timestamp: row.timestamp,
            status: row.status as 'pending' | 'executed' | 'failed' | 'cancelled' | 'completed',
            poolAddress: row.poolAddress,
            vaultAddress: row.vaultAddress,
            metadata: row.metadata as RebalanceMetadata,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            vault: row.vault_id
                ? {
                      id: row.vault_id,
                      name: row.vault_name,
                      fullName: row.vault_fullname,
                      address: row.vault_address,
                      lastSync: row.vault_lastsync,
                      createdAt: row.vault_created,
                      updatedAt: row.vault_updated,
                  }
                : undefined,
        }))

        const response: RebalanceResponse = {
            success: true,
            data: formattedRebalances,
            pagination: {
                total: totalCount,
                limit,
                offset,
                hasMore: offset + limit < totalCount,
                requestedLimit,
                actualLimit: limit,
            },
        }

        // Store in cache
        cache.set(cacheKey, {
            data: response,
            timestamp: Date.now(),
        })

        // Clean up old cache entries (keep max 100 entries)
        if (cache.size > 100) {
            const firstKey = cache.keys().next().value
            if (firstKey) cache.delete(firstKey)
        }

        client.release()

        return NextResponse.json(response, {
            headers: {
                'X-Cache': 'MISS',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
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
