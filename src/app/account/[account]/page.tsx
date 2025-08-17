'use client'

import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
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
import { DateWrapperAccurate } from '@/components/common/DateWrapper'
import StyledTooltip from '@/components/common/StyledTooltip'
import IconWrapper from '@/components/icons/IconWrapper'
import { AppUrls, FileIds, IconIds } from '@/enums'
import LinkWrapper from '@/components/common/LinkWrapper'
import { env } from '@/env/t3-env'
import { HypeDeltaTooltip } from '@/components/common/HypeDeltaTooltip'
import { useTheme } from 'next-themes'
import FileMapper from '@/components/common/FileMapper'

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
    const { resolvedTheme } = useTheme()
    const baseClassName = cn('flex flex-col items-center lg:items-end', className)
    const isNumber = typeof value === 'number'
    const color = isNumber && colorFn ? colorFn(value) : undefined

    // Use white text in dark mode, black in light mode for AUM
    const aumColor = label === 'AUM' ? (resolvedTheme === 'dark' ? 'text-white' : 'text-black') : undefined

    return (
        <div className={baseClassName}>
            <span className="text-xs uppercase tracking-wider text-default/50">{label}</span>
            {icon ? (
                <div className="flex items-center gap-1">
                    <span className={cn('text-base font-semibold', color)}>{isNumber ? `${value >= 0 ? '+' : ''}${value.toFixed(1)}` : value}</span>
                    {icon}
                </div>
            ) : (
                <span className={cn('text-lg font-semibold', aumColor)}>{value}</span>
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
        hyperEvm: {
            values: { lpsUSD: 0, balancesUSD: 0, totalUSD: 0 },
            deltas: { lpsHYPE: 0, balancesHYPE: 0, totalHYPE: 0 },
            apr: { weightedAvg24h: null, weightedAvg7d: null, weightedAvg30d: null },
        },
        hyperCore: {
            values: { perpsUSD: 0, spotUSD: 0, totalUSD: 0 },
            deltas: { perpsHYPE: 0, spotHYPE: 0, totalHYPE: 0 },
            perpAggregates: { totalMargin: 0, totalNotional: 0, totalPnl: 0, avgLeverage: 0 },
            apr: { currentFundingAPR: null, fundingAPR24h: null, fundingAPR7d: null, fundingAPR30d: null },
        },
        portfolio: {
            totalUSD: 0,
            netDeltaHYPE: 0,
            apr: { combined24h: null, combined7d: null, combined30d: null },
        },
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

    // Get pre-calculated APRs from the snapshot
    const lpAPRs = metrics.hyperEvm?.apr
    const fundingAPRs = metrics.hyperCore?.apr
    const combinedAPRs = metrics.portfolio?.apr

    // Default to 7d APRs for display (historic data)
    const weightedAvgAPR = lpAPRs?.weightedAvg7d
    const perpFundingAPR = fundingAPRs?.fundingAPR7d ?? fundingAPRs?.currentFundingAPR // Use 7d historic if available, otherwise current
    // const combinedAPR = combinedAPRs?.combined7d  // Currently unused, but available for display

    // Calculate APR range from all time periods
    const aprRange = useMemo(() => {
        const aprs = [combinedAPRs?.combined24h, combinedAPRs?.combined7d, combinedAPRs?.combined30d].filter(
            (apr) => apr !== null && apr !== undefined,
        ) as number[]

        if (aprs.length === 0) return null

        const min = Math.min(...aprs)
        const max = Math.max(...aprs)

        return { min, max }
    }, [combinedAPRs])

    // Calculate total fetch time
    const timings = snapshot?.timings
    const totalFetchTime = timings
        ? (timings.hyperEvm?.lpsMs || 0) + (timings.hyperEvm?.balancesMs || 0) + (timings.hyperCore?.perpsMs || 0) + (timings.hyperCore?.spotsMs || 0)
        : 0

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
                                <div className="h-8 w-px border-l border-dashed border-default/20" />
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
                            <div className="mb-10 flex items-center gap-1">
                                <p className="text-primary">Delta Neutral LP strategy</p>
                                <IconWrapper id={IconIds.ARROW_RIGHT} className="size-4 text-primary" />
                                <p className="text-primary">Farming</p>
                                <FileMapper id={FileIds.TOKEN_HYPE} width={20} height={20} className="z-10 rounded-full" />
                                <FileMapper id={FileIds.TOKEN_USDT0} width={20} height={20} className="-ml-2 rounded-full" />
                                <p className="text-primary">APRs with a dynamic short leg</p>
                            </div>
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
                                        {totalFetchTime > 0 && (
                                            <StyledTooltip
                                                content={
                                                    <div className="space-y-1 text-xs">
                                                        <p className="font-medium">Fetch Times:</p>
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                                                            <span>LPs:</span>
                                                            <span>{timings?.hyperEvm?.lpsMs || 0}ms</span>
                                                            <span>Wallet:</span>
                                                            <span>{timings?.hyperEvm?.balancesMs || 0}ms</span>
                                                            <span>Perps:</span>
                                                            <span>{timings?.hyperCore?.perpsMs || 0}ms</span>
                                                            <span>Spot:</span>
                                                            <span>{timings?.hyperCore?.spotsMs || 0}ms</span>
                                                        </div>
                                                    </div>
                                                }
                                                placement="bottom"
                                            >
                                                <span className="cursor-help">
                                                    <span className="text-default/30">•</span>
                                                    <span className="ml-1">{(totalFetchTime / 1000).toFixed(1)}s</span>
                                                </span>
                                            </StyledTooltip>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Global KPIs */}
                        <div className="flex items-center gap-6">
                            <KPIMetric label="AUM" value={formatUSD(metrics.portfolio?.totalUSD || 0)} />
                            <div className="h-8 w-px border-l border-dashed border-default/20" />
                            <KPIMetric
                                label="Net Δ"
                                value={metrics.portfolio?.netDeltaHYPE}
                                icon={<HypeIcon size={20} />}
                                colorFn={getDeltaColor}
                                className="items-end"
                            />
                            {aprRange !== null && (
                                <>
                                    <div className="h-8 w-px border-l border-dashed border-default/20" />
                                    <div className="flex flex-col items-center lg:items-end">
                                        <span className="text-xs uppercase tracking-wider text-default/50">Net APR</span>
                                        <StyledTooltip
                                            content={
                                                <div className="space-y-2">
                                                    <p className="font-medium">Combined Strategy APR</p>

                                                    <div className="space-y-2">
                                                        {combinedAPRs?.combined24h !== null && combinedAPRs?.combined24h !== undefined && (
                                                            <div>
                                                                <p className="text-xs font-medium text-default">24h APR</p>
                                                                <div className="ml-2 space-y-0.5 text-xs text-default/70">
                                                                    {lpAPRs?.weightedAvg24h !== null && (
                                                                        <p>LP: {lpAPRs.weightedAvg24h.toFixed(2)}%</p>
                                                                    )}
                                                                    {fundingAPRs?.fundingAPR24h !== null && (
                                                                        <p>
                                                                            Funding: {fundingAPRs.fundingAPR24h > 0 ? '+' : ''}
                                                                            {fundingAPRs.fundingAPR24h.toFixed(2)}%
                                                                        </p>
                                                                    )}
                                                                    <p className="font-medium">
                                                                        Net: {combinedAPRs.combined24h > 0 ? '+' : ''}
                                                                        {combinedAPRs.combined24h.toFixed(2)}%
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {combinedAPRs?.combined7d !== null && combinedAPRs?.combined7d !== undefined && (
                                                            <div>
                                                                <p className="text-xs font-medium text-default">7d APR</p>
                                                                <div className="ml-2 space-y-0.5 text-xs text-default/70">
                                                                    {lpAPRs?.weightedAvg7d !== null && <p>LP: {lpAPRs.weightedAvg7d.toFixed(2)}%</p>}
                                                                    {fundingAPRs?.fundingAPR7d !== null && (
                                                                        <p>
                                                                            Funding: {fundingAPRs.fundingAPR7d > 0 ? '+' : ''}
                                                                            {fundingAPRs.fundingAPR7d.toFixed(2)}%
                                                                        </p>
                                                                    )}
                                                                    <p className="font-medium">
                                                                        Net: {combinedAPRs.combined7d > 0 ? '+' : ''}
                                                                        {combinedAPRs.combined7d.toFixed(2)}%
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {combinedAPRs?.combined30d !== null && combinedAPRs?.combined30d !== undefined && (
                                                            <div>
                                                                <p className="text-xs font-medium text-default">30d APR</p>
                                                                <div className="ml-2 space-y-0.5 text-xs text-default/70">
                                                                    {lpAPRs?.weightedAvg30d !== null && (
                                                                        <p>LP: {lpAPRs.weightedAvg30d.toFixed(2)}%</p>
                                                                    )}
                                                                    {fundingAPRs?.fundingAPR30d !== null && (
                                                                        <p>
                                                                            Funding: {fundingAPRs.fundingAPR30d > 0 ? '+' : ''}
                                                                            {fundingAPRs.fundingAPR30d.toFixed(2)}%
                                                                        </p>
                                                                    )}
                                                                    <p className="font-medium">
                                                                        Net: {combinedAPRs.combined30d > 0 ? '+' : ''}
                                                                        {combinedAPRs.combined30d.toFixed(2)}%
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <p className="text-xs italic text-default/50">User-specific, weighted by capital allocation</p>
                                                </div>
                                            }
                                        >
                                            <span
                                                className={cn(
                                                    'cursor-help text-lg font-semibold',
                                                    aprRange.min > 0 && aprRange.max > 0
                                                        ? 'text-success'
                                                        : aprRange.min < 0 && aprRange.max < 0
                                                          ? 'text-error'
                                                          : 'text-default',
                                                )}
                                            >
                                                {Math.abs(aprRange.max - aprRange.min) < 0.01
                                                    ? `${aprRange.min > 0 ? '+' : ''}${aprRange.min.toFixed(2)}%`
                                                    : `${aprRange.min > 0 ? '+' : ''}${aprRange.min.toFixed(2)}% - ${aprRange.max > 0 ? '+' : ''}${aprRange.max.toFixed(2)}%`}
                                            </span>
                                        </StyledTooltip>
                                    </div>
                                </>
                            )}
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
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-1">
                                        <p>
                                            {formatUSD(metrics.hyperEvm?.values?.lpsUSD || 0)} over {positions.hyperEvm?.lps?.length || 0} LP
                                            {positions.hyperEvm?.lps?.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    {weightedAvgAPR !== null && (
                                        <StyledTooltip
                                            content={
                                                <div className="space-y-2">
                                                    <div className="font-medium text-default">LP Weighted Average APR (Historic)</div>
                                                    <div className="space-y-1 text-sm">
                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-default/50">24h APR:</span>
                                                            <span className="font-medium text-default">
                                                                {lpAPRs?.weightedAvg24h !== null ? `${lpAPRs.weightedAvg24h.toFixed(2)}%` : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-default/50">7d APR:</span>
                                                            <span className="font-medium text-default">
                                                                {lpAPRs?.weightedAvg7d !== null ? `${lpAPRs.weightedAvg7d.toFixed(2)}%` : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-default/50">30d APR:</span>
                                                            <span className="font-medium text-default">
                                                                {lpAPRs?.weightedAvg30d !== null ? `${lpAPRs.weightedAvg30d.toFixed(2)}%` : 'N/A'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="pt-1 text-xs text-default/50">User-specific, weighted by position value</div>
                                                </div>
                                            }
                                        >
                                            <div className="flex items-center gap-1 rounded bg-default/5 px-2 py-1">
                                                <p className="text-sm font-medium text-primary">
                                                    {weightedAvgAPR < 0.01 && weightedAvgAPR > 0
                                                        ? `${weightedAvgAPR.toFixed(4)}% APR`
                                                        : `${weightedAvgAPR.toFixed(2)}% APR`}
                                                </p>
                                            </div>
                                        </StyledTooltip>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <HypeDeltaTooltip delta={metrics.hyperEvm?.deltas?.lpsHYPE || 0} hypePrice={hypePrice} decimals={1} />
                                        <HypeIcon size={20} />
                                        <p className="text-default/50">Δ</p>
                                    </div>
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
                                <div className="flex items-center gap-6">
                                    <p>{formatUSD(positions.hyperEvm?.balances?.reduce((sum, b) => sum + b.valueUSD, 0) || 0)}</p>
                                    <div className="flex items-center gap-1">
                                        <HypeDeltaTooltip delta={metrics.hyperEvm?.deltas?.balancesHYPE || 0} hypePrice={hypePrice} decimals={1} />
                                        <HypeIcon size={20} />
                                        <p className="text-default/50">Δ</p>
                                    </div>
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
                        <>
                            <HypeDeltaTooltip
                                delta={(metrics.hyperEvm?.deltas?.lpsHYPE || 0) + (metrics.hyperEvm?.deltas?.balancesHYPE || 0)}
                                hypePrice={hypePrice}
                                decimals={1}
                            />
                            <HypeIcon size={20} />
                            <p className="text-default/50">Δ</p>
                        </>
                    ),
                }}
                hyperCore={{
                    short: (
                        <CollapsibleCard
                            title={<h3 className="text-lg font-semibold text-hyper-core-perps">Perpetuals leg</h3>}
                            defaultExpanded={false}
                            headerRight={
                                <div className="flex items-center gap-6">
                                    <p>{formatUSD(metrics.hyperCore?.perpAggregates?.totalMargin || 0)} margin</p>
                                    {perpFundingAPR != null && (
                                        <StyledTooltip
                                            content={
                                                <div className="space-y-2">
                                                    <div className="font-medium text-default">Funding Weighted Average APR (Historic)</div>
                                                    <div className="space-y-1 text-sm">
                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-default/50">24h APR:</span>
                                                            <span className="font-medium text-default">
                                                                {fundingAPRs?.fundingAPR24h !== null
                                                                    ? `${fundingAPRs.fundingAPR24h > 0 ? '+' : ''}${fundingAPRs.fundingAPR24h.toFixed(2)}%`
                                                                    : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-default/50">7d APR:</span>
                                                            <span className="font-medium text-default">
                                                                {fundingAPRs?.fundingAPR7d !== null
                                                                    ? `${fundingAPRs.fundingAPR7d > 0 ? '+' : ''}${fundingAPRs.fundingAPR7d.toFixed(2)}%`
                                                                    : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between gap-4">
                                                            <span className="text-default/50">30d APR:</span>
                                                            <span className="font-medium text-default">
                                                                {fundingAPRs?.fundingAPR30d !== null
                                                                    ? `${fundingAPRs.fundingAPR30d > 0 ? '+' : ''}${fundingAPRs.fundingAPR30d.toFixed(2)}%`
                                                                    : 'N/A'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="pt-1 text-xs text-default/50">User-specific, weighted by position notional</div>
                                                </div>
                                            }
                                        >
                                            <div className="flex items-center gap-1 rounded bg-default/5 px-2 py-1">
                                                <p
                                                    className={cn(
                                                        'text-sm font-medium',
                                                        perpFundingAPR > 0 ? 'text-success' : perpFundingAPR < 0 ? 'text-error' : 'text-default',
                                                    )}
                                                >
                                                    {perpFundingAPR > 0 ? '+' : ''}
                                                    {perpFundingAPR.toFixed(2)}% APR
                                                </p>
                                            </div>
                                        </StyledTooltip>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <HypeDeltaTooltip delta={metrics.hyperCore?.deltas?.perpsHYPE || 0} hypePrice={hypePrice} decimals={1} />
                                        <HypeIcon size={20} />
                                        <p className="text-default/50">Δ</p>
                                    </div>
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
                                <div className="flex items-center gap-6">
                                    <p>{formatUSD(positions.hyperCore?.spots?.reduce((sum, b) => sum + b.valueUSD, 0) || 0)}</p>
                                    <div className="flex items-center gap-1">
                                        <HypeDeltaTooltip delta={metrics.hyperCore?.deltas?.spotHYPE || 0} hypePrice={hypePrice} decimals={1} />
                                        <HypeIcon size={20} />
                                        <p className="text-default/50">Δ</p>
                                    </div>
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
                        <>
                            <HypeDeltaTooltip
                                delta={(metrics.hyperCore?.deltas?.perpsHYPE || 0) + (metrics.hyperCore?.deltas?.spotHYPE || 0)}
                                hypePrice={hypePrice}
                                decimals={1}
                            />
                            <HypeIcon size={20} />
                        </>
                    ),
                }}
            />
        </PageWrapper>
    )
}
