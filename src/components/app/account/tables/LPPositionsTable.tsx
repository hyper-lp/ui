'use client'

import { useState } from 'react'
import { FileIds, IconIds } from '@/enums'
import FileMapper from '@/components/common/FileMapper'
import IconWrapper from '@/components/icons/IconWrapper'
// import type { LPPosition } from '@/interfaces'
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
            apr={<p className="text-right font-medium text-default/60">APR</p>}
            il={<p className="text-right font-medium text-default/60">IL</p>}
            className="h-8 border-b border-default/10"
        />
    )
}

export function LPPositionsTable({ className }: LPPositionsTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

    // Get positions directly from the store
    const snapshot = useAppStore((state) => state.getLatestSnapshot())
    const positions = snapshot?.positions?.hyperEvm?.lps || []

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
                                                <span className="capitalize text-default">{position.dex}</span>
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
                                            position.inRange !== undefined ? (
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
                                        apr={<span className="text-default/30">-</span>}
                                        il={<span className="text-default/30">-</span>}
                                        className="h-10 transition-colors hover:bg-default/5"
                                    />
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="border-t border-default/10 bg-default/5 px-4 py-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3 lg:grid-cols-4">
                                            {/* Position Info */}
                                            <div>
                                                <p className="text-xs text-default/50">Position ID</p>
                                                <p className="font-mono text-xs">{shortenValue(position.tokenId || position.id)}</p>
                                            </div>
                                            {/* Pool and DEX info would go here if available */}

                                            {/* Token Details */}
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
                                                <p className="font-medium">{formatUSD(position.token0ValueUSD || 0)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-default/50">{position.token1Symbol} Value</p>
                                                <p className="font-medium">{formatUSD(position.token1ValueUSD || 0)}</p>
                                            </div>

                                            {/* Range Info */}
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
                                                    <p className="font-mono text-sm">{position.tickCurrent}</p>
                                                </div>
                                            )}

                                            {/* Liquidity */}
                                            {position.liquidity && (
                                                <div>
                                                    <p className="text-xs text-default/50">Liquidity</p>
                                                    <p className="font-mono text-sm">{position.liquidity.toString()}</p>
                                                </div>
                                            )}

                                            {/* Fees would go here if available */}
                                        </div>

                                        {/* Raw JSON */}
                                        <div className="mt-4 flex justify-end">
                                            <StyledTooltip
                                                content={
                                                    <pre className="max-h-96 max-w-2xl overflow-auto text-xs">
                                                        {JSON.stringify(position, null, 2)}
                                                    </pre>
                                                }
                                                placement="left"
                                            >
                                                <IconWrapper
                                                    id={IconIds.INFORMATION}
                                                    className="size-4 cursor-help text-default/40 hover:text-default/60"
                                                />
                                            </StyledTooltip>
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
