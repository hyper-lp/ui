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

        // Fetch last 10 snapshots for this address
        const result = await client.query(
            `SELECT snapshot FROM "AccountSnapshot" 
             WHERE address = $1 
             ORDER BY timestamp DESC 
             LIMIT 10`,
            [accountAddress],
        )

        // Parse JSON snapshots and reverse to get chronological order
        const snapshots = result.rows.map((row) => row.snapshot).reverse()

        return NextResponse.json({ snapshots })
    } catch (error) {
        console.error('Failed to fetch snapshots:', error)
        return NextResponse.json({ error: 'Failed to fetch snapshots' }, { status: 500 })
    } finally {
        client.release()
    }
}
