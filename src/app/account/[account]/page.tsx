'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import PageWrapper from '@/components/common/PageWrapper'
import { HYPEREVM_DEXS } from '@/config/hyperevm-dexs.config'

interface AccountData {
    success: boolean
    account?: {
        address: string
        name: string | null
        isActive: boolean
    }
    positions?: {
        lp: Array<{
            id: string
            tokenId: string
            dex: string
            token0Symbol: string
            token1Symbol: string
            liquidity: string | number
            valueUSD: number
            inRange: boolean
            feeTier: number | null
            token0ValueUSD?: number
            token1ValueUSD?: number
        }>
        perp: Array<{
            id: string
            asset: string
            size: number
            entryPrice: number
            markPrice: number
            marginUsed: number
            unrealizedPnl: number
            fundingPaid: number
            notionalValue: number
        }>
        spot: Array<{
            id: string
            asset: string
            balance: string | number
            valueUSD: number
        }>
    }
    summary?: {
        totalLpValue: number
        totalPerpValue: number
        totalSpotValue: number
        totalValue: number
        netDelta: number
        lpDelta: number
        perpDelta: number
        spotDelta: number
        lastSnapshot: {
            timestamp: string
            netAPR: number
            lpFeeAPR: number
            fundingAPR: number
        } | null
    }
    error?: string
}

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

    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ['account', account],
        queryFn: () => fetchAccountData(account),
        enabled: !!account,
        staleTime: 60000, // Consider data fresh for 60 seconds
        gcTime: 300000, // Keep in cache for 5 minutes (gcTime replaces cacheTime in v5)
        refetchInterval: 60000, // Refresh every 60 seconds
    })

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

            {/* Summary Section */}
            {data.summary && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Summary</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    </div>

                    {/* Delta Breakdown */}
                    <div className="border p-4">
                        <h3 className="font-semibold mb-2">Delta Exposure</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div>LP Delta: ${formatNumber(data.summary.lpDelta)}</div>
                            <div>Perp Delta: ${formatNumber(data.summary.perpDelta)}</div>
                            <div>Spot Delta: ${formatNumber(data.summary.spotDelta)}</div>
                            <div className="font-semibold">Net Delta: ${formatNumber(data.summary.netDelta)}</div>
                        </div>
                    </div>

                    {/* APRs */}
                    {data.summary.lastSnapshot && (
                        <div className="border p-4">
                            <h3 className="font-semibold mb-2">Current APRs</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                <div>LP Fee APR: {formatPercent(data.summary.lastSnapshot.lpFeeAPR)}</div>
                                <div>Funding APR: {formatPercent(data.summary.lastSnapshot.fundingAPR)}</div>
                                <div className="font-semibold">Net APR: {formatPercent(data.summary.lastSnapshot.netAPR)}</div>
                                <div className="text-gray-600">Updated: {new Date(data.summary.lastSnapshot.timestamp).toLocaleString()}</div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* LP Positions */}
            {data.positions?.lp && data.positions.lp.length > 0 && (
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold">LP Positions ({data.positions.lp.length})</h2>
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
                                                <div className="text-xs text-gray-500">{position.token0Symbol}</div>$
                                                {formatNumber(position.token0ValueUSD || 0)}
                                            </td>
                                            <td className="border p-2 text-right font-mono">
                                                <div className="text-xs text-gray-500">{position.token1Symbol}</div>$
                                                {formatNumber(position.token1ValueUSD || 0)}
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

            {/* No positions message */}
            {!data.positions?.lp?.length && !data.positions?.perp?.length && !data.positions?.spot?.length && (
                <div className="text-center py-8 text-gray-500">No positions found for this account</div>
            )}
        </PageWrapper>
    )
}
