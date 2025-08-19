import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL_MONITORING,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

export async function GET(_request: NextRequest, context: { params: Promise<{ address: string }> }) {
    const client = await pool.connect()

    try {
        const params = await context.params
        const { address } = params
        const accountAddress = address.toLowerCase()

        // Fetch last 100 snapshots for this address
        // Include indexed fields for efficient access
        const result = await client.query(
            `SELECT 
                snapshot,
                "timestamp",
                "totalUSD",
                "deployedAUM",
                "lpsDeltaHYPE",
                "balancesDeltaHYPE", 
                "perpsDeltaHYPE",
                "spotsDeltaHYPE",
                "strategyDelta",
                "netDeltaHYPE",
                "perpsNotionalUSD",
                "perpsPnlUSD",
                "withdrawableUSDC",
                "hypePrice"
             FROM "AccountSnapshot" 
             WHERE address = $1 
             ORDER BY timestamp DESC 
             LIMIT 100`,
            [accountAddress],
        )

        // Parse JSON snapshots and reverse to get chronological order
        // Include indexed fields for potential optimization
        const snapshots = result.rows
            .map((row) => ({
                ...row.snapshot,
                // Ensure indexed fields are available directly
                _indexed: {
                    timestamp: row.timestamp,
                    totalUSD: parseFloat(row.totalUSD),
                    deployedAUM: parseFloat(row.deployedAUM),
                    lpsDeltaHYPE: parseFloat(row.lpsDeltaHYPE),
                    balancesDeltaHYPE: parseFloat(row.balancesDeltaHYPE),
                    perpsDeltaHYPE: parseFloat(row.perpsDeltaHYPE),
                    spotsDeltaHYPE: parseFloat(row.spotsDeltaHYPE),
                    strategyDelta: parseFloat(row.strategyDelta),
                    netDeltaHYPE: parseFloat(row.netDeltaHYPE),
                    perpsNotionalUSD: parseFloat(row.perpsNotionalUSD),
                    perpsPnlUSD: parseFloat(row.perpsPnlUSD),
                    withdrawableUSDC: parseFloat(row.withdrawableUSDC),
                    hypePrice: parseFloat(row.hypePrice),
                },
            }))
            .reverse()

        return NextResponse.json({ snapshots })
    } catch (error) {
        console.error('Failed to fetch snapshots:', error)
        return NextResponse.json({ error: 'Failed to fetch snapshots' }, { status: 500 })
    } finally {
        client.release()
    }
}
