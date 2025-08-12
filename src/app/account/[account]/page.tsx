'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import PageWrapper from '@/components/common/PageWrapper'
import { HYPEREVM_DEXS } from '@/config/hyperevm-dexs.config'
import type { AccountData } from '@/interfaces'
import { useDeltaHistoryStore } from '@/stores/delta-history.store'
import dynamic from 'next/dynamic'

// Dynamically import charts to avoid SSR issues
const DeltaTrackingChart = dynamic(() => import('@/components/charts/DeltaTrackingChart'), { ssr: false })
const APRBreakdownChart = dynamic(() => import('@/components/charts/APRBreakdownChart'), { ssr: false })
const DeltaThresholdGauge = dynamic(() => import('@/components/charts/DeltaThresholdGauge'), { ssr: false })
const PositionCompositionBar = dynamic(() => import('@/components/charts/PositionCompositionBar'), { ssr: false })
const RebalancingLog = dynamic(() => import('@/components/charts/RebalancingLog'), { ssr: false })
const PoolTVLTable = dynamic(() => import('@/components/charts/PoolTVLTable'), { ssr: false })

async function fetchAccountData(account: string): Promise<AccountData> {
    const response = await fetch(`/api/positions/${account}`)
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
                <div className="text-center py-8">Loading account data...</div>
            </PageWrapper>
        )
    }

    if (error) {
        return (
            <PageWrapper>
                <div className="text-center py-8 text-red-500">Error: {error instanceof Error ? error.message : 'Failed to load account'}</div>
            </PageWrapper>
        )
    }

    if (!data?.success || !data.account) {
        return (
            <PageWrapper>
                <div className="text-center py-8">No data available for this account</div>
            </PageWrapper>
        )
    }

    const formatNumber = (num: number, decimals = 2) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(num)
    }

    const formatPercent = (num: number) => {
        return `${formatNumber(num * 100, 2)}%`
    }

    const formatDelta = (num: number, decimals = 2) => {
        const sign = num >= 0 ? '+' : ''
        return `${sign}$${formatNumber(Math.abs(num), decimals)}`
    }

    const getDeltaColor = (num: number) => {
        if (Math.abs(num) < 0.01) return 'text-gray-600'
        return num >= 0 ? 'text-green-600' : 'text-red-600'
    }

    return (
        <PageWrapper>
            {/* Header */}
            <div className="border-b pb-4">
                <h1 className="text-2xl font-mono">Account: {data.account.address}</h1>
                {data.account.name && <p className="text-gray-600">Name: {data.account.name}</p>}
                <p className="text-sm">Status: {data.account.isActive ? 'Monitored Account' : 'Non-Monitored Account (Spot balances only)'}</p>
                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="mt-2 px-4 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isFetching ? (
                        <>
                            <span className="inline-block w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            Refreshing...
                        </>
                    ) : (
                        'Refresh'
                    )}
                </button>
            </div>

            {/* Live Strategy Monitoring - New Charts Section */}
            {data.summary && (
                <div className="space-y-4 border-b pb-6">
                    <h2 className="text-xl font-semibold">Live Strategy Monitoring</h2>

                    {/* Main charts row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4 h-[400px]">
                            <DeltaTrackingChart
                                history={deltaHistory}
                                showSpotDelta={true}
                                showHyperEvmDelta={!!data.summary.hyperEvmDelta}
                                className="h-full"
                            />
                        </div>
                        <div className="border rounded-lg p-4 h-[400px]">
                            <APRBreakdownChart
                                lpFeeAPR={(data.summary.lastSnapshot?.lpFeeAPR || data.summary.currentAPR?.lpFeeAPR || 0) * 100}
                                fundingAPR={(data.summary.lastSnapshot?.fundingAPR || data.summary.currentAPR?.fundingAPR || 0) * 100}
                                rebalancingCost={0.2} // Example 0.2% cost
                                className="h-full"
                            />
                        </div>
                    </div>

                    {/* Secondary charts row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4 h-[300px]">
                            <DeltaThresholdGauge currentDelta={data.summary.netDelta} threshold={100} warningThreshold={200} className="h-full" />
                        </div>
                        <div className="border rounded-lg p-4 h-[300px]">
                            <PositionCompositionBar
                                lpValue={data.summary.totalLpValue}
                                perpMargin={data.summary.totalPerpValue}
                                spotValue={data.summary.totalSpotValue}
                                hyperEvmValue={data.summary.totalHyperEvmValue || 0}
                                totalValue={data.summary.totalValue}
                                className="h-full"
                            />
                        </div>
                        <div className="border rounded-lg p-4 h-[300px]">
                            <RebalancingLog events={deltaHistory.rebalanceEvents} maxEvents={5} className="h-full" />
                        </div>
                    </div>

                    {/* Pool TVL Overview */}
                    <div className="grid grid-cols-1">
                        <PoolTVLTable />
                    </div>
                </div>
            )}

            {/* Summary Section */}
            {data.summary && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Summary</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="border p-3">
                            <div className="text-sm text-gray-600">Total Value</div>
                            <div className="font-mono">${formatNumber(data.summary.totalValue)}</div>
                        </div>
                        <div className="border p-3">
                            <div className="text-sm text-gray-600">LP Value</div>
                            <div className="font-mono">${formatNumber(data.summary.totalLpValue)}</div>
                        </div>
                        <div className="border p-3">
                            <div className="text-sm text-gray-600">Perp Value</div>
                            <div className="font-mono">${formatNumber(data.summary.totalPerpValue)}</div>
                        </div>
                        <div className="border p-3">
                            <div className="text-sm text-gray-600">Spot Value</div>
                            <div className="font-mono">${formatNumber(data.summary.totalSpotValue)}</div>
                        </div>
                        <div className="border p-3">
                            <div className="text-sm text-gray-600">HyperEVM Value</div>
                            <div className="font-mono">${formatNumber(data.summary.totalHyperEvmValue || 0)}</div>
                        </div>
                    </div>

                    {/* Delta Breakdown */}
                    <div className="border p-4">
                        <h3 className="font-semibold mb-2">Delta Exposure (HYPE)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                            <div title="HYPE exposure from LP positions">
                                <span className="text-gray-600">LP Delta:</span>
                                <div className={`font-mono font-semibold ${getDeltaColor(data.summary.lpDelta)}`}>
                                    {formatDelta(data.summary.lpDelta)}
                                </div>
                            </div>
                            <div title="HYPE exposure from perp positions (negative = short)">
                                <span className="text-gray-600">Perp Delta:</span>
                                <div className={`font-mono font-semibold ${getDeltaColor(data.summary.perpDelta)}`}>
                                    {formatDelta(data.summary.perpDelta)}
                                </div>
                            </div>
                            <div title="HYPE held in spot">
                                <span className="text-gray-600">Spot Delta:</span>
                                <div className={`font-mono font-semibold ${getDeltaColor(data.summary.spotDelta)}`}>
                                    {formatDelta(data.summary.spotDelta)}
                                </div>
                            </div>
                            <div title="HYPE held in HyperEVM">
                                <span className="text-gray-600">EVM Delta:</span>
                                <div className={`font-mono font-semibold ${getDeltaColor(data.summary.hyperEvmDelta || 0)}`}>
                                    {formatDelta(data.summary.hyperEvmDelta || 0)}
                                </div>
                            </div>
                            <div title="Net HYPE exposure">
                                <span className="text-gray-600 font-semibold">Net Delta:</span>
                                <div className={`font-mono font-bold text-lg ${getDeltaColor(data.summary.netDelta)}`}>
                                    {formatDelta(data.summary.netDelta)}
                                </div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-600 mt-3 pt-3 border-t">
                            <div>Formula: Net Delta = LP Delta + Perp Delta + Spot Delta + EVM Delta</div>
                            <div className="mt-1">
                                {Math.abs(data.summary.netDelta) < 100 && <span className="text-green-600">✓ Near delta neutral</span>}
                                {Math.abs(data.summary.netDelta) >= 100 && Math.abs(data.summary.netDelta) < 500 && (
                                    <span className="text-yellow-600">⚠ Moderate delta exposure</span>
                                )}
                                {Math.abs(data.summary.netDelta) >= 500 && <span className="text-red-600">⚠ High delta exposure - rebalance needed</span>}
                            </div>
                            {data.summary.perpDelta >= 0 && data.summary.lpDelta > 0 && (
                                <div className="text-red-600 font-semibold mt-1">
                                    ⚠ WARNING: Perp position is not hedging LP exposure! Expected negative perp delta for short hedge.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* APRs */}
                    {(data.summary.lastSnapshot || data.summary.currentAPR) && (
                        <div className="border p-4">
                            <h3 className="font-semibold mb-2">Current APRs</h3>
                            {data.summary.lastSnapshot ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                    <div>LP Fee APR: {formatPercent(data.summary.lastSnapshot.lpFeeAPR)}</div>
                                    <div>Funding APR: {formatPercent(data.summary.lastSnapshot.fundingAPR)}</div>
                                    <div className="font-semibold">Net APR: {formatPercent(data.summary.lastSnapshot.netAPR)}</div>
                                    <div className="text-gray-600">Updated: {new Date(data.summary.lastSnapshot.timestamp).toLocaleString()}</div>
                                </div>
                            ) : data.summary.currentAPR ? (
                                <div className="space-y-2">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                                        <div>LP Fee APR: {formatPercent(data.summary.currentAPR.lpFeeAPR)}</div>
                                        <div>Funding APR: {formatPercent(data.summary.currentAPR.fundingAPR)}</div>
                                        <div className="font-semibold">Net APR: {formatPercent(data.summary.currentAPR.netAPR)}</div>
                                    </div>
                                    <div className="text-xs text-gray-600 border-t pt-2">
                                        <div className="font-mono bg-gray-100 p-2 rounded">{data.summary.currentAPR.formula}</div>
                                        <div className="mt-1">{data.summary.currentAPR.note}</div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            )}

            {/* LP Positions */}
            {data.positions?.lp && data.positions.lp.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">LP Positions ({data.positions.lp.length})</h2>

                    {/* Main Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border text-sm">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border p-2 text-left">Token ID</th>
                                    <th className="border p-2 text-left">DEX</th>
                                    <th className="border p-2 text-left">Pair</th>
                                    <th className="border p-2 text-left">Fee</th>
                                    <th className="border p-2 text-left">Range</th>
                                    <th className="border p-2 text-right">Token0 USD</th>
                                    <th className="border p-2 text-right">Token1 USD</th>
                                    <th className="border p-2 text-right">Total USD</th>
                                    <th className="border p-2 text-center">View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.positions.lp.map((position) => {
                                    const typedDex = position.dex.toLowerCase() as keyof typeof HYPEREVM_DEXS
                                    const positionUrl = HYPEREVM_DEXS[typedDex]?.portfolioUrl || '#'
                                    return (
                                        <tr key={position.id}>
                                            <td className="border p-2 font-mono">{position.tokenId}</td>
                                            <td className="border p-2">{position.dex}</td>
                                            <td className="border p-2">
                                                {position.token0Symbol}/{position.token1Symbol}
                                            </td>
                                            <td className="border p-2">{position.feeTier || 'N/A'}</td>
                                            <td className="border p-2">
                                                <span className={position.inRange ? 'text-green-600' : 'text-red-600'}>
                                                    {position.inRange ? '✓ In' : '✗ Out'}
                                                </span>
                                            </td>
                                            <td className="border p-2 text-right font-mono">
                                                <div className="text-xs text-gray-500">{position.token0Symbol}</div>
                                                <div>{position.token0Amount ? formatNumber(position.token0Amount, 4) : '0'}</div>
                                                <div className="text-xs">${formatNumber(position.token0ValueUSD || 0)}</div>
                                            </td>
                                            <td className="border p-2 text-right font-mono">
                                                <div className="text-xs text-gray-500">{position.token1Symbol}</div>
                                                <div>{position.token1Amount ? formatNumber(position.token1Amount, 4) : '0'}</div>
                                                <div className="text-xs">${formatNumber(position.token1ValueUSD || 0)}</div>
                                            </td>
                                            <td className="border p-2 text-right font-mono font-semibold">${formatNumber(position.valueUSD)}</td>
                                            <td className="border p-2 text-center">
                                                <a
                                                    href={positionUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 underline"
                                                >
                                                    View ↗
                                                </a>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Detailed LP Data */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">LP Position Details</h3>
                        {data.positions.lp.map((position) => (
                            <div key={position.id} className="border p-4 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-mono text-lg">Position #{position.tokenId}</div>
                                        <div className="text-sm text-gray-600">
                                            {position.dex} - {position.token0Symbol}/{position.token1Symbol}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold">${formatNumber(position.valueUSD)}</div>
                                        <div className={`text-sm ${position.inRange ? 'text-green-600' : 'text-red-600'}`}>
                                            {position.inRange ? 'In Range' : 'Out of Range'}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-600">Token0 Address:</span>
                                        <div className="font-mono text-xs truncate">{position.token0}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Token1 Address:</span>
                                        <div className="font-mono text-xs truncate">{position.token1}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Liquidity:</span>
                                        <div className="font-mono">{position.liquidity.toString()}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Fee Tier:</span>
                                        <div>{position.feeTier || `${position.fee ? (position.fee / 10000).toFixed(2) + '%' : 'N/A'}`}</div>
                                    </div>
                                </div>

                                {(position.tickLower !== undefined || position.tickUpper !== undefined) && (
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-gray-600">Tick Range:</span>
                                            <div className="font-mono">
                                                {position.tickLower ?? 'N/A'} → {position.tickUpper ?? 'N/A'}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Price Range:</span>
                                            <div className="font-mono text-xs">
                                                {position.tickLower ? Math.pow(1.0001, position.tickLower).toFixed(4) : 'N/A'} →{' '}
                                                {position.tickUpper ? Math.pow(1.0001, position.tickUpper).toFixed(4) : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-600">{position.token0Symbol} Amount:</span>
                                        <div className="font-mono">{position.token0Amount ? formatNumber(position.token0Amount, 6) : '0'}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">{position.token1Symbol} Amount:</span>
                                        <div className="font-mono">{position.token1Amount ? formatNumber(position.token1Amount, 6) : '0'}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Perp Positions */}
            {data.positions?.perp && data.positions.perp.length > 0 && (
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Perpetual Positions ({data.positions.perp.length})</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border text-sm">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border p-2 text-left">Asset</th>
                                    <th className="border p-2 text-right">Size</th>
                                    <th className="border p-2 text-right">Entry Price</th>
                                    <th className="border p-2 text-right">Mark Price</th>
                                    <th className="border p-2 text-right">Notional Value</th>
                                    <th className="border p-2 text-right">Unrealized PnL</th>
                                    <th className="border p-2 text-right">Funding Paid</th>
                                    <th className="border p-2 text-right">Margin Used</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.positions.perp.map((position) => (
                                    <tr key={position.id}>
                                        <td className="border p-2 font-semibold">{position.asset}</td>
                                        <td className={`border p-2 text-right font-mono ${position.size > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatNumber(position.size, 4)}
                                        </td>
                                        <td className="border p-2 text-right font-mono">${formatNumber(position.entryPrice)}</td>
                                        <td className="border p-2 text-right font-mono">${formatNumber(position.markPrice)}</td>
                                        <td className="border p-2 text-right font-mono">${formatNumber(position.notionalValue)}</td>
                                        <td
                                            className={`border p-2 text-right font-mono ${position.unrealizedPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}
                                        >
                                            ${formatNumber(position.unrealizedPnl)}
                                        </td>
                                        <td className="border p-2 text-right font-mono">${formatNumber(position.fundingPaid)}</td>
                                        <td className="border p-2 text-right font-mono">${formatNumber(position.marginUsed)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Spot Balances */}
            {data.positions?.spot && data.positions.spot.length > 0 && (
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Spot Balances ({data.positions.spot.length})</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border text-sm">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border p-2 text-left">Asset</th>
                                    <th className="border p-2 text-right">Balance</th>
                                    <th className="border p-2 text-right">Value USD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.positions.spot.map((balance) => (
                                    <tr key={balance.id}>
                                        <td className="border p-2 font-semibold">{balance.asset}</td>
                                        <td className="border p-2 text-right font-mono">{balance.balance.toString()}</td>
                                        <td className="border p-2 text-right font-mono">${formatNumber(balance.valueUSD)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* HyperEVM Balances */}
            {data.positions?.hyperEvm && data.positions.hyperEvm.length > 0 && (
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold">HyperEVM Wallet Balances ({data.positions.hyperEvm.length})</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border text-sm">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border p-2 text-left">Asset</th>
                                    <th className="border p-2 text-left">Address</th>
                                    <th className="border p-2 text-right">Balance</th>
                                    <th className="border p-2 text-right">Value USD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.positions.hyperEvm.map((balance) => {
                                    const formattedBalance = Number(balance.balance) / 10 ** balance.decimals
                                    return (
                                        <tr key={balance.id}>
                                            <td className="border p-2 font-semibold">{balance.symbol}</td>
                                            <td className="border p-2 font-mono text-xs">
                                                {balance.address === '0x0000000000000000000000000000000000000000'
                                                    ? 'Native HYPE'
                                                    : balance.address.slice(0, 10) + '...' + balance.address.slice(-8)}
                                            </td>
                                            <td className="border p-2 text-right font-mono">{formatNumber(formattedBalance, 4)}</td>
                                            <td className="border p-2 text-right font-mono">${formatNumber(balance.valueUSD)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* No positions message */}
            {!data.positions?.lp?.length && !data.positions?.perp?.length && !data.positions?.spot?.length && !data.positions?.hyperEvm?.length && (
                <div className="text-center py-8 text-gray-500">No positions found for this account</div>
            )}

            {/* Raw Data Section (for debugging) */}
            <details className="mt-8 border p-4">
                <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">Raw API Response (Debug)</summary>
                <div className="mt-4 space-y-4">
                    <div>
                        <h3 className="font-semibold mb-2">Account Info</h3>
                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(data.account, null, 2)}</pre>
                    </div>

                    {data.summary && (
                        <div>
                            <h3 className="font-semibold mb-2">Summary</h3>
                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(data.summary, null, 2)}</pre>
                        </div>
                    )}

                    {data.positions?.lp && data.positions.lp.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-2">LP Positions (Raw)</h3>
                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(data.positions.lp, null, 2)}</pre>
                        </div>
                    )}

                    {data.positions?.perp && data.positions.perp.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-2">Perp Positions (Raw)</h3>
                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(data.positions.perp, null, 2)}</pre>
                        </div>
                    )}

                    {data.positions?.spot && data.positions.spot.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-2">Spot Balances (Raw)</h3>
                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(data.positions.spot, null, 2)}</pre>
                        </div>
                    )}

                    {data.positions?.hyperEvm && data.positions.hyperEvm.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-2">HyperEVM Balances (Raw)</h3>
                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(data.positions.hyperEvm, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </details>
        </PageWrapper>
    )
}
