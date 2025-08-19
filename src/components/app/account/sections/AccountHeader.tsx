'use client'

import { useMemo } from 'react'
import { cn } from '@/utils'
import { formatUSD, shortenValue } from '@/utils'
import { DAYJS_FORMATS } from '@/utils/date.util'
import { TimeAgo } from '@/components/common/DateWrapper'
import StyledTooltip from '@/components/common/StyledTooltip'
import IconWrapper from '@/components/icons/IconWrapper'
import { FileIds, IconIds } from '@/enums'
import LinkWrapper from '@/components/common/LinkWrapper'
import FileMapper from '@/components/common/FileMapper'

interface AccountHeaderProps {
    accountFromUrl: string
    lastRefreshTime: number | null
    nextUpdateIn: string
    isFetching: boolean
    refetch: () => void
    metrics: {
        portfolio?: {
            deployedAUM?: number
            apr?: {
                combined24h?: number | null
                combined7d?: number | null
                combined30d?: number | null
            }
        }
        hyperEvm?: {
            values?: {
                lpsUSDWithFees?: number
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

export default function AccountHeader({ accountFromUrl, lastRefreshTime, nextUpdateIn, isFetching, refetch, metrics, timings }: AccountHeaderProps) {
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

    return (
        <div className="mb-4 flex flex-col gap-2 px-2 lg:px-4">
            {/* Title */}
            <div className="flex w-full flex-wrap items-center gap-1">
                <p className="text-wrap text-primary">Example of Delta Neutral LP</p>
                <IconWrapper id={IconIds.ARROW_RIGHT} className="size-4 text-primary" />
                <p className="text-wrap text-primary">HYPE/USD₮0</p>
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
                <div className="flex items-center gap-3 md:gap-6">
                    <div className="flex flex-col items-center lg:items-end">
                        <span className="text-base tracking-wider text-default/50">Deployed AUM</span>
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
                    </div>

                    {aprRange !== null && (
                        <>
                            <div className="h-8 w-px border-l border-dashed border-default/20" />
                            <div className="flex flex-col items-center lg:items-end">
                                <span className="text-base tracking-wider text-default/50">Gross Delta-Neutral APR</span>
                                <StyledTooltip
                                    content={
                                        <div className="space-y-3">
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
                                                        <span className="font-medium">
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
                                                        <span className="font-medium">
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
    )
}
