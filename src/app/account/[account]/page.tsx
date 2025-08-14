'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import PageWrapper from '@/components/common/PageWrapper'
import type { AccountData } from '@/interfaces'
import { useDeltaHistoryStore } from '@/stores/delta-history.store'
import {
    AccountHeader,
    DeltaBreakdown,
    ValueSummary,
    APRDisplay,
    LPPositionsTable,
    PerpPositionsTable,
    SpotBalancesTable,
    HyperEvmBalancesTable,
    StrategyMonitoring,
} from '@/components/app/account'

async function fetchAccountData(account: string): Promise<AccountData> {
    const response = await fetch(`/api/public/account/${account}`)
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Account not found')
        }
        throw new Error('Failed to fetch account data')
    }
    return response.json()
}

export default function AccountPage() {
    const params = useParams()
    const account = params?.account as string

    // Delta history store
    const { addDataPoint, getHistory } = useDeltaHistoryStore()
    const deltaHistory = getHistory(account)

    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ['account', account],
        queryFn: () => fetchAccountData(account),
        enabled: !!account,
        staleTime: 30000, // Consider data fresh for 30 seconds
        gcTime: 300000, // Keep in cache for 5 minutes (gcTime replaces cacheTime in v5)
        refetchInterval: 30000, // Refresh every 30 seconds
    })

    // Add data point to history on each refresh
    useEffect(() => {
        if (data?.summary && account) {
            const point = {
                timestamp: Date.now(),
                lpDelta: data.summary.lpDelta || 0,
                perpDelta: data.summary.perpDelta || 0,
                netDelta: data.summary.netDelta || 0,
                spotDelta: data.summary.spotDelta || 0,
                hyperEvmDelta: data.summary.hyperEvmDelta || 0,
            }
            addDataPoint(account, point)
        }
    }, [data?.summary, account, addDataPoint])

    if (isLoading) {
        return (
            <PageWrapper>
                <div className="py-8 text-center">Loading account data...</div>
            </PageWrapper>
        )
    }

    if (error) {
        return (
            <PageWrapper>
                <div className="py-8 text-center text-red-500">Error: {error instanceof Error ? error.message : 'Failed to load account'}</div>
            </PageWrapper>
        )
    }

    if (!data?.success || !data.account) {
        return (
            <PageWrapper>
                <div className="py-8 text-center">No data available for this account</div>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper>
            {/* Header */}
            <AccountHeader address={data.account.address} name={data.account.name} onRefresh={() => refetch()} isFetching={isFetching} />

            {/* Live Strategy Monitoring */}
            {data.summary && <StrategyMonitoring summary={data.summary} deltaHistory={deltaHistory} />}

            {/* Summary Section */}
            {data.summary && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Summary</h2>
                    <ValueSummary
                        totalValue={data.summary.totalValue}
                        totalLpValue={data.summary.totalLpValue}
                        totalPerpValue={data.summary.totalPerpValue}
                        totalSpotValue={data.summary.totalSpotValue}
                        totalHyperEvmValue={data.summary.totalHyperEvmValue || 0}
                    />

                    {/* Delta Breakdown */}
                    <DeltaBreakdown
                        lpDelta={data.summary.lpDelta}
                        perpDelta={data.summary.perpDelta}
                        spotDelta={data.summary.spotDelta}
                        hyperEvmDelta={data.summary.hyperEvmDelta || 0}
                        netDelta={data.summary.netDelta}
                    />

                    {/* APRs */}
                    <APRDisplay lastSnapshot={data.summary.lastSnapshot} currentAPR={data.summary.currentAPR} />
                </div>
            )}

            {/* LP Positions */}
            {data.positions?.lp && <LPPositionsTable positions={data.positions.lp} />}

            {/* Perp Positions */}
            {data.positions?.perp && <PerpPositionsTable positions={data.positions.perp} />}

            {/* Spot Balances */}
            {data.positions?.spot && <SpotBalancesTable balances={data.positions.spot} />}

            {/* HyperEVM Balances */}
            {data.positions?.hyperEvm && <HyperEvmBalancesTable balances={data.positions.hyperEvm} />}

            {/* No positions message */}
            {!data.positions?.lp?.length && !data.positions?.perp?.length && !data.positions?.spot?.length && !data.positions?.hyperEvm?.length && (
                <div className="py-8 text-center text-gray-500">No positions found for this account</div>
            )}

            {/* Raw Data Section (for debugging) */}
            <details className="mt-8 border p-4">
                <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">Raw API Response (Debug)</summary>
                <div className="mt-4 space-y-4">
                    <div>
                        <h3 className="mb-2 font-semibold">Account Info</h3>
                        <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-xs">{JSON.stringify(data.account, null, 2)}</pre>
                    </div>

                    {data.summary && (
                        <div>
                            <h3 className="mb-2 font-semibold">Summary</h3>
                            <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-xs">{JSON.stringify(data.summary, null, 2)}</pre>
                        </div>
                    )}

                    {data.positions?.lp && data.positions.lp.length > 0 && (
                        <div>
                            <h3 className="mb-2 font-semibold">LP Positions (Raw)</h3>
                            <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-xs">{JSON.stringify(data.positions.lp, null, 2)}</pre>
                        </div>
                    )}

                    {data.positions?.perp && data.positions.perp.length > 0 && (
                        <div>
                            <h3 className="mb-2 font-semibold">Perp Positions (Raw)</h3>
                            <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-xs">{JSON.stringify(data.positions.perp, null, 2)}</pre>
                        </div>
                    )}

                    {data.positions?.spot && data.positions.spot.length > 0 && (
                        <div>
                            <h3 className="mb-2 font-semibold">Spot Balances (Raw)</h3>
                            <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-xs">{JSON.stringify(data.positions.spot, null, 2)}</pre>
                        </div>
                    )}

                    {data.positions?.hyperEvm && data.positions.hyperEvm.length > 0 && (
                        <div>
                            <h3 className="mb-2 font-semibold">HyperEVM Balances (Raw)</h3>
                            <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-xs">{JSON.stringify(data.positions.hyperEvm, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </details>
        </PageWrapper>
    )
}
