'use client'

import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import PageWrapper from '@/components/common/PageWrapper'
import { useAccountData } from '@/hooks/useAccountData'
import { useAppStore } from '@/stores/app.store'
import { TransactionHistory } from '@/components/app/account'
import { HyperCoreTransactionHistory } from '@/components/app/account/HyperCoreTransactionHistory'
import { LPPositionsTable, WalletBalancesTable, PerpPositionsTable, SpotBalancesTable } from '@/components/app/account/tables'
import AccountTemplate from '@/components/app/account/layout/AccountTemplate'
import { CollapsibleSection as CollapsibleCard } from '@/components/app/account/CollapsibleCard'
import { DEFAULT_TRANSACTION_LIMIT } from '@/config/app.config'
import { IS_DEV } from '@/config'
import { formatUSD, shortenValue } from '@/utils'
import { cn } from '@/utils'
import { calculateHypePrice, calculateTokenBreakdown } from '@/utils/token.util'
import { getDurationBetween } from '@/utils/date.util'
import { HypeIcon } from '@/components/common/HypeIcon'
import { DeltaDisplay } from '@/components/common/DeltaDisplay'
import { DateWrapperAccurate } from '@/components/common/DateWrapper'
import StyledTooltip from '@/components/common/StyledTooltip'
import IconWrapper from '@/components/icons/IconWrapper'
import { IconIds } from '@/enums'

// Dynamically import chart to avoid SSR issues
const DeltaTrackingChart = dynamic(() => import('@/components/charts/account/DeltaTrackingChart'), {
    ssr: false,
    loading: () => <div className="flex size-full items-center justify-center text-sm text-default/50">Loading chart...</div>,
})

export default function AccountPage() {
    const params = useParams()
    const accountFromUrl = params?.account as string
    const [lastRefreshTime, setLastRefreshTime] = useState<number | null>(null)
    const [nextUpdateIn, setNextUpdateIn] = useState<string>('')

    // Use the simplified hook for data fetching
    const { isLoading, isFetching, error, refetch } = useAccountData(accountFromUrl)

    // Get data directly from the store
    const getLatestSnapshot = useAppStore((state) => state.getLatestSnapshot)
    const snapshot = getLatestSnapshot()

    // Update refresh time when new data arrives
    useEffect(() => {
        if (snapshot) {
            setLastRefreshTime(Date.now())
        }
    }, [snapshot])

    // Calculate next update countdown
    useEffect(() => {
        if (!lastRefreshTime) return

        const updateInterval = IS_DEV ? 300000 : 30000 // 5 min in dev, 30 sec in prod

        const calculateTimeLeft = () => {
            const now = Date.now()
            const nextUpdateTime = lastRefreshTime + updateInterval

            if (now >= nextUpdateTime) {
                return 'now'
            }

            const duration = getDurationBetween({
                startTs: now,
                endTs: nextUpdateTime,
                showYears: false,
                showMonths: false,
                showWeeks: false,
                showDays: false,
                showHours: false,
                showMinutes: true,
                showSeconds: true,
                shortFormat: true,
                ago: false,
            })

            // Remove the "ago" suffix from oneLiner
            return duration.oneLiner.replace(' ago', '').trim()
        }

        // Update immediately
        setNextUpdateIn(calculateTimeLeft())

        // Update every second
        const timer = setInterval(() => {
            setNextUpdateIn(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(timer)
    }, [lastRefreshTime])

    // Extract data with defaults
    const positions = snapshot?.positions || { hyperEvm: { lps: [], balances: [] }, hyperCore: { perps: [], spots: [] } }
    const metrics = snapshot?.metrics || {
        hyperEvm: { values: { lpsUSD: 0, balancesUSD: 0, totalUSD: 0 }, deltas: { lpsHYPE: 0, balancesHYPE: 0, totalHYPE: 0 } },
        hyperCore: {
            values: { perpsUSD: 0, spotUSD: 0, totalUSD: 0 },
            deltas: { perpsHYPE: 0, spotHYPE: 0, totalHYPE: 0 },
            perpAggregates: { totalMargin: 0, totalNotional: 0, totalPnl: 0, avgLeverage: 0 },
        },
        portfolio: { totalUSD: 0, netDeltaHYPE: 0 },
    }
    const prices = snapshot?.prices || { HYPE: 0, USDC: 1, USDT: 1 }

    // Calculate HyperEVM capital breakdown (HYPE vs Stable) - must be before early returns
    const hyperEvmBreakdown = calculateTokenBreakdown(positions.hyperEvm?.lps, positions.hyperEvm?.balances)

    // Calculate HyperCore capital and leverage metrics - must be before early returns
    const margin = metrics.hyperCore?.perpAggregates?.totalMargin || 0
    const notional = metrics.hyperCore?.perpAggregates?.totalNotional || 0
    const leverage = metrics.hyperCore?.perpAggregates?.avgLeverage || 0
    const spotValue = positions.hyperCore?.spots?.reduce((sum, b) => sum + b.valueUSD, 0) || 0
    const hyperCoreBreakdown = {
        total: margin + spotValue,
        margin,
        notional,
        leverage,
        spotValue,
    }

    // Get HYPE price from the latest snapshot data, fallback to calculated price
    const hypePrice = prices?.HYPE || calculateHypePrice({ lp: positions.hyperEvm?.lps, wallet: positions.hyperEvm?.balances })

    // Show loading state while initial data is being fetched
    if (isLoading && !snapshot) {
        return (
            <PageWrapper>
                <AccountTemplate
                    header={
                        <div className="mb-4 w-full">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-96 animate-pulse rounded bg-default/20" />
                                    <div className="h-8 w-8 animate-pulse rounded bg-default/20" />
                                </div>
                                <div className="hidden items-center gap-5 xl:flex">
                                    <div className="h-12 w-20 animate-pulse rounded bg-default/20" />
                                    <div className="h-12 w-20 animate-pulse rounded bg-default/20" />
                                    <div className="h-12 w-20 animate-pulse rounded bg-default/20" />
                                    <div className="h-12 w-20 animate-pulse rounded bg-default/20" />
                                    <div className="h-12 w-20 animate-pulse rounded bg-default/20" />
                                    <div className="h-8 w-px bg-default/20" />
                                    <div className="h-12 w-20 animate-pulse rounded bg-default/20" />
                                </div>
                            </div>
                        </div>
                    }
                    summary={null}
                    hyperEvm={{
                        lp: <CollapsibleCard title="LPs" defaultExpanded={false} isLoading />,
                        balances: <CollapsibleCard title="Wallet" defaultExpanded={false} isLoading />,
                        txs: <CollapsibleCard title="Transactions" defaultExpanded={false} isLoading />,
                    }}
                    hyperCore={{
                        short: <CollapsibleCard title="Perpetuals" defaultExpanded={false} isLoading />,
                        spot: <CollapsibleCard title="Spot" defaultExpanded={false} isLoading />,
                        txs: <CollapsibleCard title="Trades" defaultExpanded={false} isLoading />,
                    }}
                />
            </PageWrapper>
        )
    }

    // Show simple error state if there's an error
    if (error && !snapshot) {
        return (
            <PageWrapper className="px-4">
                <div className="space-y-4 py-12 text-center">
                    <p className="text-default/50">{error instanceof Error ? error.message : 'Failed to load account'}</p>
                </div>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper className="px-4">
            <AccountTemplate
                header={
                    <div className="flex items-center justify-between px-2 md:px-4">
                        <div className="flex flex-col gap-1">
                            <p className="hidden text-lg font-medium md:flex">{accountFromUrl}</p>
                            <p className="flex text-lg font-medium md:hidden">{shortenValue(accountFromUrl, 6)}</p>
                            <div className="flex items-center gap-1 text-sm text-default/50">
                                <button
                                    onClick={() => refetch()}
                                    disabled={isFetching}
                                    className="rounded p-1 hover:bg-default/10 disabled:opacity-50"
                                    title="Refresh all page data for this address"
                                >
                                    <IconWrapper id={IconIds.REFRESH} className={cn(`size-4`, isFetching && 'animate-spin')} />
                                </button>
                                {isFetching ? (
                                    <p>Updating with latest data...</p>
                                ) : (
                                    <>
                                        <p>Last updated</p>
                                        <DateWrapperAccurate date={lastRefreshTime} />
                                        {nextUpdateIn && (
                                            <>
                                                <span className="text-default/30">•</span>
                                                <p>Next in {nextUpdateIn}</p>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Global KPIs */}
                        <div className="hidden items-center gap-5 xl:flex">
                            <div className="flex flex-col items-end">
                                <span className="text-xs uppercase tracking-wider text-default/50">AUM</span>
                                <span className="text-lg font-semibold">{formatUSD(metrics.portfolio?.totalUSD || 0)}</span>
                            </div>
                            <div className="h-8 w-px bg-default/20" />
                            <div className="flex flex-col items-end">
                                <span className="text-xs uppercase tracking-wider text-default/50">LP Δ</span>
                                <div className="flex items-center gap-1">
                                    <HypeIcon size={14} />
                                    <span
                                        className={cn(
                                            'text-base font-semibold',
                                            Math.abs(metrics.hyperEvm?.deltas?.lpsHYPE || 0) < 0.1
                                                ? 'text-default'
                                                : Math.abs(metrics.hyperEvm?.deltas?.lpsHYPE || 0) < 10
                                                  ? 'text-success'
                                                  : Math.abs(metrics.hyperEvm?.deltas?.lpsHYPE || 0) < 20
                                                    ? 'text-warning'
                                                    : 'text-error',
                                        )}
                                    >
                                        {metrics.hyperEvm?.deltas?.lpsHYPE >= 0 ? '+' : ''}
                                        {metrics.hyperEvm?.deltas?.lpsHYPE?.toFixed(1) || '0.0'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs uppercase tracking-wider text-default/50">Wallet Δ</span>
                                <div className="flex items-center gap-1">
                                    <HypeIcon size={14} />
                                    <span
                                        className={cn(
                                            'text-base font-semibold',
                                            Math.abs(metrics.hyperEvm?.deltas?.balancesHYPE || 0) < 0.1
                                                ? 'text-default'
                                                : Math.abs(metrics.hyperEvm?.deltas?.balancesHYPE || 0) < 10
                                                  ? 'text-success'
                                                  : Math.abs(metrics.hyperEvm?.deltas?.balancesHYPE || 0) < 20
                                                    ? 'text-warning'
                                                    : 'text-error',
                                        )}
                                    >
                                        {metrics.hyperEvm?.deltas?.balancesHYPE >= 0 ? '+' : ''}
                                        {metrics.hyperEvm?.deltas?.balancesHYPE?.toFixed(1) || '0.0'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs uppercase tracking-wider text-default/50">Perp Δ</span>
                                <div className="flex items-center gap-1">
                                    <HypeIcon size={14} />
                                    <span
                                        className={cn(
                                            'text-base font-semibold',
                                            Math.abs(metrics.hyperCore?.deltas?.perpsHYPE || 0) < 0.1 ? 'text-default' : 'text-error',
                                        )}
                                    >
                                        {metrics.hyperCore?.deltas?.perpsHYPE >= 0 ? '+' : ''}
                                        {metrics.hyperCore?.deltas?.perpsHYPE?.toFixed(1) || '0.0'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs uppercase tracking-wider text-default/50">Spot Δ</span>
                                <div className="flex items-center gap-1">
                                    <HypeIcon size={14} />
                                    <span
                                        className={cn(
                                            'text-base font-semibold',
                                            Math.abs(metrics.hyperCore?.deltas?.spotHYPE || 0) < 0.1
                                                ? 'text-default'
                                                : Math.abs(metrics.hyperCore?.deltas?.spotHYPE || 0) < 10
                                                  ? 'text-success'
                                                  : Math.abs(metrics.hyperCore?.deltas?.spotHYPE || 0) < 20
                                                    ? 'text-warning'
                                                    : 'text-error',
                                        )}
                                    >
                                        {metrics.hyperCore?.deltas?.spotHYPE >= 0 ? '+' : ''}
                                        {metrics.hyperCore?.deltas?.spotHYPE?.toFixed(1) || '0.0'}
                                    </span>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-default/20" />
                            <div className="flex flex-col items-end">
                                <span className="text-xs uppercase tracking-wider text-default/50">Net Δ</span>
                                <div className="flex items-center gap-1">
                                    <HypeIcon size={14} />
                                    <span
                                        className={cn(
                                            'text-base font-semibold',
                                            Math.abs(metrics.portfolio?.netDeltaHYPE || 0) < 0.1
                                                ? 'text-default'
                                                : Math.abs(metrics.portfolio?.netDeltaHYPE || 0) < 10
                                                  ? 'text-success'
                                                  : Math.abs(metrics.portfolio?.netDeltaHYPE || 0) < 20
                                                    ? 'text-warning'
                                                    : 'text-error',
                                        )}
                                    >
                                        {metrics.portfolio?.netDeltaHYPE >= 0 ? '+' : ''}
                                        {metrics.portfolio?.netDeltaHYPE?.toFixed(1) || '0.0'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                charts={<DeltaTrackingChart />}
                summary={null}
                hyperEvm={{
                    lp: (
                        <CollapsibleCard
                            title="Liquidity Positions"
                            defaultExpanded={false}
                            headerRight={
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-base text-default">
                                        <span className="font-medium">
                                            $ {(metrics.hyperEvm?.values?.lpsUSD || 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        </span>
                                        <span>•</span>
                                        <span>
                                            {positions.hyperEvm?.lps?.length || 0} LP{positions.hyperEvm?.lps?.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <DeltaDisplay delta={metrics.hyperEvm?.deltas?.lpsHYPE || 0} hypePrice={hypePrice} decimals={1} />
                                </div>
                            }
                        >
                            <LPPositionsTable />
                        </CollapsibleCard>
                    ),
                    balances: (
                        <CollapsibleCard
                            title="Wallet"
                            defaultExpanded={false}
                            headerRight={
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-medium text-default">
                                        ${' '}
                                        {(positions.hyperEvm?.balances?.reduce((sum, b) => sum + b.valueUSD, 0) || 0)
                                            .toFixed(0)
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    </span>
                                    <DeltaDisplay delta={metrics.hyperEvm?.deltas?.balancesHYPE || 0} hypePrice={hypePrice} decimals={1} />
                                </div>
                            }
                        >
                            <WalletBalancesTable />
                        </CollapsibleCard>
                    ),
                    txs: (
                        <CollapsibleCard title="Transactions" defaultExpanded={false}>
                            <TransactionHistory account={accountFromUrl} limit={DEFAULT_TRANSACTION_LIMIT} />
                        </CollapsibleCard>
                    ),
                    capital:
                        hyperEvmBreakdown.total > 0 ? (
                            <StyledTooltip
                                content={
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between gap-8">
                                            <span className="text-default">HYPE:</span>
                                            <span className="font-medium text-default">
                                                {formatUSD(hyperEvmBreakdown.hypeValue)} ({hyperEvmBreakdown.hypePercent.toFixed(0)}%)
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-8">
                                            <span className="text-default">Stable:</span>
                                            <span className="font-medium text-default">
                                                {formatUSD(hyperEvmBreakdown.stableValue)} ({hyperEvmBreakdown.stablePercent.toFixed(0)}%)
                                            </span>
                                        </div>
                                    </div>
                                }
                                placement="bottom"
                            >
                                <div className="cursor-help text-sm font-medium text-default">
                                    Deployed capital: {formatUSD(hyperEvmBreakdown.total)}
                                </div>
                            </StyledTooltip>
                        ) : null,
                    delta: (
                        <DeltaDisplay
                            delta={(metrics.hyperEvm?.deltas?.lpsHYPE || 0) + (metrics.hyperEvm?.deltas?.balancesHYPE || 0)}
                            hypePrice={hypePrice}
                            decimals={1}
                        />
                    ),
                }}
                hyperCore={{
                    short: (
                        <CollapsibleCard
                            title="Perpetuals"
                            defaultExpanded={false}
                            headerRight={
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 text-base text-default">
                                        <span>
                                            $ {(metrics.hyperCore?.perpAggregates?.totalMargin || 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                                            margin
                                        </span>
                                        <span>•</span>
                                        <span>{(metrics.hyperCore?.perpAggregates?.avgLeverage || 0).toFixed(1)}x lev</span>
                                    </div>
                                    <DeltaDisplay delta={metrics.hyperCore?.deltas?.perpsHYPE || 0} hypePrice={hypePrice} decimals={1} />
                                </div>
                            }
                        >
                            <PerpPositionsTable />
                        </CollapsibleCard>
                    ),
                    spot: (
                        <CollapsibleCard
                            title="Spot"
                            defaultExpanded={false}
                            headerRight={
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-medium text-default">
                                        ${' '}
                                        {(positions.hyperCore?.spots?.reduce((sum, b) => sum + b.valueUSD, 0) || 0)
                                            .toFixed(0)
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    </span>
                                    <DeltaDisplay delta={metrics.hyperCore?.deltas?.spotHYPE || 0} hypePrice={hypePrice} decimals={1} />
                                </div>
                            }
                        >
                            <SpotBalancesTable />
                        </CollapsibleCard>
                    ),
                    txs: (
                        <CollapsibleCard title="Trades" defaultExpanded={false}>
                            <HyperCoreTransactionHistory account={accountFromUrl} limit={DEFAULT_TRANSACTION_LIMIT} />
                        </CollapsibleCard>
                    ),
                    capital:
                        hyperCoreBreakdown.total > 0 ? (
                            <StyledTooltip
                                content={
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between gap-8">
                                            <span className="text-default">Margin:</span>
                                            <span className="font-medium text-default">{formatUSD(hyperCoreBreakdown.margin)}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-8">
                                            <span className="text-default">Notional:</span>
                                            <span className="font-medium text-default">{formatUSD(hyperCoreBreakdown.notional)}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-8">
                                            <span className="text-default">Leverage:</span>
                                            <span className="font-medium text-default">{hyperCoreBreakdown.leverage.toFixed(1)}x</span>
                                        </div>
                                        {hyperCoreBreakdown.spotValue > 0 && (
                                            <div className="flex items-center justify-between gap-8 border-t border-default/20 pt-1">
                                                <span className="text-default">Spot:</span>
                                                <span className="font-medium text-default">{formatUSD(hyperCoreBreakdown.spotValue)}</span>
                                            </div>
                                        )}
                                    </div>
                                }
                                placement="bottom"
                            >
                                <div className="cursor-help text-sm font-medium text-default">
                                    Deployed capital: {formatUSD(hyperCoreBreakdown.total)}
                                </div>
                            </StyledTooltip>
                        ) : null,
                    delta: (
                        <DeltaDisplay
                            delta={(metrics.hyperCore?.deltas?.perpsHYPE || 0) + (metrics.hyperCore?.deltas?.spotHYPE || 0)}
                            hypePrice={hypePrice}
                            decimals={1}
                        />
                    ),
                }}
            />
        </PageWrapper>
    )
}
