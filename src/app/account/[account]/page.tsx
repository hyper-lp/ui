'use client'

import { useSearchParams, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import PageWrapper from '@/components/common/PageWrapper'
import { CollapsibleSection } from '@/components/common/CollapsibleSection'
import type { AccountData } from '@/interfaces'
import { useDeltaHistoryStore } from '@/stores/delta-history.store'
import {
    AccountHeader,
    DeltaBreakdown,
    ValueSummary,
    APRDisplay,
    LPPositionsByDex,
    PerpPositionsTable,
    SpotBalancesTable,
    HyperEvmBalancesTable,
    StrategyMonitoring,
    TransactionHistory,
} from '@/components/app/account'

async function fetchAccountData(evmAddress: string, coreAddress: string): Promise<AccountData> {
    // If both addresses are the same, use the old single-address API for backward compatibility
    if (evmAddress === coreAddress && evmAddress) {
        const response = await fetch(`/api/public/account/${evmAddress}`)
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Account not found')
            }
            throw new Error('Failed to fetch account data')
        }
        return response.json()
    }

    // Otherwise use the new dual-address API
    const params = new URLSearchParams({
        evm: evmAddress,
        core: coreAddress,
    })
    const response = await fetch(`/api/public/account?${params}`)
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Account not found')
        }
        throw new Error('Failed to fetch account data')
    }
    return response.json()
}

function formatTimeSince(timestamp: number | null): string {
    if (!timestamp) return ''
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
}

export default function AccountPage() {
    const searchParams = useSearchParams()
    const params = useParams()

    // Support both old URL pattern (/account/[address]) and new pattern with query params
    const accountFromUrl = params?.account as string
    const evmAddress = searchParams?.get('evm') || accountFromUrl || ''
    const coreAddress = searchParams?.get('core') || accountFromUrl || ''
    const [lastRefreshTime, setLastRefreshTime] = useState<number | null>(null)
    const [, setTick] = useState(0) // Force re-render for time display

    // Delta history store - use combined key for history
    const { addDataPoint, getHistory } = useDeltaHistoryStore()
    const historyKey = `${evmAddress}-${coreAddress}`
    const deltaHistory = getHistory(historyKey)

    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ['account', evmAddress, coreAddress],
        queryFn: () => fetchAccountData(evmAddress, coreAddress),
        enabled: !!evmAddress && !!coreAddress,
        staleTime: process.env.NODE_ENV === 'development' ? 300000 : 30000, // Dev: 5 min, Prod: 30 sec
        gcTime: 300000, // Keep in cache for 5 minutes
        refetchInterval: process.env.NODE_ENV === 'development' ? 300000 : 30000, // Dev: 5 min, Prod: 30 sec
    })

    // Add data point to history on each refresh and update last refresh time
    useEffect(() => {
        if (data?.summary && evmAddress && coreAddress) {
            const now = Date.now()
            setLastRefreshTime(now)
            const point = {
                timestamp: now,
                lpDelta: data.summary.lpDelta || 0,
                perpDelta: data.summary.perpDelta || 0,
                netDelta: data.summary.netDelta || 0,
                spotDelta: data.summary.spotDelta || 0,
                hyperEvmDelta: data.summary.hyperEvmDelta || 0,
            }
            addDataPoint(historyKey, point)
        }
    }, [data?.summary, evmAddress, coreAddress, historyKey, addDataPoint])

    // Update refresh time display every second
    useEffect(() => {
        const interval = setInterval(() => {
            setTick((prev) => prev + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    // Show loading screen only while actually loading
    if (isLoading && !data) {
        return (
            <PageWrapper>
                <div className="py-8">
                    <div className="mx-auto max-w-2xl space-y-4">
                        <div className="text-center">
                            <h2 className="mb-4 text-xl font-semibold">Fetching account data...</h2>
                            <div className="mb-4 flex justify-center">
                                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                                <p>Loading LP positions from HyperEVM...</p>
                                <p>Loading balances from HyperEVM...</p>
                                <p>Loading perpetual positions from HyperCore...</p>
                                <p>Loading spot balances from HyperCore...</p>
                            </div>
                            <p className="mt-3 text-xs text-gray-500">Fetching data from multiple blockchain sources</p>
                        </div>
                    </div>
                </div>
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

    // Calculate section-specific deltas
    const hyperEvmLpDelta =
        data.positions?.lp?.reduce((sum, p) => {
            const token0IsHype = p.token0Symbol === 'WHYPE' || p.token0Symbol === 'HYPE'
            const token1IsHype = p.token1Symbol === 'WHYPE' || p.token1Symbol === 'HYPE'
            if (token0IsHype && p.token0Amount) return sum + p.token0Amount
            else if (token1IsHype && p.token1Amount) return sum + p.token1Amount
            return sum
        }, 0) || 0

    const hyperEvmSpotDelta =
        data.positions?.hyperEvm?.reduce((sum, b) => {
            if (b.symbol === 'WHYPE' || b.symbol === 'HYPE') {
                // Parse balance string to number
                const balanceNum = parseFloat(b.balance) || 0
                return sum + balanceNum
            }
            return sum
        }, 0) || 0

    const hyperCorePerpDelta =
        data.positions?.perp?.reduce((sum, p) => {
            // Only count HYPE perps for delta
            if (p.asset === 'HYPE') {
                return sum + (p.size || 0)
            }
            return sum
        }, 0) || 0

    const hyperCoreSpotDelta =
        data.positions?.spot?.reduce((sum, b) => {
            if (b.asset === 'HYPE') {
                // Handle both string and number balance
                const balanceNum = typeof b.balance === 'string' ? parseFloat(b.balance) : b.balance
                return sum + (balanceNum || 0)
            }
            return sum
        }, 0) || 0

    const totalHyperEvmDelta = hyperEvmLpDelta + hyperEvmSpotDelta
    const totalHyperCoreDelta = hyperCorePerpDelta + hyperCoreSpotDelta
    const totalNetDelta = totalHyperEvmDelta + totalHyperCoreDelta

    // Calculate values for sections
    const totalHyperEvmValue = (data.summary?.totalLpValue || 0) + (data.summary?.totalHyperEvmValue || 0)
    const totalHyperCoreValue = (data.summary?.totalPerpValue || 0) + (data.summary?.totalSpotValue || 0)

    // Display refresh time
    const refreshTimeDisplay = formatTimeSince(lastRefreshTime)

    return (
        <PageWrapper>
            {/* Header */}
            <AccountHeader onRefresh={() => refetch()} isFetching={isFetching} />

            {/* Display timing information if available */}
            {data?.timings && (
                <div className="mb-4 rounded-lg bg-gray-50 p-3">
                    <div className="font-mono text-xs text-gray-600">
                        <span className="font-semibold">Fetch timings:</span>
                        {data.timings.lpFetch && <span className="ml-3">LP: {(data.timings.lpFetch / 1000).toFixed(2)}s</span>}
                        {data.timings.evmFetch && <span className="ml-3">EVM: {(data.timings.evmFetch / 1000).toFixed(2)}s</span>}
                        {data.timings.perpFetch && <span className="ml-3">Perp: {(data.timings.perpFetch / 1000).toFixed(2)}s</span>}
                        {data.timings.spotFetch && <span className="ml-3">Spot: {(data.timings.spotFetch / 1000).toFixed(2)}s</span>}
                        <span className="ml-3 font-semibold">Total: {(data.timings.total / 1000).toFixed(2)}s</span>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {/* Charts Section */}
                <CollapsibleSection
                    title="Strategy Monitoring"
                    sectionKey="charts"
                    subtitle="Live delta tracking and historical performance"
                    lastRefresh={refreshTimeDisplay}
                >
                    {data.summary && <StrategyMonitoring summary={data.summary} deltaHistory={deltaHistory} />}
                </CollapsibleSection>

                {/* Summary Section */}
                <CollapsibleSection
                    title="Summary"
                    sectionKey="summary"
                    badge={`Net Δ: ${totalNetDelta >= 0 ? '+' : ''}${totalNetDelta.toFixed(4)} HYPE`}
                    subtitle="Portfolio overview and current APRs"
                    lastRefresh={refreshTimeDisplay}
                >
                    {data.summary && (
                        <div className="space-y-4">
                            <ValueSummary
                                totalValue={data.summary.totalValue}
                                totalLpValue={data.summary.totalLpValue}
                                totalPerpValue={data.summary.totalPerpValue}
                                totalSpotValue={data.summary.totalSpotValue}
                                totalHyperEvmValue={data.summary.totalHyperEvmValue || 0}
                            />

                            <DeltaBreakdown
                                lpDelta={data.summary.lpDelta}
                                perpDelta={data.summary.perpDelta}
                                spotDelta={data.summary.spotDelta}
                                hyperEvmDelta={data.summary.hyperEvmDelta || 0}
                                netDelta={data.summary.netDelta}
                            />

                            <APRDisplay lastSnapshot={data.summary.lastSnapshot} currentAPR={data.summary.currentAPR} />
                        </div>
                    )}
                </CollapsibleSection>

                {/* HyperEVM Section */}
                <CollapsibleSection
                    title="HyperEVM"
                    sectionKey="hyperEvm"
                    badge={`Δ: ${totalHyperEvmDelta >= 0 ? '+' : ''}${totalHyperEvmDelta.toFixed(4)} HYPE`}
                    subtitle={`$${totalHyperEvmValue.toFixed(2)} • ${data.positions?.lp?.length || 0} LP positions • ${data.positions?.hyperEvm?.length || 0} tokens`}
                    lastRefresh={refreshTimeDisplay}
                >
                    <div className="space-y-6">
                        {/* LP Positions grouped by DEX */}
                        {data.positions?.lp && data.positions.lp.length > 0 && (
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">
                                    Liquidity Positions (Δ: {hyperEvmLpDelta >= 0 ? '+' : ''}
                                    {hyperEvmLpDelta.toFixed(4)} HYPE)
                                </h3>
                                <LPPositionsByDex positions={data.positions.lp} />
                            </div>
                        )}

                        {/* HyperEVM Spot Balances */}
                        {data.positions?.hyperEvm && data.positions.hyperEvm.length > 0 && (
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">
                                    Spot Balances (Δ: {hyperEvmSpotDelta >= 0 ? '+' : ''}
                                    {hyperEvmSpotDelta.toFixed(4)} HYPE)
                                </h3>
                                <HyperEvmBalancesTable balances={data.positions.hyperEvm} />
                            </div>
                        )}

                        {!data.positions?.lp?.length && !data.positions?.hyperEvm?.length && (
                            <div className="py-4 text-center text-gray-500">No HyperEVM positions found</div>
                        )}
                    </div>
                </CollapsibleSection>

                {/* HyperCore Section */}
                <CollapsibleSection
                    title="HyperCore"
                    sectionKey="hyperCore"
                    badge={`Δ: ${totalHyperCoreDelta >= 0 ? '+' : ''}${totalHyperCoreDelta.toFixed(4)} HYPE`}
                    subtitle={`$${totalHyperCoreValue.toFixed(2)} • ${data.positions?.perp?.length || 0} perp positions • ${data.positions?.spot?.length || 0} tokens`}
                    lastRefresh={refreshTimeDisplay}
                >
                    <div className="space-y-6">
                        {/* Perp Positions */}
                        {data.positions?.perp && data.positions.perp.length > 0 && (
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">
                                    Perpetual Positions (Δ: {hyperCorePerpDelta >= 0 ? '+' : ''}
                                    {hyperCorePerpDelta.toFixed(4)} HYPE)
                                </h3>
                                <PerpPositionsTable positions={data.positions.perp} />
                            </div>
                        )}

                        {/* Spot Balances */}
                        {data.positions?.spot && data.positions.spot.length > 0 && (
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">
                                    Spot Balances (Δ: {hyperCoreSpotDelta >= 0 ? '+' : ''}
                                    {hyperCoreSpotDelta.toFixed(4)} HYPE)
                                </h3>
                                <SpotBalancesTable balances={data.positions.spot} />
                            </div>
                        )}

                        {!data.positions?.perp?.length && !data.positions?.spot?.length && (
                            <div className="py-4 text-center text-gray-500">No HyperCore positions found</div>
                        )}
                    </div>
                </CollapsibleSection>

                {/* Transaction History */}
                <CollapsibleSection
                    title="Transaction History"
                    sectionKey="transactions"
                    subtitle="DEX interactions on HyperEVM"
                    lastRefresh={refreshTimeDisplay}
                >
                    <TransactionHistory account={evmAddress} />
                </CollapsibleSection>

                {/* Debug Section */}
                <CollapsibleSection
                    title="Raw API Response (Debug)"
                    sectionKey="debug"
                    subtitle="Complete API response data"
                    lastRefresh={refreshTimeDisplay}
                >
                    <div className="space-y-4">
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
                                <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-xs">
                                    {JSON.stringify(data.positions.hyperEvm, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                </CollapsibleSection>
            </div>
        </PageWrapper>
    )
}
