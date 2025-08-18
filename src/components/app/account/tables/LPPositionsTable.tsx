'use client'

import { useState } from 'react'
import { FileIds, IconIds } from '@/enums'
import FileMapper from '@/components/common/FileMapper'
import IconWrapper from '@/components/icons/IconWrapper'
import type { LPPosition } from '@/interfaces'
import type { PoolAPRData } from '@/interfaces/pool-apr.interface'
import { LPRowTemplate } from './TableTemplates'
import { formatUSD, formatNumber, shortenValue } from '@/utils/format.util'
import { cn } from '@/utils'
import StyledTooltip from '@/components/common/StyledTooltip'
import { SideBadge } from '@/components/common/SideBadge'
import { useAppStore } from '@/stores/app.store'
import numeral from 'numeral'
import LinkWrapper from '@/components/common/LinkWrapper'
import { getDexConfig, IS_DEV } from '@/config'
import IframeWrapper from '@/components/common/IframeWrapper'

interface LPPositionsTableProps {
    className?: string
}

export function LPPositionsTableHeader() {
    return (
        <LPRowTemplate
            dex={<p className="truncate">DEX</p>}
            feeTier={<p className="truncate">Fee</p>}
            status={<p className="truncate font-medium">Status</p>}
            poolAddress={<p className="truncate">Pool</p>}
            nftId={<p className="truncate">NFT ID</p>}
            hype={
                <div className="mx-auto flex items-center justify-center gap-1">
                    <FileMapper id={FileIds.TOKEN_HYPE} width={16} height={16} className="rounded-full" />
                    <p className="truncate text-sm">Δ</p>
                </div>
            }
            usdt={<FileMapper id={FileIds.TOKEN_USDT0} width={18} height={18} className="mx-auto rounded-full" />}
            value={<p className="truncate">Value $</p>}
            split={<p className="truncate">Split</p>}
            tvl={<p className="truncate">TVL $</p>}
            apr24h={<p className="truncate">24h APR</p>}
            apr7d={<p className="truncate">7d APR</p>}
            apr30d={<p className="truncate">30d APR</p>}
            positionId={<p className="truncate">Position ID</p>}
            className="h-8 border-b border-default/10 text-xs text-default/50"
        />
    )
}

export function LPPositionsTable({ className }: LPPositionsTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

    // Get positions and APR data directly from the store
    const snapshot = useAppStore((state) => state.getLatestSnapshot())
    const positions = snapshot?.positions?.hyperEvm?.lps || []
    const poolAPRData = snapshot?.marketData?.poolAPR

    // Helper to find matching APR for a position
    const findPoolSnapshot = (position: LPPosition): PoolAPRData | null => {
        if (!poolAPRData?.pools || !position.pool) return null

        return (
            poolAPRData.pools.find(
                (pool) =>
                    position.pool &&
                    pool.poolAddress.toLowerCase() === position.pool.toLowerCase() &&
                    pool.dex.toLowerCase() === position.dex.toLowerCase(),
            ) || null
        )
    }

    if (!positions || positions.length === 0) {
        return <div className={cn('py-8 text-center text-default/50', className)}>No liquidity positions</div>
    }

    const toggleRow = (id: string) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            return newSet
        })
    }

    return (
        <div className={cn('overflow-x-auto', className)}>
            <div className="min-w-max">
                <LPPositionsTableHeader />
                <div className="divide-y divide-default/5">
                    {positions
                        .filter((position) => position.valueUSD > 1)
                        .map((position) => {
                            const isExpanded = expandedRows.has(position.id)
                            const hypeAmount =
                                position.token0Symbol === 'HYPE' || position.token0Symbol === 'WHYPE' ? position.token0Amount : position.token1Amount
                            const usdtAmount =
                                position.token0Symbol === 'USDT0' || position.token0Symbol === 'USD₮0'
                                    ? position.token0Amount
                                    : position.token1Symbol === 'USDT0' || position.token1Symbol === 'USD₮0'
                                      ? position.token1Amount
                                      : 0

                            const poolSnapshot = findPoolSnapshot(position)
                            return (
                                <div key={position.id}>
                                    <div
                                        onClick={() => IS_DEV && toggleRow(position.id)}
                                        className={cn('cursor-default', IS_DEV && 'cursor-pointer')}
                                    >
                                        <LPRowTemplate
                                            dex={
                                                <div className="flex items-center gap-1.5">
                                                    {!IS_DEV && (
                                                        <IconWrapper
                                                            id={isExpanded ? IconIds.CHEVRON_DOWN : IconIds.CHEVRON_RIGHT}
                                                            className="size-4 text-default/40"
                                                        />
                                                    )}

                                                    <StyledTooltip
                                                        content={
                                                            <IframeWrapper
                                                                src={getDexConfig(position.dex)?.portfolioUrl || ''}
                                                                width="w-[300px] md:w-[450px] lg:w-[600px]"
                                                                height="h-[250px]"
                                                            />
                                                        }
                                                    >
                                                        <div className="grow">
                                                            <FileMapper
                                                                id={getDexConfig(position.dex)?.fileId || ''}
                                                                width={18}
                                                                height={18}
                                                                className="rounded"
                                                            />
                                                        </div>
                                                    </StyledTooltip>
                                                </div>
                                            }
                                            feeTier={<p className="truncate">{position.feeTier}</p>}
                                            positionId={
                                                <StyledTooltip
                                                    content={
                                                        <div className="flex flex-col gap-1">
                                                            <p className="text-default/50">Position ID</p>
                                                            <p className="">{position.id}</p>
                                                        </div>
                                                    }
                                                >
                                                    <LinkWrapper href={getDexConfig(position.dex)?.portfolioUrl || ''} target="_blank">
                                                        <p className="truncate">{position.id}</p>
                                                    </LinkWrapper>
                                                </StyledTooltip>
                                            }
                                            nftId={<p className="truncate">#{position.tokenId}</p>}
                                            status={
                                                <p className="truncate">
                                                    {position.isClosed ? (
                                                        <span className="text-default/40">Closed</span>
                                                    ) : position.inRange !== undefined ? (
                                                        <StyledTooltip
                                                            content={
                                                                <div className="flex flex-col gap-1">
                                                                    <p className="text-xs text-default/50">Tick Lower</p>
                                                                    <p>{position.tickLower}</p>
                                                                    <p className="text-xs text-default/50">Tick Upper</p>
                                                                    <p>{position.tickUpper}</p>
                                                                    <p className="text-xs text-default/50">Current Tick</p>
                                                                    <p>{position.tickCurrent}</p>
                                                                </div>
                                                            }
                                                        >
                                                            <SideBadge side={position.inRange ? 'long' : 'short'}>
                                                                {position.inRange ? 'In Range' : 'Out'}
                                                            </SideBadge>
                                                        </StyledTooltip>
                                                    ) : (
                                                        <span className="text-default/50">-</span>
                                                    )}
                                                </p>
                                            }
                                            poolAddress={
                                                <StyledTooltip
                                                    content={
                                                        <div className="flex flex-col gap-1">
                                                            <p className="text-default/50">Pool Address</p>
                                                            <p className="">{position.pool}</p>
                                                            <p className="text-default/50">Click to view pool</p>
                                                        </div>
                                                    }
                                                >
                                                    <LinkWrapper href={getDexConfig(position.dex)?.portfolioUrl || ''} target="_blank">
                                                        <p className="truncate">{shortenValue(position.pool || '')}</p>
                                                    </LinkWrapper>
                                                </StyledTooltip>
                                            }
                                            hype={
                                                hypeAmount ? (
                                                    <StyledTooltip
                                                        content={
                                                            <div className="flex flex-col gap-1">
                                                                <p className="text-xs text-default/50">Amount</p>
                                                                <div className="flex items-center gap-1">
                                                                    <FileMapper
                                                                        id={FileIds.TOKEN_HYPE}
                                                                        width={16}
                                                                        height={16}
                                                                        className="rounded-full"
                                                                    />
                                                                    <p>{formatNumber(hypeAmount, 2)}</p>
                                                                </div>
                                                                <p className="text-xs text-default/50">Price (USD)</p>
                                                                <p>{formatUSD((position.token0ValueUSD || 0) / hypeAmount)}</p>
                                                                <p className="text-xs text-default/50">Value (USD)</p>
                                                                <p>{formatUSD(position.token0ValueUSD || 0)}</p>
                                                            </div>
                                                        }
                                                    >
                                                        <p className="font-medium hover:underline">{formatNumber(hypeAmount, 2)}</p>
                                                    </StyledTooltip>
                                                ) : (
                                                    <span className="text-default/50">-</span>
                                                )
                                            }
                                            usdt={
                                                usdtAmount ? (
                                                    <StyledTooltip
                                                        content={
                                                            <div className="flex flex-col gap-1">
                                                                <p className="text-xs text-default/50">Amount</p>
                                                                <div className="flex items-center gap-1">
                                                                    <FileMapper
                                                                        id={FileIds.TOKEN_USDT0}
                                                                        width={16}
                                                                        height={16}
                                                                        className="rounded-full"
                                                                    />
                                                                    <p>{formatNumber(usdtAmount, 0)}</p>
                                                                </div>
                                                                <p className="text-xs text-default/50">Price (USD)</p>
                                                                <p>{formatUSD((position.token1ValueUSD || 0) / usdtAmount)}</p>
                                                                <p className="text-xs text-default/50">Value (USD)</p>
                                                                <p>{formatUSD(position.token1ValueUSD || 0)}</p>
                                                            </div>
                                                        }
                                                    >
                                                        <p className="font-medium hover:underline">{formatNumber(usdtAmount, 0)}</p>
                                                    </StyledTooltip>
                                                ) : (
                                                    <span className="text-default/50">-</span>
                                                )
                                            }
                                            value={
                                                position.unclaimedFeesUSD && position.unclaimedFeesUSD > 0.01 ? (
                                                    <StyledTooltip
                                                        content={
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between gap-4">
                                                                    <span className="text-default/70">Position Value:</span>
                                                                    <span className="font-medium">
                                                                        {numeral(position.valueUSD).format('0,0.00$')}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center justify-between gap-4">
                                                                    <span className="text-default/70">Unclaimed Fees:</span>
                                                                    <span className="font-medium text-success">
                                                                        {numeral(position.unclaimedFeesUSD).format('0,0.00$')}
                                                                    </span>
                                                                </div>
                                                                {(position.unclaimedFees0 || position.unclaimedFees1) && (
                                                                    <div className="space-y-1 border-t border-default/10 pt-2 text-xs">
                                                                        {position.unclaimedFees0 && position.unclaimedFees0 > 0 && (
                                                                            <div className="flex items-center justify-between gap-2">
                                                                                <span className="text-default/50">{position.token0Symbol}:</span>
                                                                                <span>{formatNumber(position.unclaimedFees0, 4)}</span>
                                                                            </div>
                                                                        )}
                                                                        {position.unclaimedFees1 && position.unclaimedFees1 > 0 && (
                                                                            <div className="flex items-center justify-between gap-2">
                                                                                <span className="text-default/50">{position.token1Symbol}:</span>
                                                                                <span>{formatNumber(position.unclaimedFees1, 4)}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                <div className="border-t border-default/10 pt-2">
                                                                    <div className="flex items-center justify-between gap-4">
                                                                        <span className="font-medium text-default">Total:</span>
                                                                        <span className="font-semibold">
                                                                            {numeral(position.valueUSD + position.unclaimedFeesUSD).format('0,0.00$')}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                    >
                                                        <div className="flex flex-col items-end">
                                                            <span className="font-medium">
                                                                {formatUSD(position.valueUSD + position.unclaimedFeesUSD)}
                                                            </span>
                                                            {/* <span className="text-xs text-success">+{formatUSD(position.unclaimedFeesUSD)} fees</span> */}
                                                        </div>
                                                    </StyledTooltip>
                                                ) : (
                                                    <span className="font-medium">{formatUSD(position.valueUSD)}</span>
                                                )
                                            }
                                            split={
                                                <StyledTooltip
                                                    content={
                                                        <div className="flex items-center gap-1.5 text-sm">
                                                            <FileMapper
                                                                id={
                                                                    position.token0Symbol === 'HYPE' || position.token0Symbol === 'WHYPE'
                                                                        ? FileIds.TOKEN_HYPE
                                                                        : FileIds.TOKEN_USDT0
                                                                }
                                                                width={16}
                                                                height={16}
                                                                className="rounded-full"
                                                            />
                                                            <span>{position.token0Symbol}</span>
                                                            <span className="text-default/50">{formatUSD(position.token0ValueUSD || 0)}</span>
                                                            <span className="text-default/50">+</span>
                                                            <FileMapper
                                                                id={
                                                                    position.token1Symbol === 'HYPE' || position.token1Symbol === 'WHYPE'
                                                                        ? FileIds.TOKEN_HYPE
                                                                        : FileIds.TOKEN_USDT0
                                                                }
                                                                width={16}
                                                                height={16}
                                                                className="rounded-full"
                                                            />
                                                            <span>{position.token1Symbol}</span>
                                                            <span className="text-default/50">{formatUSD(position.token1ValueUSD || 0)}</span>
                                                        </div>
                                                    }
                                                >
                                                    <div className="flex items-center justify-end">
                                                        {/* percentage of hype and usdt */}
                                                        <p className="truncate">
                                                            {numeral((position.token0ValueUSD || 0) / position.valueUSD).format('0,0%')} /{' '}
                                                            {numeral((position.token1ValueUSD || 0) / position.valueUSD).format('0,0%')}
                                                        </p>
                                                    </div>
                                                </StyledTooltip>
                                            }
                                            tvl={
                                                <StyledTooltip
                                                    content={
                                                        <div className="flex flex-col gap-1">
                                                            <p className="text-default/50">Total Value Locked in pool</p>
                                                            <p>{numeral(poolSnapshot?.tvlUSD || 0).format('0,0.[00000]$')}</p>
                                                        </div>
                                                    }
                                                >
                                                    <span className="font-medium">{formatUSD(poolSnapshot?.tvlUSD || 0)}</span>
                                                </StyledTooltip>
                                            }
                                            apr24h={(() => {
                                                return poolSnapshot ? (
                                                    <StyledTooltip
                                                        content={
                                                            <div className="flex flex-col gap-1">
                                                                <p className="text-default/50">24h historical APR</p>
                                                                <p>{numeral(poolSnapshot.apr24h).divide(100).format('0,0.[00]%')}</p>
                                                                <p className="text-default/50">Not a projection of future performance</p>
                                                            </div>
                                                        }
                                                    >
                                                        <p className="font-medium hover:underline">
                                                            {numeral(poolSnapshot.apr24h).divide(100).format('0,0%')}
                                                        </p>
                                                    </StyledTooltip>
                                                ) : (
                                                    <span className="text-default/30">-</span>
                                                )
                                            })()}
                                            apr7d={(() => {
                                                return poolSnapshot ? (
                                                    <StyledTooltip
                                                        content={
                                                            <div className="flex flex-col gap-1">
                                                                <p className="text-default/50">7d historical APR</p>
                                                                <p>{numeral(poolSnapshot.apr7d).divide(100).format('0,0.[00]%')}</p>
                                                                <p className="text-default/50">Not a projection of future performance</p>
                                                            </div>
                                                        }
                                                    >
                                                        <p className="font-medium hover:underline">
                                                            {numeral(poolSnapshot.apr7d).divide(100).format('0,0%')}
                                                        </p>
                                                    </StyledTooltip>
                                                ) : (
                                                    <span className="text-default/30">-</span>
                                                )
                                            })()}
                                            apr30d={(() => {
                                                return poolSnapshot ? (
                                                    <StyledTooltip
                                                        content={
                                                            <div className="flex flex-col gap-1">
                                                                <p className="text-default/50">30d historical APR</p>
                                                                <p>{numeral(poolSnapshot.apr30d).divide(100).format('0,0.[00]%')}</p>
                                                                <p className="text-default/50">Not a projection of future performance</p>
                                                            </div>
                                                        }
                                                    >
                                                        <p className="font-medium hover:underline">
                                                            {numeral(poolSnapshot.apr30d).divide(100).format('0,0%')}
                                                        </p>
                                                    </StyledTooltip>
                                                ) : (
                                                    <span className="text-default/30">-</span>
                                                )
                                            })()}
                                            className="h-10 transition-colors hover:bg-default/5"
                                        />
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="space-y-4 border-t border-default/10 bg-default/5 px-4 py-4">
                                            {/* Position Details Grid */}
                                            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3 lg:grid-cols-4">
                                                {/* Core Position Info */}
                                                <div className="col-span-full mb-2">
                                                    <h4 className="text-sm font-semibold text-default/80">Position Details</h4>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-default/50">Token ID (NFT)</p>
                                                    <p className="text-sm font-medium">#{position.tokenId}</p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-default/50">Position ID</p>
                                                    <p className="text-sm">{shortenValue(position.id)}</p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-default/50">Status</p>
                                                    <p className={cn('font-medium', position.isClosed ? 'text-red-500' : 'text-green-500')}>
                                                        {position.isClosed ? 'Closed' : 'Active'}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-default/50">Total Value</p>
                                                    <p className="font-bold text-primary">{formatUSD(position.valueUSD || 0)}</p>
                                                </div>

                                                {/* Pool Address - Full */}
                                                {position.pool && (
                                                    <div className="col-span-2">
                                                        <p className="text-xs text-default/50">Pool Address</p>
                                                        <p className="break-all text-sm">{position.pool}</p>
                                                    </div>
                                                )}

                                                {/* Token Addresses */}
                                                {position.token0 && (
                                                    <div className="col-span-2">
                                                        <p className="text-xs text-default/50">{position.token0Symbol} Address</p>
                                                        <p className="break-all text-sm">{position.token0}</p>
                                                    </div>
                                                )}
                                                {position.token1 && (
                                                    <div className="col-span-2">
                                                        <p className="text-xs text-default/50">{position.token1Symbol} Address</p>
                                                        <p className="break-all text-sm">{position.token1}</p>
                                                    </div>
                                                )}

                                                {/* Token Holdings Section */}
                                                <div className="col-span-full mb-2 mt-3">
                                                    <h4 className="text-sm font-semibold text-default/80">Token Holdings</h4>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-default/50">{position.token0Symbol} Amount</p>
                                                    <p className="font-medium">{formatNumber(position.token0Amount || 0, 6)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-default/50">{position.token1Symbol} Amount</p>
                                                    <p className="font-medium">{formatNumber(position.token1Amount || 0, 6)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-default/50">{position.token0Symbol} Value</p>
                                                    <p className="font-medium text-green-600">{formatUSD(position.token0ValueUSD || 0)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-default/50">{position.token1Symbol} Value</p>
                                                    <p className="font-medium text-green-600">{formatUSD(position.token1ValueUSD || 0)}</p>
                                                </div>

                                                {/* Range & Price Info */}
                                                <div className="col-span-full mb-2 mt-3">
                                                    <h4 className="text-sm font-semibold text-default/80">Range & Price Information</h4>
                                                </div>

                                                {position.tickLower !== undefined && (
                                                    <div>
                                                        <p className="text-xs text-default/50">Tick Lower</p>
                                                        <p className="text-sm">{position.tickLower}</p>
                                                    </div>
                                                )}
                                                {position.tickUpper !== undefined && (
                                                    <div>
                                                        <p className="text-xs text-default/50">Tick Upper</p>
                                                        <p className="text-sm">{position.tickUpper}</p>
                                                    </div>
                                                )}
                                                {position.tickCurrent !== undefined && (
                                                    <div>
                                                        <p className="text-xs text-default/50">Current Tick</p>
                                                        <p className={cn('text-sm', position.inRange ? 'text-green-500' : 'text-orange-500')}>
                                                            {position.tickCurrent}
                                                        </p>
                                                    </div>
                                                )}

                                                <div>
                                                    <p className="text-xs text-default/50">Range Status</p>
                                                    <SideBadge side={position.inRange ? 'long' : 'short'}>
                                                        {position.inRange ? '✓ In Range' : '⚠ Out of Range'}
                                                    </SideBadge>
                                                </div>

                                                {/* Liquidity & Technical Data */}
                                                <div className="col-span-full mb-2 mt-3">
                                                    <h4 className="text-sm font-semibold text-default/80">Technical Data</h4>
                                                </div>

                                                {position.liquidity && (
                                                    <div>
                                                        <p className="text-xs text-default/50">Liquidity</p>
                                                        <p className="text-sm">{position.liquidity.toString()}</p>
                                                    </div>
                                                )}

                                                {/* Current Price */}
                                                {position.sqrtPriceX96 && (
                                                    <div>
                                                        <p className="text-xs text-default/50">Sqrt Price X96</p>
                                                        <p className="text-sm">{position.sqrtPriceX96.toString()}</p>
                                                    </div>
                                                )}

                                                {/* Fee Tier */}
                                                {position.fee !== undefined && (
                                                    <div>
                                                        <p className="text-xs text-default/50">Position Fee Tier</p>
                                                        <p className="font-medium">{(position.fee / 10000).toFixed(2)}%</p>
                                                    </div>
                                                )}

                                                {position.feeTier && (
                                                    <div>
                                                        <p className="text-xs text-default/50">Fee Tier (String)</p>
                                                        <p className="font-medium">{(Number(position.feeTier) / 10000).toFixed(2)}%</p>
                                                    </div>
                                                )}

                                                {/* Uncollected Fees */}
                                                <div className="col-span-full mb-2 mt-3">
                                                    <h4 className="text-sm font-semibold text-default/80">Uncollected Fees</h4>
                                                </div>

                                                {[
                                                    { symbol: position.token0Symbol, fees: position.fees0Uncollected },
                                                    { symbol: position.token1Symbol, fees: position.fees1Uncollected },
                                                ].map(({ symbol, fees }) => (
                                                    <div key={symbol}>
                                                        <p className="text-xs text-default/50">
                                                            Claimable {symbol}
                                                            {!position.isClosed && !fees && <span className="text-default/30"> *</span>}
                                                        </p>
                                                        <p className={cn('font-medium', fees && fees > 0 ? 'text-green-500' : 'text-default/30')}>
                                                            {fees && fees > 0 ? `+${formatNumber(fees, 6)}` : formatNumber(0, 6)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Note about fees */}
                                            {!position.isClosed && !position.fees0Uncollected && !position.fees1Uncollected && (
                                                <div className="col-span-full mt-2 text-xs text-default/40">
                                                    * Active position fees need to be collected to be shown
                                                </div>
                                            )}

                                            {/* Raw JSON Data */}
                                            <div className="mt-4 flex items-center justify-between">
                                                <span className="text-xs text-default/40">Raw data available via tooltips →</span>
                                                <div className="flex gap-2">
                                                    <StyledTooltip
                                                        content={
                                                            <pre className="max-h-96 max-w-2xl overflow-auto text-xs">
                                                                {JSON.stringify(position, null, 2)}
                                                            </pre>
                                                        }
                                                        placement="left"
                                                    >
                                                        <div className="flex cursor-help items-center gap-1 rounded bg-default/10 px-2 py-1 text-xs hover:bg-default/20">
                                                            <IconWrapper id={IconIds.INFORMATION} className="size-3 text-default/60" />
                                                            <span className="text-default/60">Position</span>
                                                        </div>
                                                    </StyledTooltip>
                                                    {(() => {
                                                        return poolSnapshot ? (
                                                            <StyledTooltip
                                                                content={
                                                                    <pre className="max-h-96 max-w-2xl overflow-auto text-xs">
                                                                        {JSON.stringify(poolSnapshot, null, 2)}
                                                                    </pre>
                                                                }
                                                                placement="left"
                                                            >
                                                                <div className="flex cursor-help items-center gap-1 rounded bg-green-50 px-2 py-1 text-xs hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30">
                                                                    <IconWrapper id={IconIds.INFORMATION} className="size-3 text-green-600" />
                                                                    <span className="text-green-600">Pool APR</span>
                                                                </div>
                                                            </StyledTooltip>
                                                        ) : null
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                </div>
            </div>
        </div>
    )
}
