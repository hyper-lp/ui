'use client'

import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import PageWrapper from '@/components/common/PageWrapper'
import { useAccountData } from '@/hooks/useAccountData'
import { useAppStore } from '@/stores/app.store'
import { LPPositionsTable, WalletBalancesTable, PerpPositionsTable, SpotBalancesTable } from '@/components/app/account/tables'
import AccountTemplate from '@/components/app/account/layout/AccountTemplate'
import { CollapsibleCard } from '@/components/app/account/CollapsibleCard'
import { REFRESH_INTERVALS } from '@/config/app.config'
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
import { AppUrls, IconIds } from '@/enums'
import LinkWrapper from '@/components/common/LinkWrapper'
import { env } from '@/env/t3-env'

// Dynamically import chart to avoid SSR issues
const DeltaTrackingChart = dynamic(() => import('@/components/charts/account/DeltaTrackingChart'), {
    ssr: false,
    loading: () => <div className="flex size-full items-center justify-center text-sm text-default/50">Loading chart...</div>,
})

// Helper function for delta color
const getDeltaColor = (value: number): string => {
    const absValue = Math.abs(value)
    if (absValue < 0.1) return 'text-default'
    if (absValue < 10) return 'text-success'
    if (absValue < 20) return 'text-warning'
    return 'text-error'
}

// KPI Metric Component
interface KPIMetricProps {
    label: string
    value: number | string
    icon?: React.ReactNode
    colorFn?: (value: number) => string
    className?: string
}

const KPIMetric: React.FC<KPIMetricProps> = ({ label, value, icon, colorFn, className }) => {
    const baseClassName = cn('flex flex-col items-center lg:items-end', className)
    const isNumber = typeof value === 'number'
    const color = isNumber && colorFn ? colorFn(value) : undefined

    return (
        <div className={baseClassName}>
            <span className="text-xs uppercase tracking-wider text-default/50">{label}</span>
            {icon ? (
                <div className="flex items-center gap-1">
                    {icon}
                    <span className={cn('text-base font-semibold', color)}>{isNumber ? `${value >= 0 ? '+' : ''}${value.toFixed(1)}` : value}</span>
                </div>
            ) : (
                <span className="text-lg font-semibold">{value}</span>
            )}
        </div>
    )
}

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

        const updateInterval = IS_DEV ? REFRESH_INTERVALS.DEV : REFRESH_INTERVALS.PROD

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

    // Show loading state while initial data is being fetched or if we don't have price data
    if ((isLoading && !snapshot) || !hypePrice) {
        return (
            <PageWrapper className="px-4">
                <AccountTemplate
                    header={
                        <div className="flex flex-col gap-4 px-2 lg:flex-row lg:items-center lg:justify-between lg:px-4">
                            {/* Address skeleton */}
                            <div className="flex flex-col">
                                <div className="flex items-baseline gap-2 text-sm">
                                    <div className="h-7 w-96 animate-pulse rounded bg-default/20" />
                                    <div className="h-5 w-16 animate-pulse rounded bg-default/20" />
                                    <div className="h-5 w-12 animate-pulse rounded bg-default/20" />
                                    <div className="h-5 w-10 animate-pulse rounded bg-default/20" />
                                </div>
                                <div className="mt-1 flex items-center gap-1.5 text-sm">
                                    <div className="h-6 w-6 animate-pulse rounded bg-default/20" />
                                    <div className="h-5 w-48 animate-pulse rounded bg-default/20" />
                                </div>
                            </div>

                            {/* KPIs skeleton */}
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col items-center lg:items-end">
                                    <div className="h-3 w-8 animate-pulse rounded bg-default/20" />
                                    <div className="mt-1 h-7 w-20 animate-pulse rounded bg-default/20" />
                                </div>
                                <div className="h-8 w-px bg-default/20" />
                                <div className="flex flex-col items-end">
                                    <div className="h-3 w-10 animate-pulse rounded bg-default/20" />
                                    <div className="mt-1 h-6 w-16 animate-pulse rounded bg-default/20" />
                                </div>
                            </div>
                        </div>
                    }
                    charts={<div className="flex size-full items-center justify-center text-sm text-default/50">Loading chart...</div>}
                    summary={null}
                    hyperEvm={{
                        lp: (
                            <CollapsibleCard
                                title={<h3 className="text-lg font-semibold text-hyper-evm-lps">LPs leg</h3>}
                                defaultExpanded={false}
                                isLoading
                            />
                        ),
                        balances: (
                            <CollapsibleCard
                                title={<h3 className="text-lg font-semibold text-hyper-evm-balances">Wallet</h3>}
                                defaultExpanded={false}
                                isLoading
                            />
                        ),
                        txs: null,
                    }}
                    hyperCore={{
                        short: (
                            <CollapsibleCard
                                title={<h3 className="text-lg font-semibold text-hyper-core-perps">Perpetuals leg</h3>}
                                defaultExpanded={false}
                                isLoading
                            />
                        ),
                        spot: (
                            <CollapsibleCard
                                title={<h3 className="text-lg font-semibold text-hyper-core-spots">Spot</h3>}
                                defaultExpanded={false}
                                isLoading
                            />
                        ),
                        txs: null,
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
                    <div className="flex flex-col gap-4 px-2 lg:flex-row lg:items-center lg:justify-between lg:px-4">
                        {/* Address */}
                        <div className="flex flex-col">
                            <div className="flex items-baseline gap-2 text-sm">
                                <p className="hidden text-lg font-medium xl:flex">{accountFromUrl}</p>
                                <p className="flex text-lg font-medium xl:hidden">{shortenValue(accountFromUrl, 6)}</p>
                                {[
                                    {
                                        name: 'debank',
                                        description: 'DeBank profile',
                                        url: `https://debank.com/profile/${accountFromUrl}`,
                                    },
                                    {
                                        name: 'scan',
                                        description: 'HyperEVM scan',
                                        url: `https://hyperevmscan.io/address/${accountFromUrl}`,
                                    },
                                    {
                                        name: 'raw',
                                        description: 'API snapshot',
                                        url: `${env.NEXT_PUBLIC_APP_URL}/${AppUrls.API_SNAPSHOT}/${accountFromUrl}`,
                                    },
                                ].map((link) => (
                                    <div key={link.name}>
                                        <StyledTooltip key={link.name} content={<p>{link.description}</p>}>
                                            <LinkWrapper target="_blank" href={link.url}>
                                                <p className="cursor-alias text-default/50 hover:text-default hover:underline">{link.name}</p>
                                            </LinkWrapper>
                                        </StyledTooltip>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-default/50">
                                <button
                                    onClick={() => refetch()}
                                    disabled={isFetching}
                                    className="rounded bg-default/5 p-1 hover:bg-default/10 hover:text-default disabled:opacity-50"
                                    title="Refresh all page data for this address"
                                >
                                    <IconWrapper id={IconIds.REFRESH} className={cn('size-3.5', isFetching && 'animate-spin')} />
                                </button>
                                {isFetching ? (
                                    <p>Fetching live onchain data</p>
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
                        <div className="flex items-center gap-6">
                            <KPIMetric label="AUM" value={formatUSD(metrics.portfolio?.totalUSD || 0)} />
                            <div className="h-8 w-px bg-default/20" />
                            <KPIMetric
                                label="Net Δ"
                                value={metrics.portfolio?.netDeltaHYPE}
                                icon={<HypeIcon size={15} />}
                                colorFn={getDeltaColor}
                                className="items-end"
                            />
                        </div>
                    </div>
                }
                charts={<DeltaTrackingChart />}
                summary={null}
                hyperEvm={{
                    lp: (
                        <CollapsibleCard
                            title={<h3 className="text-lg font-semibold text-hyper-evm-lps">LPs leg</h3>}
                            defaultExpanded={true}
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
                            title={<h3 className="text-lg font-semibold text-hyper-evm-balances">Wallet</h3>}
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
                    txs: null,
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
                            title={<h3 className="text-lg font-semibold text-hyper-core-perps">Perpetuals leg</h3>}
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
                            title={<h3 className="text-lg font-semibold text-hyper-core-spots">Spot</h3>}
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
                    txs: null,
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
