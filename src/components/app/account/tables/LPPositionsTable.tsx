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
import { useAppStore } from '@/stores/app.store'

interface LPPositionsTableProps {
    className?: string
}

function getDexLogo(dexName: string): FileIds | null {
    const dexNameLower = dexName.toLowerCase()
    if (dexNameLower.includes('hybra')) return FileIds.DEX_HYBRA
    if (dexNameLower.includes('brick')) return FileIds.DEX_HYPERBRICK
    if (dexNameLower.includes('hyperswap')) return FileIds.DEX_HYPERSWAP
    if (dexNameLower.includes('prjtx')) return FileIds.DEX_PROJETX
    return null
}

export function LPPositionsTableHeader() {
    return (
        <LPRowTemplate
            dex={<p className="font-medium text-default/60">DEX</p>}
            pair={<p className="font-medium text-default/60">Pair</p>}
            range={<p className="font-medium text-default/60">Range</p>}
            hype={<p className="text-right font-medium text-default/60">HYPE</p>}
            usdt={<p className="text-right font-medium text-default/60">USDT0</p>}
            value={<p className="text-right font-medium text-default/60">Value</p>}
            apr={<p className="text-right font-medium text-default/60">24h APR</p>}
            il={<p className="text-right font-medium text-default/60">IL</p>}
            className="h-8 border-b border-default/10"
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
    const findMatchingAPR = (position: LPPosition): PoolAPRData | null => {
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
                    {positions.map((position) => {
                        const isExpanded = expandedRows.has(position.id)
                        const hypeAmount =
                            position.token0Symbol === 'HYPE' || position.token0Symbol === 'WHYPE' ? position.token0Amount : position.token1Amount
                        const usdtAmount =
                            position.token0Symbol === 'USDT0' || position.token0Symbol === 'USD₮0'
                                ? position.token0Amount
                                : position.token1Symbol === 'USDT0' || position.token1Symbol === 'USD₮0'
                                  ? position.token1Amount
                                  : 0

                        return (
                            <div key={position.id}>
                                <div onClick={() => toggleRow(position.id)} className="cursor-pointer">
                                    <LPRowTemplate
                                        dex={
                                            <div className="flex items-center gap-1.5">
                                                <IconWrapper
                                                    id={isExpanded ? IconIds.CHEVRON_DOWN : IconIds.CHEVRON_RIGHT}
                                                    className="size-3 text-default/40"
                                                />
                                                {getDexLogo(position.dex) && (
                                                    <FileMapper id={getDexLogo(position.dex)!} width={20} height={20} className="rounded" />
                                                )}
                                            </div>
                                        }
                                        pair={
                                            <div className="flex items-center gap-1">
                                                <span className="text-default">
                                                    {position.token0Symbol}/{position.token1Symbol}
                                                </span>
                                                {position.feeTier && (
                                                    <span className="text-[10px] text-default/40">{Number(position.feeTier) / 10000}%</span>
                                                )}
                                            </div>
                                        }
                                        range={
                                            position.isClosed ? (
                                                <span className="text-default/40">Closed</span>
                                            ) : position.inRange !== undefined ? (
                                                <span className={position.inRange ? 'text-green-500' : 'text-red-500'}>
                                                    {position.inRange ? 'In Range' : 'Out'}
                                                </span>
                                            ) : (
                                                <span className="text-default/50">-</span>
                                            )
                                        }
                                        hype={
                                            hypeAmount ? (
                                                <span className="font-medium">{formatNumber(hypeAmount, 2)}</span>
                                            ) : (
                                                <span className="text-default/50">-</span>
                                            )
                                        }
                                        usdt={
                                            usdtAmount ? (
                                                <span className="font-medium">{formatNumber(usdtAmount, 0)}</span>
                                            ) : (
                                                <span className="text-default/50">-</span>
                                            )
                                        }
                                        value={<span className="font-medium text-primary">{formatUSD(position.valueUSD || 0)}</span>}
                                        apr={(() => {
                                            const aprData = findMatchingAPR(position)
                                            return aprData ? (
                                                <span className="font-medium text-green-600">{aprData.apr24h.toFixed(1)}%</span>
                                            ) : (
                                                <span className="text-default/30">-</span>
                                            )
                                        })()}
                                        il={<span className="text-default/30">-</span>}
                                        className="h-10 transition-colors hover:bg-default/5"
                                    />
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="space-y-4 border-t border-default/10 bg-default/5 px-4 py-4">
                                        {/* Pool Performance Section */}
                                        {(() => {
                                            const aprData = findMatchingAPR(position)
                                            return aprData ? (
                                                <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                                                    <h4 className="mb-3 text-sm font-semibold text-green-800 dark:text-green-400">
                                                        Pool Performance & APR Data
                                                    </h4>
                                                    <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3 lg:grid-cols-5">
                                                        <div>
                                                            <p className="text-xs text-default/50">24h APR</p>
                                                            <p className="font-bold text-green-600">{aprData.apr24h.toFixed(2)}%</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-default/50">7d APR</p>
                                                            <p className="font-bold text-green-600">{aprData.apr7d.toFixed(2)}%</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-default/50">30d APR</p>
                                                            <p className="font-bold text-green-600">{aprData.apr30d.toFixed(2)}%</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-default/50">Pool TVL</p>
                                                            <p className="font-medium">{formatUSD(aprData.tvlUSD)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-default/50">24h Volume</p>
                                                            <p className="font-medium">{formatUSD(aprData.volume24h)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-default/50">24h Fees Generated</p>
                                                            <p className="font-medium">{formatUSD(aprData.fees24h)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-default/50">Pool Fee Tier</p>
                                                            <p className="font-medium">{(aprData.feeTier / 10000).toFixed(2)}%</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-default/50">Token Pair</p>
                                                            <p className="font-medium">
                                                                {aprData.token0Symbol}/{aprData.token1Symbol}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null
                                        })()}

                                        {/* Position Details Grid */}
                                        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3 lg:grid-cols-4">
                                            {/* Core Position Info */}
                                            <div className="col-span-full mb-2">
                                                <h4 className="text-sm font-semibold text-default/80">Position Details</h4>
                                            </div>

                                            <div>
                                                <p className="text-xs text-default/50">Token ID (NFT)</p>
                                                <p className="font-mono text-xs font-medium">#{position.tokenId}</p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-default/50">Position ID</p>
                                                <p className="font-mono text-xs">{shortenValue(position.id)}</p>
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
                                                    <p className="break-all font-mono text-xs">{position.pool}</p>
                                                </div>
                                            )}

                                            {/* Token Addresses */}
                                            {position.token0 && (
                                                <div className="col-span-2">
                                                    <p className="text-xs text-default/50">{position.token0Symbol} Address</p>
                                                    <p className="break-all font-mono text-xs">{position.token0}</p>
                                                </div>
                                            )}
                                            {position.token1 && (
                                                <div className="col-span-2">
                                                    <p className="text-xs text-default/50">{position.token1Symbol} Address</p>
                                                    <p className="break-all font-mono text-xs">{position.token1}</p>
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
                                                    <p className="font-mono text-sm">{position.tickLower}</p>
                                                </div>
                                            )}
                                            {position.tickUpper !== undefined && (
                                                <div>
                                                    <p className="text-xs text-default/50">Tick Upper</p>
                                                    <p className="font-mono text-sm">{position.tickUpper}</p>
                                                </div>
                                            )}
                                            {position.tickCurrent !== undefined && (
                                                <div>
                                                    <p className="text-xs text-default/50">Current Tick</p>
                                                    <p className={cn('font-mono text-sm', position.inRange ? 'text-green-500' : 'text-orange-500')}>
                                                        {position.tickCurrent}
                                                    </p>
                                                </div>
                                            )}

                                            <div>
                                                <p className="text-xs text-default/50">Range Status</p>
                                                <p className={cn('font-medium', position.inRange ? 'text-green-500' : 'text-orange-500')}>
                                                    {position.inRange ? '✓ In Range' : '⚠ Out of Range'}
                                                </p>
                                            </div>

                                            {/* Liquidity & Technical Data */}
                                            <div className="col-span-full mb-2 mt-3">
                                                <h4 className="text-sm font-semibold text-default/80">Technical Data</h4>
                                            </div>

                                            {position.liquidity && (
                                                <div>
                                                    <p className="text-xs text-default/50">Liquidity</p>
                                                    <p className="font-mono text-xs">{position.liquidity.toString()}</p>
                                                </div>
                                            )}

                                            {/* Current Price */}
                                            {position.sqrtPriceX96 && (
                                                <div>
                                                    <p className="text-xs text-default/50">Sqrt Price X96</p>
                                                    <p className="font-mono text-xs">{position.sqrtPriceX96.toString()}</p>
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
                                                    const aprData = findMatchingAPR(position)
                                                    return aprData ? (
                                                        <StyledTooltip
                                                            content={
                                                                <pre className="max-h-96 max-w-2xl overflow-auto text-xs">
                                                                    {JSON.stringify(aprData, null, 2)}
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
