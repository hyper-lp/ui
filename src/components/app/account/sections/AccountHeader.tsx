'use client'

import { useMemo, useState, useRef, useEffect } from 'react'
import { cn } from '@/utils'
import { formatUSD, shortenValue } from '@/utils'
import { DAYJS_FORMATS } from '@/utils/date.util'
import { TimeAgo } from '@/components/common/DateWrapper'
import StyledTooltip from '@/components/common/StyledTooltip'
import IconWrapper from '@/components/icons/IconWrapper'
import { AppUrls, FileIds, IconIds } from '@/enums'
import LinkWrapper from '@/components/common/LinkWrapper'
import FileMapper from '@/components/common/FileMapper'
import numeral from 'numeral'

interface AccountHeaderProps {
    accountFromUrl: string
    lastRefreshTime: number | null
    nextUpdateIn: string
    isFetching: boolean
    refetch: () => void
    metrics: {
        portfolio?: {
            deployedAUM?: number
            totalUSD?: number
            apr?: {
                combined24h?: number | null
                combined7d?: number | null
                combined30d?: number | null
            }
        }
        hyperEvm?: {
            values?: {
                lpsUSDWithFees?: number
                balancesUSD?: number
            }
            apr?: {
                weightedAvg24h?: number | null
                weightedAvg7d?: number | null
                weightedAvg30d?: number | null
            }
        }
        hyperCore?: {
            values?: {
                perpsUSD?: number
                spotUSD?: number
                withdrawableUSDC?: number
            }
            apr?: {
                fundingAPR24h?: number | null
                fundingAPR7d?: number | null
                fundingAPR30d?: number | null
            }
        }
    }
    timings?: {
        hyperEvm?: {
            lpsMs?: number
            balancesMs?: number
        }
        hyperCore?: {
            perpsMs?: number
            spotsMs?: number
        }
    }
}

const DEMO_ACCOUNTS = [
    {
        address: '0x10B4F7e91f045363714015374D2d9Ff58Fda3186',
        name: 'Alpha',
        description: 'Demo - Project X 500-250',
    },
    {
        address: '0x8466D5b78CaFc01fC1264D2D724751b70211D979',
        name: 'Bravo',
        description: 'Demo - Hyperswap 500-250',
    },
    {
        address: '0x3cEe139542222D0d15BdCB8fd519B2615662B1E3',
        name: 'Charlie',
        description: 'Demo - Hyperswap 1000-500',
    },
]

export default function AccountHeader({ accountFromUrl, lastRefreshTime, nextUpdateIn, isFetching, refetch, metrics, timings }: AccountHeaderProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Calculate APR range from all time periods
    const combinedAPRs = metrics?.portfolio?.apr
    const lpAPRs = metrics?.hyperEvm?.apr
    const fundingAPRs = metrics?.hyperCore?.apr

    const aprRange = useMemo(() => {
        const aprs = [combinedAPRs?.combined24h, combinedAPRs?.combined7d, combinedAPRs?.combined30d].filter(
            (apr) => apr !== null && apr !== undefined,
        ) as number[]

        if (aprs.length === 0) return null

        const min = Math.min(...aprs)
        const max = Math.max(...aprs)

        return { min, max }
    }, [combinedAPRs])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="mb-4 flex flex-col gap-2 px-2 lg:px-4">
            {/* Title */}
            <div className="flex w-full flex-wrap items-center gap-1">
                <p className="text-wrap text-default">Below is an example of a delta neutral</p>
                {/* <IconWrapper id={IconIds.ARROW_RIGHT} className="size-4 text-default" /> */}
                <p className="text-wrap text-hyper-evm-lps">HYPE/USD₮0</p>
                <FileMapper id={FileIds.TOKEN_HYPE} width={20} height={20} className="z-10 rounded-full" />
                <FileMapper id={FileIds.TOKEN_USDT0} width={20} height={20} className="-ml-2 rounded-full" />
                <p className="text-wrap text-hyper-evm-lps">LP (actively rebalanced)</p>
                <p className="text-wrap text-default">with a</p>
                <p className="text-wrap text-hyper-core-perps">dynamic short leg</p>
            </div>

            {/* Summary */}
            <div className="flex w-full flex-col gap-6 lg:flex-row lg:justify-between">
                {/* Address */}
                <div className="flex flex-col">
                    {/* row */}
                    <div className="flex items-baseline gap-2 text-sm">
                        {/* Address Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-1 text-xl font-medium transition-colors hover:bg-default/5 hover:text-primary"
                            >
                                <IconWrapper
                                    id={IconIds.CHEVRON_DOWN}
                                    className={cn('size-4 text-default/50 transition-transform', isDropdownOpen && 'rotate-180')}
                                />
                                <span className="hidden xl:flex">{accountFromUrl}</span>
                                <span className="flex xl:hidden">{shortenValue(accountFromUrl, 6)}</span>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute left-0 top-full z-50 mt-2 min-w-[400px] rounded-lg border border-default/20 bg-background shadow-lg">
                                    {DEMO_ACCOUNTS.map((account) => (
                                        <LinkWrapper
                                            key={account.address}
                                            href={`/account/${account.address}`}
                                            target="_blank"
                                            className="flex items-start gap-3 border-b border-default/10 p-3 transition-colors last:border-b-0 hover:bg-default/5"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn('font-semibold', account.address === accountFromUrl && 'text-primary')}>
                                                        {account.name}
                                                    </span>
                                                    <span className="text-default/50">•</span>
                                                    <span className="text-default/50">{account.description}</span>
                                                </div>
                                                <p className="mt-1 font-mono text-sm text-default/70">{account.address}</p>
                                            </div>
                                            <IconWrapper id={IconIds.ARROW_UP_RIGHT} className="mt-0.5 size-4 text-default/50" />
                                        </LinkWrapper>
                                    ))}
                                </div>
                            )}
                        </div>

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
                            className="rounded hover:bg-default/10 hover:text-default disabled:opacity-50"
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
                                                LPs {timings?.hyperEvm?.lpsMs || 0}ms • Wallet {timings?.hyperEvm?.balancesMs || 0}ms • Perps{' '}
                                                {timings?.hyperCore?.perpsMs || 0}ms • Spot {timings?.hyperCore?.spotsMs || 0}ms
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
                <div className="flex items-center gap-3 md:gap-5">
                    {/* HyperLP balance */}
                    <div className="flex flex-col items-center lg:items-end">
                        <span className="text-base tracking-wider text-default/50">HyperLP balance</span>
                        <StyledTooltip
                            content={
                                <div className="flex flex-col">
                                    <div className="mb-2 font-semibold">Breakdown</div>
                                    <div className="flex justify-between font-medium">
                                        <span>+ Deployed AUM</span>
                                        <span>{formatUSD(metrics.portfolio?.deployedAUM || 0)}</span>
                                    </div>
                                    <div className="space-y-0 opacity-60">
                                        <div className="ml-3">
                                            <div className="flex justify-between gap-6">
                                                <span className="">• LPs</span>
                                                <span>{formatUSD(metrics.hyperEvm?.values?.lpsUSDWithFees || 0)}</span>
                                            </div>
                                            <div className="flex justify-between gap-6">
                                                <span className="">• Perpetuals</span>
                                                <span>{formatUSD(metrics.hyperCore?.values?.perpsUSD || 0)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 space-y-0">
                                        <div className="flex justify-between font-medium">
                                            <div className="">+ Idle/dust capital</div>
                                            <span>
                                                {numeral(
                                                    (metrics.hyperEvm?.values?.balancesUSD || 0) +
                                                        (metrics.hyperCore?.values?.spotUSD || 0) +
                                                        (metrics.hyperCore?.values?.withdrawableUSDC || 0),
                                                ).format('0,0a$')}
                                            </span>
                                        </div>

                                        <div className="ml-3 opacity-60">
                                            <div className="flex justify-between gap-6">
                                                <span className="">• Wallet balances</span>
                                                <span>{numeral(metrics.hyperEvm?.values?.balancesUSD || 0).format('0,0a$')}</span>
                                            </div>
                                            <div className="flex justify-between gap-6">
                                                <span className="">• Spot balances</span>
                                                <span>{numeral(metrics.hyperCore?.values?.spotUSD || 0).format('0,0a$')}</span>
                                            </div>
                                            <div className="flex justify-between gap-6">
                                                <span className="">• Withdrawable USDC</span>
                                                <span>{numeral(metrics.hyperCore?.values?.withdrawableUSDC || 0).format('0,0a$')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 border-t border-default/20 pt-4">
                                        <div className="flex justify-between font-semibold">
                                            <span>= HyperLP balance</span>
                                            <span>{formatUSD(metrics.portfolio?.totalUSD || 0)}</span>
                                        </div>
                                    </div>
                                </div>
                            }
                        >
                            <span className="cursor-help text-xl font-semibold">{formatUSD(metrics.portfolio?.totalUSD || 0)}</span>
                        </StyledTooltip>
                    </div>

                    {/* Active funds */}
                    {/* <div className="h-10 border-l border-dashed border-default/20" /> */}
                    {/* <div className="flex flex-col items-center lg:items-end">
                        <span className="text-base tracking-wider text-default/50">HyperLP balance</span>
                        <StyledTooltip
                            content={
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
                        >
                            <span className="text-xl font-semibold">{formatUSD(metrics.portfolio?.deployedAUM || 0)}</span>
                        </StyledTooltip>
                    </div> */}

                    {/* Net P&L */}
                    <div className="hidden h-10 border-l border-dashed border-default/20 md:flex" />
                    <div className="hidden flex-col items-center md:flex lg:items-end">
                        <span className="text-base tracking-wider text-default/50">Net P&L</span>

                        <StyledTooltip
                            content={
                                <div className="flex max-w-[380px] flex-col gap-2">
                                    <div className="flex flex-col">
                                        <p className="text-lg font-semibold">Net P&L coming soon</p>
                                        <p className="text-default/60">We’re working on adding proper P&L benchmarks for LPs leg.</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="font-semibold underline">3 points of view to consider for the LP leg</p>
                                        <ul className="list-disc pl-2 text-default/60">
                                            <li>
                                                <span className="font-semibold">HOLD</span> Compare to just holding the tokens in your wallet
                                            </li>
                                            <li>
                                                <span className="font-semibold">HYPE</span> Compare to holding HYPE, using deposit-time prices
                                            </li>
                                            <li>
                                                <span className="font-semibold">USDT0</span> Compare to holding USDT0, using deposit-time prices
                                            </li>
                                        </ul>
                                    </div>

                                    <LinkWrapper href={AppUrls.DOCS} target="_blank" className="flex items-center gap-1 underline hover:text-primary">
                                        <p>Also we want a P&L explained display</p>
                                        <IconWrapper id={IconIds.ARROW_UP_RIGHT} className="size-3.5" />
                                    </LinkWrapper>
                                </div>
                            }
                        >
                            <span className="cursor-help text-lg font-semibold text-default/30 hover:text-primary hover:underline">Coming soon</span>
                        </StyledTooltip>
                    </div>

                    {aprRange !== null && (
                        <>
                            <div className="h-10 border-l border-dashed border-default/20" />
                            <div className="flex flex-col items-center lg:items-end">
                                {/* <span className="text-base tracking-wider text-default/50">Est. Gross Delta-Neutral APR</span> */}
                                <span className="text-base tracking-wider text-default/50">Estimated Gross APR</span>
                                <StyledTooltip
                                    content={
                                        <div className="space-y-3">
                                            <div className="space-y-1 pb-2">
                                                <div className="flex items-center gap-1 text-sm font-medium">
                                                    <span>Gross Delta-Neutral APR on LPs + Perps</span>
                                                </div>
                                                <div className="text-sm">= (2/3 × LP APR) + (1/3 × Funding APR)</div>
                                            </div>

                                            {/* 24h APR */}
                                            {combinedAPRs?.combined24h !== null && combinedAPRs?.combined24h !== undefined && (
                                                <div className="space-y-0">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium">24h</span>
                                                        <span
                                                            className={cn('font-medium', {
                                                                'text-success':
                                                                    Math.min(
                                                                        ...[
                                                                            combinedAPRs.combined30d || 0,
                                                                            combinedAPRs.combined24h || 0,
                                                                            combinedAPRs.combined7d || 0,
                                                                        ],
                                                                    ) === combinedAPRs.combined24h ||
                                                                    Math.max(
                                                                        ...[
                                                                            combinedAPRs.combined30d || 0,
                                                                            combinedAPRs.combined24h || 0,
                                                                            combinedAPRs.combined7d || 0,
                                                                        ],
                                                                    ) === combinedAPRs.combined24h,
                                                            })}
                                                        >
                                                            {combinedAPRs.combined24h > 0 ? '+' : ''}
                                                            {combinedAPRs.combined24h.toFixed(0)}% before IL
                                                        </span>
                                                    </div>
                                                    <div className="ml-3">
                                                        {lpAPRs?.weightedAvg24h !== null && lpAPRs?.weightedAvg24h !== undefined && (
                                                            <div className="flex justify-between gap-6">
                                                                <span className="opacity-60">2/3 LP APR</span>
                                                                <span className="opacity-60">{lpAPRs.weightedAvg24h.toFixed(1)}% </span>
                                                            </div>
                                                        )}
                                                        {fundingAPRs?.fundingAPR24h !== null && fundingAPRs?.fundingAPR24h !== undefined && (
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
                                                        <span
                                                            className={cn('font-medium', {
                                                                'text-success':
                                                                    Math.min(
                                                                        ...[
                                                                            combinedAPRs.combined30d || 0,
                                                                            combinedAPRs.combined24h || 0,
                                                                            combinedAPRs.combined7d || 0,
                                                                        ],
                                                                    ) === combinedAPRs.combined7d ||
                                                                    Math.max(
                                                                        ...[
                                                                            combinedAPRs.combined30d || 0,
                                                                            combinedAPRs.combined24h || 0,
                                                                            combinedAPRs.combined7d || 0,
                                                                        ],
                                                                    ) === combinedAPRs.combined7d,
                                                            })}
                                                        >
                                                            {combinedAPRs.combined7d > 0 ? '+' : ''}
                                                            {combinedAPRs.combined7d.toFixed(0)}% before IL
                                                        </span>
                                                    </div>
                                                    <div className="ml-3 space-y-0.5">
                                                        {lpAPRs?.weightedAvg7d !== null && lpAPRs?.weightedAvg7d !== undefined && (
                                                            <div className="flex justify-between gap-6">
                                                                <span className="opacity-60">2/3 LP APR</span>
                                                                <span className="opacity-60">{lpAPRs.weightedAvg7d.toFixed(1)}%</span>
                                                            </div>
                                                        )}
                                                        {fundingAPRs?.fundingAPR7d !== null && fundingAPRs?.fundingAPR7d !== undefined && (
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
                                                        <span
                                                            className={cn('font-medium', {
                                                                'text-success':
                                                                    Math.min(
                                                                        ...[
                                                                            combinedAPRs.combined30d || 0,
                                                                            combinedAPRs.combined24h || 0,
                                                                            combinedAPRs.combined7d || 0,
                                                                        ],
                                                                    ) === combinedAPRs.combined30d ||
                                                                    Math.max(
                                                                        ...[
                                                                            combinedAPRs.combined30d || 0,
                                                                            combinedAPRs.combined24h || 0,
                                                                            combinedAPRs.combined7d || 0,
                                                                        ],
                                                                    ) === combinedAPRs.combined30d,
                                                            })}
                                                        >
                                                            {combinedAPRs.combined30d > 0 ? '+' : ''}
                                                            {combinedAPRs.combined30d.toFixed(0)}% before IL
                                                        </span>
                                                    </div>
                                                    <div className="ml-3 space-y-0.5">
                                                        {lpAPRs?.weightedAvg30d !== null && lpAPRs?.weightedAvg30d !== undefined && (
                                                            <div className="flex justify-between gap-6">
                                                                <span className="opacity-60">2/3 LP APR</span>
                                                                <span className="opacity-60">{lpAPRs.weightedAvg30d.toFixed(1)}%</span>
                                                            </div>
                                                        )}
                                                        {fundingAPRs?.fundingAPR30d !== null && fundingAPRs?.fundingAPR30d !== undefined && (
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
                                                <span className="pr-1 text-sm text-default/30">low</span>
                                                <span>
                                                    {aprRange.min > 0 ? '+' : ''}
                                                    {aprRange.min.toFixed(0)}%
                                                </span>

                                                <span className="pl-4 pr-1 text-sm text-default/30">high</span>
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
    )
}
