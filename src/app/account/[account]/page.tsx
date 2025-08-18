'use client'

import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import PageWrapper from '@/components/common/PageWrapper'
import { useAccountData } from '@/hooks/useAccountData'
import { useAppStore } from '@/stores/app.store'
import { LPPositionsTable, WalletBalancesTable, PerpPositionsTable, SpotBalancesTable } from '@/components/app/account/tables'
import { CombinedActivity, HyperCoreTransactionHistory } from '@/components/app/account'
import AccountTemplate from '@/components/app/account/layout/AccountTemplate'
import { CollapsibleCard } from '@/components/app/account/CollapsibleCard'
import { REFRESH_INTERVALS } from '@/config/app.config'
import { IS_DEV } from '@/config'
import { formatUSD, shortenValue } from '@/utils'
import { cn } from '@/utils'
import { calculateHypePrice, calculateTokenBreakdown } from '@/utils/token.util'
import { DAYJS_FORMATS, getDurationBetween } from '@/utils/date.util'
import { HypeIcon } from '@/components/common/HypeIcon'
import { TimeAgo } from '@/components/common/DateWrapper'
import StyledTooltip from '@/components/common/StyledTooltip'
import IconWrapper from '@/components/icons/IconWrapper'
import { FileIds, IconIds } from '@/enums'
import LinkWrapper from '@/components/common/LinkWrapper'
import { HypeDeltaTooltip } from '@/components/common/HypeDeltaTooltip'
import { useTheme } from 'next-themes'
import FileMapper from '@/components/common/FileMapper'
import numeral from 'numeral'

// Dynamically import chart to avoid SSR issues
const DeltaTrackingChart = dynamic(() => import('@/components/charts/account/DeltaTrackingChart'), {
    ssr: false,
    loading: () => <div className="flex h-[400px] w-full items-center justify-center text-sm text-default/50 md:h-[550px]">Loading chart...</div>,
})

// Helper function for delta color
// const getDeltaColor = (value: number): string => {
//     const absValue = Math.abs(value)
//     if (absValue < 0.1) return 'text-default'
//     if (absValue < 10) return 'text-success'
//     if (absValue < 20) return 'text-warning'
//     return 'text-error'
// }

// KPI Metric Component
interface KPIMetricProps {
    label: string
    value: number | string
    icon?: React.ReactNode
    colorFn?: (value: number) => string
    className?: string
    tooltip?: React.ReactNode
}

const KPIMetric: React.FC<KPIMetricProps> = ({ label, value, icon, colorFn, className, tooltip }) => {
    const { resolvedTheme } = useTheme()
    const baseClassName = cn('flex flex-col items-center lg:items-end', className)
    const isNumber = typeof value === 'number'
    const color = isNumber && colorFn ? colorFn(value) : undefined

    // Use white text in dark mode, black in light mode for AUM
    const aumColor = label === 'AUM' ? (resolvedTheme === 'dark' ? 'text-white' : 'text-black') : undefined

    const content = (
        <div className={baseClassName}>
            <span className="text-base tracking-wider text-default/50">{label}</span>
            {icon ? (
                <div className="flex items-center gap-1">
                    <span className={cn('text-base font-semibold', color)}>{isNumber ? `${value >= 0 ? '+' : ''}${value.toFixed(1)}` : value}</span>
                    {icon}
                </div>
            ) : (
                <span className={cn('text-xl font-semibold', aumColor)}>{value}</span>
            )}
        </div>
    )

    if (tooltip) {
        return (
            <StyledTooltip content={tooltip} placement="bottom">
                {content}
            </StyledTooltip>
        )
    }

    return content
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
            values: { lpsUSD: 0, lpsUSDWithFees: 0, unclaimedFeesUSD: 0, balancesUSD: 0, totalUSD: 0 },
            deltas: { lpsHYPE: 0, balancesHYPE: 0, totalHYPE: 0 },
            apr: { weightedAvg24h: null, weightedAvg7d: null, weightedAvg30d: null },
        },
        hyperCore: {
            values: { perpsUSD: 0, spotUSD: 0, totalUSD: 0, withdrawableUSDC: 0 },
            deltas: { perpsHYPE: 0, spotHYPE: 0, totalHYPE: 0 },
            perpAggregates: { totalMargin: 0, totalNotional: 0, totalPnl: 0, avgLeverage: 0 },
            apr: { currentFundingAPR: null, fundingAPR24h: null, fundingAPR7d: null, fundingAPR30d: null },
        },
        portfolio: {
            totalUSD: 0,
            deployedAUM: 0,
            netDeltaHYPE: 0,
            strategyDelta: 0,
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
    const weightedAvgAPR = lpAPRs?.weightedAvg24h
    const perpFundingAPR = fundingAPRs?.fundingAPR24h ?? fundingAPRs?.currentFundingAPR // Use 7d historic if available, otherwise current
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

    // Show loading state while initial data is being fetched or if we don't have price data
    if ((isLoading && !snapshot) || !hypePrice) {
        return (
            <PageWrapper className="px-4">
                <AccountTemplate
                    header={
                        <div className="flex flex-col gap-4 px-2 lg:flex-row lg:items-center lg:justify-between lg:px-4">
                            {/* Address skeleton - mirrors the actual loaded header structure */}
                            <div className="flex flex-col">
                                <div className="mb-10 flex items-center gap-1">
                                    <div className="h-5 w-36 animate-pulse rounded bg-default/20" />
                                    <div className="h-4 w-4 animate-pulse rounded bg-default/20" />
                                    <div className="h-5 w-16 animate-pulse rounded bg-default/20" />
                                    <div className="h-5 w-5 animate-pulse rounded-full bg-default/20" />
                                    <div className="h-5 w-5 animate-pulse rounded-full bg-default/20" />
                                    <div className="h-5 w-48 animate-pulse rounded bg-default/20" />
                                </div>
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

                            {/* KPIs skeleton - matches the actual KPIs layout */}
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col items-center lg:items-end">
                                    <div className="h-3 w-8 animate-pulse rounded bg-default/20" />
                                    <div className="mt-1 h-7 w-20 animate-pulse rounded bg-default/20" />
                                </div>
                                <div className="h-8 w-px border-l border-dashed border-default/20" />
                                <div className="flex flex-col items-end">
                                    <div className="h-3 w-12 animate-pulse rounded bg-default/20" />
                                    <div className="mt-1 flex items-center gap-1">
                                        <div className="h-6 w-8 animate-pulse rounded bg-default/20" />
                                        <div className="h-5 w-5 animate-pulse rounded-full bg-default/20" />
                                    </div>
                                </div>
                                <div className="h-8 w-px border-l border-dashed border-default/20" />
                                <div className="flex flex-col items-end">
                                    <div className="h-3 w-24 animate-pulse rounded bg-default/20" />
                                    <div className="mt-1 h-6 w-16 animate-pulse rounded bg-default/20" />
                                </div>
                            </div>
                        </div>
                    }
                    charts={
                        <div className="flex h-[400px] w-full items-center justify-center text-sm text-default/50 md:h-[500px]">Loading chart...</div>
                    }
                    summary={null}
                    hyperEvm={{
                        lp: (
                            <CollapsibleCard
                                title={
                                    <h3 className="text-lg font-semibold text-hyper-evm-lps">
                                        LPs
                                        <span className="text-sm text-default/50">Long leg</span>
                                    </h3>
                                }
                                defaultExpanded={false}
                                headerRight={
                                    <div className="flex items-center gap-6">
                                        <div className="h-5 w-24 animate-pulse rounded bg-default/20" />
                                        <div className="h-6 w-16 animate-pulse rounded bg-default/5" />
                                        <div className="flex items-center gap-1">
                                            <div className="h-5 w-8 animate-pulse rounded bg-default/20" />
                                            <div className="h-5 w-5 animate-pulse rounded-full bg-default/20" />
                                            <div className="h-4 w-4 animate-pulse rounded bg-default/20" />
                                        </div>
                                    </div>
                                }
                                isLoading
                            />
                        ),
                        balances: (
                            <CollapsibleCard
                                title={<h3 className="text-lg font-semibold text-hyper-evm-balances">Wallet</h3>}
                                defaultExpanded={false}
                                headerRight={
                                    <div className="flex items-center gap-6">
                                        <div className="h-5 w-16 animate-pulse rounded bg-default/20" />
                                        <div className="flex items-center gap-1">
                                            <div className="h-5 w-8 animate-pulse rounded bg-default/20" />
                                            <div className="h-5 w-5 animate-pulse rounded-full bg-default/20" />
                                            <div className="h-4 w-4 animate-pulse rounded bg-default/20" />
                                        </div>
                                    </div>
                                }
                                isLoading
                            />
                        ),
                        txs: null,
                        capital: <div className="h-5 w-32 animate-pulse rounded bg-default/20" />,
                        delta: (
                            <div className="flex items-center gap-1">
                                <div className="h-5 w-8 animate-pulse rounded bg-default/20" />
                                <div className="h-5 w-5 animate-pulse rounded-full bg-default/20" />
                                <div className="h-4 w-4 animate-pulse rounded bg-default/20" />
                            </div>
                        ),
                    }}
                    hyperCore={{
                        short: (
                            <CollapsibleCard
                                title={<h3 className="text-lg font-semibold text-hyper-core-perps">Perpetuals leg</h3>}
                                defaultExpanded={false}
                                headerRight={
                                    <div className="flex items-center gap-6">
                                        <div className="h-5 w-20 animate-pulse rounded bg-default/20" />
                                        <div className="h-6 w-16 animate-pulse rounded bg-default/5" />
                                        <div className="flex items-center gap-1">
                                            <div className="h-5 w-8 animate-pulse rounded bg-default/20" />
                                            <div className="h-5 w-5 animate-pulse rounded-full bg-default/20" />
                                            <div className="h-4 w-4 animate-pulse rounded bg-default/20" />
                                        </div>
                                    </div>
                                }
                                isLoading
                            />
                        ),
                        spot: (
                            <CollapsibleCard
                                title={<h3 className="text-lg font-semibold text-hyper-core-spots">Spot</h3>}
                                defaultExpanded={false}
                                headerRight={
                                    <div className="flex items-center gap-6">
                                        <div className="h-5 w-16 animate-pulse rounded bg-default/20" />
                                        <div className="flex items-center gap-1">
                                            <div className="h-5 w-8 animate-pulse rounded bg-default/20" />
                                            <div className="h-5 w-5 animate-pulse rounded-full bg-default/20" />
                                            <div className="h-4 w-4 animate-pulse rounded bg-default/20" />
                                        </div>
                                    </div>
                                }
                                isLoading
                            />
                        ),
                        txs: null,
                        capital: <div className="h-5 w-32 animate-pulse rounded bg-default/20" />,
                        delta: (
                            <div className="flex items-center gap-1">
                                <div className="h-5 w-8 animate-pulse rounded bg-default/20" />
                                <div className="h-5 w-5 animate-pulse rounded-full bg-default/20" />
                            </div>
                        ),
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
                    <div className="mb-4 flex flex-col gap-4 px-2 lg:px-4">
                        {/* Title */}
                        <div className="flex w-full flex-wrap items-center gap-1">
                            <p className="text-wrap text-primary">Example of Delta Neutral LP</p>
                            <IconWrapper id={IconIds.ARROW_RIGHT} className="size-4 text-primary" />
                            <p className="text-wrap text-primary">Farm</p>
                            <FileMapper id={FileIds.TOKEN_HYPE} width={20} height={20} className="z-10 rounded-full" />
                            <FileMapper id={FileIds.TOKEN_USDT0} width={20} height={20} className="-ml-2 rounded-full" />
                            <p className="text-wrap text-primary">APRs with a dynamic short leg</p>
                        </div>

                        {/* Summary */}
                        <div className="flex w-full flex-col gap-6 lg:flex-row lg:justify-between">
                            {/* Address */}
                            <div className="flex flex-col">
                                {/* row */}
                                <div className="flex items-baseline gap-2 text-sm">
                                    <p className="hidden text-xl font-medium xl:flex">{accountFromUrl}</p>
                                    <p className="flex text-xl font-medium xl:hidden">{shortenValue(accountFromUrl, 6)}</p>
                                    {[
                                        {
                                            name: 'evm',
                                            description: 'HyperEVM explorer',
                                            url: `https://hyperevmscan.io/address/${accountFromUrl}`,
                                        },
                                        {
                                            name: 'core',
                                            description: 'HyperLiquid explorer',
                                            url: `https://app.hyperliquid.xyz/explorer/address/${accountFromUrl}`,
                                        },
                                        {
                                            name: 'debank',
                                            description: 'DeBank profile',
                                            url: `https://debank.com/profile/${accountFromUrl}`,
                                        },
                                        // {
                                        //     name: 'raw',
                                        //     description: 'API snapshot',
                                        //     url: `${env.NEXT_PUBLIC_APP_URL}/${AppUrls.API_SNAPSHOT}/${accountFromUrl}`,
                                        // },
                                    ].map((link) => (
                                        <div key={link.name}>
                                            <StyledTooltip key={link.name} content={<p>{link.description}</p>}>
                                                <LinkWrapper
                                                    target="_blank"
                                                    href={link.url}
                                                    className="flex cursor-alias items-center gap-0.5 text-default/50 hover:text-default hover:underline"
                                                >
                                                    <p>{link.name}</p>
                                                    <IconWrapper id={IconIds.ARROW_UP_RIGHT} className="size-3.5" />
                                                </LinkWrapper>
                                            </StyledTooltip>
                                        </div>
                                    ))}
                                </div>

                                {/* row */}
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
                                            <StyledTooltip
                                                content={
                                                    <div className="text-sm">
                                                        <div>{DAYJS_FORMATS.dateLong(lastRefreshTime || 0)}</div>
                                                        <p className="mt-2">API calls timing (we use RPCs)</p>
                                                        <div className="text-default/60">
                                                            LPs {timings?.hyperEvm?.lpsMs || 0}ms • Wallet {timings?.hyperEvm?.balancesMs || 0}ms •
                                                            Perps {timings?.hyperCore?.perpsMs || 0}ms • Spot {timings?.hyperCore?.spotsMs || 0}ms
                                                        </div>
                                                    </div>
                                                }
                                                placement="bottom"
                                            >
                                                <span className="flex items-center gap-1">
                                                    <p>Last update</p>
                                                    <TimeAgo date={lastRefreshTime} />
                                                </span>
                                            </StyledTooltip>
                                            {nextUpdateIn && (
                                                <>
                                                    <span className="text-default/30">•</span>
                                                    <p>next in {nextUpdateIn}</p>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Global KPIs */}
                            <div className="flex items-center gap-6">
                                {/* <KPIMetric
                                    label="AUM"
                                    value={formatUSD(metrics.portfolio?.totalUSD || 0)}
                                    className="hidden md:flex"
                                    tooltip={
                                        <div className="space-y-3">
                                            <div className="font-semibold">Total AUM on Hyperliquid</div>

                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium opacity-60">HyperEVM</span>
                                                    <span className="font-medium">
                                                        {formatUSD(
                                                            (metrics.hyperEvm?.values?.lpsUSD || 0) +
                                                                (metrics.hyperEvm?.values?.unclaimedFeesUSD || 0) +
                                                                (metrics.hyperEvm?.values?.balancesUSD || 0),
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="ml-3 space-y-0.5">
                                                    <div className="flex justify-between gap-6">
                                                        <span className="opacity-60">LP positions</span>
                                                        <span>{formatUSD(metrics.hyperEvm?.values?.lpsUSD || 0)}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-6">
                                                        <span className="opacity-60">Unclaimed fees</span>
                                                        <span>{formatUSD(metrics.hyperEvm?.values?.unclaimedFeesUSD || 0)}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-6">
                                                        <span className="opacity-60">Wallet balances</span>
                                                        <span>{formatUSD(metrics.hyperEvm?.values?.balancesUSD || 0)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium opacity-60">HyperCore</span>
                                                    <span className="font-medium">
                                                        {formatUSD(
                                                            (metrics.hyperCore?.values?.perpsUSD || 0) +
                                                                (metrics.hyperCore?.values?.spotUSD || 0) +
                                                                (metrics.hyperCore?.values?.withdrawableUSDC || 0),
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="ml-3">
                                                    <div className="flex justify-between gap-6">
                                                        <span className="opacity-60">Perp positions</span>
                                                        <span>{formatUSD(metrics.hyperCore?.values?.perpsUSD || 0)}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-6">
                                                        <span className="opacity-60">Spot balances</span>
                                                        <span>{formatUSD(metrics.hyperCore?.values?.spotUSD || 0)}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-6">
                                                        <span className="opacity-60">Withdrawable</span>
                                                        <span>{formatUSD(metrics.hyperCore?.values?.withdrawableUSDC || 0)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-default/10 pt-2">
                                                <div className="flex justify-between font-medium">
                                                    <span>Total AUM</span>
                                                    <span>{formatUSD(metrics.portfolio?.totalUSD || 0)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                />
                                <div className="hidden h-8 w-px border-l border-dashed border-default/20 md:flex" /> */}
                                <KPIMetric
                                    label="Deployed AUM"
                                    value={formatUSD(metrics.portfolio?.deployedAUM || 0)}
                                    className="hidden md:flex"
                                    tooltip={
                                        <div className="space-y-3">
                                            <div className="font-semibold">Deployed AUM on this strategy</div>

                                            <div className="space-y-0">
                                                <div className="opacity-75">Capital actively deployed</div>

                                                <div className="ml-3">
                                                    <div className="flex justify-between gap-6">
                                                        <span className="opacity-60">LPs</span>
                                                        <span>{formatUSD(metrics.hyperEvm?.values?.lpsUSDWithFees || 0)}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-6">
                                                        <span className="opacity-60">Perpetual positions</span>
                                                        <span>{formatUSD(metrics.hyperCore?.values?.perpsUSD || 0)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between font-medium">
                                                <span>= Total deployed AUM</span>
                                                <span>{formatUSD(metrics.portfolio?.deployedAUM || 0)}</span>
                                            </div>

                                            <div className="mb-1 opacity-60">Excludes idle/dust capital (wallet & spot)</div>
                                        </div>
                                    }
                                />
                                {/* <div className="hidden h-8 w-px border-l border-dashed border-default/20 md:flex" />
                                <KPIMetric
                                    label="Strategy Δ"
                                    value={metrics.portfolio?.strategyDelta || 0}
                                    icon={<HypeIcon size={18} />}
                                    colorFn={getDeltaColor}
                                    className="items-end"
                                    tooltip={
                                        <div className="space-y-3">
                                            <div className="font-semibold">Strategy Delta (Hedge Effectiveness)</div>

                                            <div className="space-y-1.5">
                                                <div className="opacity-75">Net HYPE exposure from active positions</div>

                                                <div className="ml-3">
                                                    <div className="flex justify-between gap-6">
                                                        <span className="opacity-60">LP HYPE exposure</span>
                                                        <span>{(metrics.hyperEvm?.deltas?.lpsHYPE || 0).toFixed(2)} HYPE</span>
                                                    </div>
                                                    <div className="flex justify-between gap-6">
                                                        <span className="opacity-60">Perp hedge</span>
                                                        <span>{(metrics.hyperCore?.deltas?.perpsHYPE || 0).toFixed(2)} HYPE</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-default/10 pt-2">
                                                <div className="mb-1 flex justify-between font-medium">
                                                    <span>Strategy Δ</span>
                                                    <span className={getDeltaColor(metrics.portfolio?.strategyDelta || 0)}>
                                                        {(metrics.portfolio?.strategyDelta || 0).toFixed(2)} HYPE
                                                    </span>
                                                </div>
                                                <div className="opacity-60">
                                                    {Math.abs(metrics.hyperCore?.deltas?.perpsHYPE || 0) < 0.01 && '❌ Not hedged'}
                                                    {Math.abs(metrics.hyperCore?.deltas?.perpsHYPE || 0) >= 0.01 &&
                                                        Math.abs(metrics.portfolio?.strategyDelta || 0) < 0.1 &&
                                                        '✓ Perfectly hedged'}
                                                    {Math.abs(metrics.hyperCore?.deltas?.perpsHYPE || 0) >= 0.01 &&
                                                        Math.abs(metrics.portfolio?.strategyDelta || 0) >= 0.1 &&
                                                        Math.abs(metrics.portfolio?.strategyDelta || 0) < 2 &&
                                                        '✓ Well hedged'}
                                                    {Math.abs(metrics.hyperCore?.deltas?.perpsHYPE || 0) >= 0.01 &&
                                                        Math.abs(metrics.portfolio?.strategyDelta || 0) >= 2 &&
                                                        Math.abs(metrics.portfolio?.strategyDelta || 0) < 10 &&
                                                        '⚠ Drift detected'}
                                                    {Math.abs(metrics.hyperCore?.deltas?.perpsHYPE || 0) >= 0.01 &&
                                                        Math.abs(metrics.portfolio?.strategyDelta || 0) >= 10 &&
                                                        '⚠ Rebalance needed'}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                /> */}
                                {aprRange !== null && (
                                    <>
                                        <div className="h-8 w-px border-l border-dashed border-default/20" />
                                        <div className="flex flex-col items-center lg:items-end">
                                            <span className="text-base tracking-wider text-default/50">Gross Delta-Neutral APR</span>
                                            <StyledTooltip
                                                content={
                                                    <div className="space-y-3">
                                                        {/* <div className="font-semibold">Strategy APR</div> */}

                                                        <div className="space-y-1 pb-2">
                                                            <div className="flex items-center gap-1 text-sm font-medium">
                                                                <span>Gross Delta-Neutral APR on Deployed AUM</span>
                                                            </div>
                                                            <div className="text-sm">= (2/3 × LP APR) + (1/3 × Funding APR)</div>
                                                        </div>

                                                        {/* 24h APR */}
                                                        {combinedAPRs?.combined24h !== null && combinedAPRs?.combined24h !== undefined && (
                                                            <div className="space-y-0">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="font-medium">24h</span>
                                                                    <span className="font-medium">
                                                                        {combinedAPRs.combined24h > 0 ? '+' : ''}
                                                                        {combinedAPRs.combined24h.toFixed(0)}% before IL
                                                                    </span>
                                                                </div>
                                                                <div className="ml-3">
                                                                    {lpAPRs?.weightedAvg24h !== null && (
                                                                        <div className="flex justify-between gap-6">
                                                                            <span className="opacity-60">2/3 LP APR</span>
                                                                            <span className="opacity-60">{lpAPRs.weightedAvg24h.toFixed(1)}% </span>
                                                                        </div>
                                                                    )}
                                                                    {fundingAPRs?.fundingAPR24h !== null && (
                                                                        <div className="flex justify-between gap-6">
                                                                            <span className="opacity-60">1/3 Funding APR</span>
                                                                            <span className="opacity-60">
                                                                                {fundingAPRs.fundingAPR24h > 0 ? '+' : ''}
                                                                                {fundingAPRs.fundingAPR24h.toFixed(1)}%
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* 7d APR */}
                                                        {combinedAPRs?.combined7d !== null && combinedAPRs?.combined7d !== undefined && (
                                                            <div className="space-y-0">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="font-medium">7d</span>
                                                                    <span className="font-medium">
                                                                        {combinedAPRs.combined7d > 0 ? '+' : ''}
                                                                        {combinedAPRs.combined7d.toFixed(0)}% before IL
                                                                    </span>
                                                                </div>
                                                                <div className="ml-3 space-y-0.5">
                                                                    {lpAPRs?.weightedAvg7d !== null && (
                                                                        <div className="flex justify-between gap-6">
                                                                            <span className="opacity-60">2/3 LP APR</span>
                                                                            <span className="opacity-60">{lpAPRs.weightedAvg7d.toFixed(1)}%</span>
                                                                        </div>
                                                                    )}
                                                                    {fundingAPRs?.fundingAPR7d !== null && (
                                                                        <div className="flex justify-between gap-6">
                                                                            <span className="opacity-60">1/3 Funding APR</span>
                                                                            <span className="opacity-60">
                                                                                {fundingAPRs.fundingAPR7d > 0 ? '+' : ''}
                                                                                {fundingAPRs.fundingAPR7d.toFixed(1)}%
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* 30d APR */}
                                                        {combinedAPRs?.combined30d !== null && combinedAPRs?.combined30d !== undefined && (
                                                            <div className="space-y-1">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="font-medium">30d</span>
                                                                    <span className="font-medium">
                                                                        {combinedAPRs.combined30d > 0 ? '+' : ''}
                                                                        {combinedAPRs.combined30d.toFixed(0)}% before IL
                                                                    </span>
                                                                </div>
                                                                <div className="ml-3 space-y-0.5">
                                                                    {lpAPRs?.weightedAvg30d !== null && (
                                                                        <div className="flex justify-between gap-6">
                                                                            <span className="opacity-60">2/3 LP APR</span>
                                                                            <span className="opacity-60">{lpAPRs.weightedAvg30d.toFixed(1)}%</span>
                                                                        </div>
                                                                    )}
                                                                    {fundingAPRs?.fundingAPR30d !== null && (
                                                                        <div className="flex justify-between gap-6">
                                                                            <span className="opacity-60">1/3 Funding APR</span>
                                                                            <span className="opacity-60">
                                                                                {fundingAPRs.fundingAPR30d > 0 ? '+' : ''}
                                                                                {fundingAPRs.fundingAPR30d.toFixed(1)}%
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                }
                                            >
                                                <p
                                                    className={cn(
                                                        'cursor-help text-xl font-semibold',
                                                        aprRange.min > 0 && aprRange.max > 0
                                                            ? 'text-success'
                                                            : aprRange.min < 0 && aprRange.max < 0
                                                              ? 'text-error'
                                                              : 'text-default',
                                                    )}
                                                >
                                                    {Math.abs(aprRange.max - aprRange.min) < 0.01 ? (
                                                        `${aprRange.min > 0 ? '+' : ''}${aprRange.min.toFixed(2)}%`
                                                    ) : (
                                                        <span>
                                                            <span className="pr-1 text-sm text-default/50">low</span>
                                                            <span>
                                                                {aprRange.min > 0 ? '+' : ''}
                                                                {aprRange.min.toFixed(0)}%
                                                            </span>

                                                            <span className="pl-4 pr-1 text-sm text-default/50">high</span>
                                                            <span>
                                                                {aprRange.max > 0 ? '+' : ''}
                                                                {aprRange.max.toFixed(0)}%
                                                            </span>
                                                        </span>
                                                    )}
                                                </p>
                                            </StyledTooltip>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                }
                charts={<DeltaTrackingChart />}
                summary={null}
                hyperEvm={{
                    lp: (
                        <CollapsibleCard
                            title={<h3 className="text-lg font-semibold text-hyper-evm-lps">LPs</h3>}
                            defaultExpanded={false}
                            headerRight={
                                <div className="flex items-center gap-6">
                                    {weightedAvgAPR !== null && (
                                        <StyledTooltip
                                            content={
                                                <div className="space-y-3">
                                                    <div className="font-semibold">LP average APR (historic)</div>

                                                    <div className="space-y-2">
                                                        <div className="flex justify-between gap-6">
                                                            <span className="text-sm font-medium opacity-60">24h APR</span>
                                                            <span className="text-sm font-medium">
                                                                {lpAPRs?.weightedAvg24h !== null ? `${lpAPRs.weightedAvg24h.toFixed(2)}%` : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between gap-6">
                                                            <span className="text-sm font-medium opacity-60">7d APR</span>
                                                            <span className="text-sm font-medium">
                                                                {lpAPRs?.weightedAvg7d !== null ? `${lpAPRs.weightedAvg7d.toFixed(2)}%` : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between gap-6">
                                                            <span className="text-sm font-medium opacity-60">30d APR</span>
                                                            <span className="text-sm font-medium">
                                                                {lpAPRs?.weightedAvg30d !== null ? `${lpAPRs.weightedAvg30d.toFixed(2)}%` : 'N/A'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="border-t border-default/10 pt-2">
                                                        <div className="text-sm opacity-60">Weighted by position value</div>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <div className="flex items-center gap-1 rounded bg-default/5 px-2 py-1">
                                                <p className="text-sm text-default/50">24h APR</p>
                                                <p className="text-sm font-medium text-success">
                                                    {weightedAvgAPR < 0.01 && weightedAvgAPR > 0
                                                        ? `${numeral(weightedAvgAPR).divide(100).format('0,0.[0]%')}`
                                                        : `${numeral(weightedAvgAPR).divide(100).format('0,0.[0]%')}`}{' '}
                                                </p>
                                            </div>
                                        </StyledTooltip>
                                    )}
                                    <p>{numeral(metrics.hyperEvm?.values?.lpsUSDWithFees || 0).format('0,0$')}</p>
                                    {/* <div className="flex w-20 items-center justify-end gap-1">
                                        <HypeDeltaTooltip delta={metrics.hyperEvm?.deltas?.lpsHYPE || 0} hypePrice={hypePrice} decimals={1} />
                                        <HypeIcon size={20} />
                                        <p className="text-default/50">Δ</p>
                                    </div> */}
                                </div>
                            }
                        >
                            <LPPositionsTable />
                        </CollapsibleCard>
                    ),
                    balances: (
                        <CollapsibleCard
                            title={
                                <h3 className="text-lg font-semibold text-hyper-evm-balances">
                                    Wallet
                                    {/* <span className="pl-2 text-default/30">pays gas</span> */}
                                </h3>
                            }
                            defaultExpanded={false}
                            headerRight={
                                <div className="flex items-center gap-6">
                                    <p>{numeral(positions.hyperEvm?.balances?.reduce((sum, b) => sum + b.valueUSD, 0) || 0).format('0,0$')}</p>
                                    {/* <div className="flex w-20 items-center justify-end gap-1">
                                        <HypeDeltaTooltip delta={metrics.hyperEvm?.deltas?.balancesHYPE || 0} hypePrice={hypePrice} decimals={1} />
                                        <HypeIcon size={20} />
                                        <p className="text-default/50">Δ</p>
                                    </div> */}
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
                            title={<h3 className="text-lg font-semibold text-hyper-core-perps">Perps</h3>}
                            defaultExpanded={false}
                            headerRight={
                                <div className="flex items-center gap-6">
                                    {perpFundingAPR != null && (
                                        <StyledTooltip
                                            content={
                                                <div className="space-y-3">
                                                    <div className="font-semibold">Funding Rates (8h settlement)</div>

                                                    <div className="space-y-2">
                                                        <div className="flex justify-between gap-3">
                                                            <span className="text-sm font-medium opacity-60">Current 8h</span>
                                                            <span className="text-sm font-medium">
                                                                {fundingAPRs?.currentFundingAPR !== null
                                                                    ? `${fundingAPRs.currentFundingAPR > 0 ? '+' : ''}${(fundingAPRs.currentFundingAPR / (365 * 3)).toFixed(4)}%`
                                                                    : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between gap-3">
                                                            <span className="text-sm font-medium opacity-60">24h APR</span>
                                                            <span className="text-sm font-medium">
                                                                {fundingAPRs?.fundingAPR24h !== null
                                                                    ? `${fundingAPRs.fundingAPR24h > 0 ? '+' : ''}${fundingAPRs.fundingAPR24h.toFixed(2)}%`
                                                                    : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between gap-3">
                                                            <span className="text-sm font-medium opacity-60">7d APR</span>
                                                            <span className="text-sm font-medium">
                                                                {fundingAPRs?.fundingAPR7d !== null
                                                                    ? `${fundingAPRs.fundingAPR7d > 0 ? '+' : ''}${fundingAPRs.fundingAPR7d.toFixed(2)}%`
                                                                    : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between gap-3">
                                                            <span className="text-sm font-medium opacity-60">30d APR</span>
                                                            <span className="text-sm font-medium">
                                                                {fundingAPRs?.fundingAPR30d !== null
                                                                    ? `${fundingAPRs.fundingAPR30d > 0 ? '+' : ''}${fundingAPRs.fundingAPR30d.toFixed(2)}%`
                                                                    : 'N/A'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="border-t border-default/10 pt-2">
                                                        <div className="text-sm opacity-60">Weighted by position notional</div>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <div className="flex items-center gap-1 rounded bg-default/5 px-2 py-1">
                                                <p className="text-sm text-default/50">Funding APR</p>
                                                <p
                                                    className={cn(
                                                        'text-sm font-medium',
                                                        perpFundingAPR > 0 ? 'text-success' : perpFundingAPR < 0 ? 'text-error' : 'text-default',
                                                    )}
                                                >
                                                    {perpFundingAPR > 0 ? '+' : ''}
                                                    {numeral(perpFundingAPR).format('0,0.0%')}
                                                </p>
                                            </div>
                                        </StyledTooltip>
                                    )}
                                    <p>{numeral(metrics.hyperCore?.values?.perpsUSD || 0).format('0,0$')}</p>
                                    {/* <div className="flex w-20 items-center justify-end gap-1">
                                        <HypeDeltaTooltip delta={metrics.hyperCore?.deltas?.perpsHYPE || 0} hypePrice={hypePrice} decimals={1} />
                                        <HypeIcon size={20} />
                                        <p className="text-default/50">Δ</p>
                                    </div> */}
                                </div>
                            }
                        >
                            <PerpPositionsTable />
                        </CollapsibleCard>
                    ),
                    spot: (
                        <CollapsibleCard
                            title={
                                <h3 className="text-lg font-semibold text-hyper-core-spots">
                                    Spot
                                    <span className="pl-1 text-default/30">= dust</span>
                                </h3>
                            }
                            defaultExpanded={false}
                            headerRight={
                                <div className="flex items-center gap-6">
                                    <p>{numeral(positions.hyperCore?.spots?.reduce((sum, b) => sum + b.valueUSD, 0) || 0).format('0,0$')}</p>
                                    {/* <div className="flex w-20 items-center justify-end gap-1">
                                        <HypeDeltaTooltip delta={metrics.hyperCore?.deltas?.spotHYPE || 0} hypePrice={hypePrice} decimals={1} />
                                        <HypeIcon size={20} />
                                        <p className="text-default/50">Δ</p>
                                    </div> */}
                                </div>
                            }
                        >
                            <SpotBalancesTable />
                        </CollapsibleCard>
                    ),
                    txs: (
                        <CollapsibleCard title="Trades" defaultExpanded={false} headerRight={null}>
                            <HyperCoreTransactionHistory account={params.account as string} limit={50} />
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
                activity={
                    <CollapsibleCard title="Activity" defaultExpanded={false} headerRight={null}>
                        <CombinedActivity account={params.account as string} limit={50} />
                    </CollapsibleCard>
                }
            />
        </PageWrapper>
    )
}
