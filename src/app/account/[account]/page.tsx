'use client'

import { useParams } from 'next/navigation'
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

interface LoadingStep {
    name: string
    status: 'pending' | 'loading' | 'done'
    startTime?: number
    endTime?: number
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
    const params = useParams()
    const account = params?.account as string
    const [timerTick, setTimerTick] = useState(0)
    const [lastRefreshTime, setLastRefreshTime] = useState<number | null>(null)
    const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>([
        { name: 'Account info', status: 'pending' },
        { name: 'HyperEVM LP positions', status: 'pending' },
        { name: 'HyperEVM balances', status: 'pending' },
        { name: 'HyperCore perp positions', status: 'pending' },
        { name: 'HyperCore spot balances', status: 'pending' },
        { name: 'Delta calculations', status: 'pending' },
        { name: 'APR metrics', status: 'pending' },
    ])

    // Delta history store
    const { addDataPoint, getHistory } = useDeltaHistoryStore()
    const deltaHistory = getHistory(account)

    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ['account', account],
        queryFn: () => fetchAccountData(account),
        enabled: !!account,
        staleTime: 30000, // Consider data fresh for 30 seconds
        gcTime: 300000, // Keep in cache for 5 minutes
        refetchInterval: 30000, // Refresh every 30 seconds
    })

    // Track if all loading steps are complete
    const allStepsComplete = loadingSteps.every((step) => step.status === 'done')

    // Simulate progressive loading steps
    useEffect(() => {
        if (isLoading) {
            const startTime = Date.now()
            const stepDurations = [200, 800, 400, 600, 300, 150, 100] // Different durations for each step
            let cumulativeDelay = 0

            // Start first step immediately
            setLoadingSteps((steps) => steps.map((step, i) => (i === 0 ? { ...step, status: 'loading', startTime } : { ...step, status: 'pending' })))

            stepDurations.forEach((duration, index) => {
                setTimeout(() => {
                    setLoadingSteps((steps) =>
                        steps.map((step, i) =>
                            i === index
                                ? { ...step, status: 'done', endTime: Date.now() }
                                : i === index + 1 && i < steps.length
                                  ? { ...step, status: 'loading', startTime: Date.now() }
                                  : step,
                        ),
                    )
                }, cumulativeDelay)
                cumulativeDelay += duration
            })
        } else {
            setLoadingSteps((steps) => steps.map((step) => ({ ...step, status: 'pending', startTime: undefined, endTime: undefined })))
        }
    }, [isLoading])

    // Update timer for loading items and refresh time display
    useEffect(() => {
        const interval = setInterval(
            () => {
                setTimerTick((prev) => prev + 1)
            },
            isLoading ? 100 : 1000,
        ) // Update every 100ms when loading, 1s otherwise
        return () => clearInterval(interval)
    }, [isLoading])

    // Add data point to history on each refresh and update last refresh time
    useEffect(() => {
        if (data?.summary && account) {
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
            addDataPoint(account, point)
        }
    }, [data?.summary, account, addDataPoint])

    // Show loading screen only while actually loading
    if (isLoading && !data) {
        // Use timerTick to ensure re-render happens
        const currentTime = Date.now() + timerTick * 0 // timerTick triggers re-render but doesn't affect time
        return (
            <PageWrapper>
                <div className="py-8">
                    <div className="mx-auto max-w-2xl space-y-2 font-mono text-sm">
                        {loadingSteps.map((step, index) => {
                            const getStatus = () => {
                                if (step.status === 'done') {
                                    const duration = step.endTime && step.startTime ? ((step.endTime - step.startTime) / 1000).toFixed(2) : '0.00'
                                    return <span className="text-green-500">✓ DONE ({duration}s)</span>
                                } else if (step.status === 'loading') {
                                    const elapsed = step.startTime ? ((currentTime - step.startTime) / 1000).toFixed(1) : '0.0'
                                    return <span className="text-yellow-500">WIP ({elapsed}s)</span>
                                } else {
                                    return <span className="text-gray-400">PENDING</span>
                                }
                            }

                            return (
                                <div key={index} className="flex items-center justify-between">
                                    <span>{step.name}...</span>
                                    {getStatus()}
                                </div>
                            )
                        })}
                        {allStepsComplete && (
                            <div className="mt-4 border-t pt-4">
                                <div className="flex items-center justify-between">
                                    <span>Finalizing data...</span>
                                    <span className="text-blue-500">
                                        PROCESSING (
                                        {(() => {
                                            const lastStep = loadingSteps[loadingSteps.length - 1]
                                            const finalizingTime = lastStep?.endTime || currentTime
                                            return ((currentTime - finalizingTime) / 1000).toFixed(1)
                                        })()}
                                        s)
                                    </span>
                                </div>
                            </div>
                        )}
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

    // Force re-render to update time display (timerTick changes every second)
    const refreshTimeDisplay = formatTimeSince(lastRefreshTime) + timerTick * 0

    return (
        <PageWrapper>
            {/* Header */}
            <AccountHeader address={data.account.address} name={data.account.name} onRefresh={() => refetch()} isFetching={isFetching} />

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
                    <TransactionHistory account={account} />
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
