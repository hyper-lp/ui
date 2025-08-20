import { NextRequest, NextResponse } from 'next/server'
import { getMonitoringPool } from '@/lib/database-pools'
import type { AccountSnapshot } from '@/interfaces/account.interface'
import { SCHEMA_VERSION } from '@/constants/schema.constants'

export async function POST(request: NextRequest) {
    const pool = getMonitoringPool()
    const client = await pool.connect()

    try {
        const snapshot: AccountSnapshot = await request.json()

        if (!snapshot || !snapshot.success) {
            return NextResponse.json({ error: 'Invalid snapshot data' }, { status: 400 })
        }

        // Store snapshot in database
        // The address comes from evmAddress since that's the main account identifier
        const address = snapshot.evmAddress.toLowerCase()

        await client.query(
            `INSERT INTO "AccountSnapshot" 
            (id, address, timestamp, "evmAddress", "coreAddress", "schemaVersion", snapshot, 
             "totalUSD", "deployedAUM", "netDeltaHYPE", "strategyDelta",
             "lpsDeltaHYPE", "balancesDeltaHYPE", "perpsDeltaHYPE", "spotsDeltaHYPE", 
             "perpsNotionalUSD", "perpsPnlUSD", "withdrawableUSDC", "hypePrice") 
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
            [
                address,
                new Date(snapshot.timestamp),
                snapshot.evmAddress.toLowerCase(),
                snapshot.coreAddress.toLowerCase(),
                snapshot.schemaVersion || SCHEMA_VERSION.CURRENT,
                JSON.stringify(snapshot),
                snapshot.metrics.portfolio.totalUSD,
                snapshot.metrics.portfolio.deployedAUM,
                snapshot.metrics.portfolio.netDeltaHYPE,
                snapshot.metrics.portfolio.strategyDelta,
                snapshot.metrics.hyperEvm.deltas.lpsHYPE,
                snapshot.metrics.hyperEvm.deltas.balancesHYPE,
                snapshot.metrics.hyperCore.deltas.perpsHYPE,
                snapshot.metrics.hyperCore.deltas.spotHYPE,
                snapshot.metrics.hyperCore.values.perpsNotionalUSD,
                snapshot.metrics.hyperCore.values.perpsPnlUSD,
                snapshot.metrics.hyperCore.values.withdrawableUSDC,
                snapshot.prices?.HYPE || 0,
            ],
        )

        // Clean up old snapshots (keep last 7 days)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        await client.query('DELETE FROM "AccountSnapshot" WHERE timestamp < $1', [sevenDaysAgo])

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to store snapshot:', error)
        return NextResponse.json(
            { error: 'Failed to store snapshot', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 },
        )
    } finally {
        client.release()
    }
}
