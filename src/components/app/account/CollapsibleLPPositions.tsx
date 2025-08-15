'use client'

import { useState, useMemo } from 'react'
import { IconIds, FileIds } from '@/enums'
import IconWrapper from '@/components/icons/IconWrapper'
import FileMapper from '@/components/common/FileMapper'
import StyledTooltip from '@/components/common/StyledTooltip'
import type { LPPosition } from '@/interfaces'
import { LPPositionsByDex } from './LPPositionsByDex'
import { cn } from '@/utils'
import { getTokenBySymbol } from '@/config/hyperevm-tokens.config'
import { formatUSD } from '@/utils/format.util'
import { RoundedAmount } from '@/components/common/RoundedAmount'

interface DexSummary {
    dex: string
    positions: LPPosition[]
    totalValue: number
    positionCount: number
    hypeBalance: number // Total HYPE/WHYPE
    usdtBalance: number // Total USDT0
    tokenBalances: Record<string, number> // All token balances
}

interface CollapsibleLPPositionsProps {
    positions: LPPosition[]
    className?: string
}

// Helper function to get DEX logo
function getDexLogo(dexName: string): FileIds | null {
    const dexNameLower = dexName.toLowerCase()
    if (dexNameLower.includes('hybra')) return FileIds.DEX_HYBRA
    if (dexNameLower.includes('brick')) return FileIds.DEX_HYPERBRICK
    if (dexNameLower.includes('hyperswap')) return FileIds.DEX_HYPERSWAP
    if (dexNameLower.includes('prjtx')) return FileIds.DEX_PROJETX
    return null
}

export function CollapsibleLPPositions({ positions, className }: CollapsibleLPPositionsProps) {
    const [expandedDexes, setExpandedDexes] = useState<Set<string>>(new Set())

    // Group positions by DEX and calculate summaries
    const dexSummaries = useMemo(() => {
        const grouped = positions.reduce(
            (acc, position) => {
                const dexKey = position.dex
                if (!acc[dexKey]) {
                    acc[dexKey] = {
                        dex: dexKey,
                        positions: [],
                        totalValue: 0,
                        positionCount: 0,
                        hypeBalance: 0,
                        usdtBalance: 0,
                        tokenBalances: {},
                    }
                }

                acc[dexKey].positions.push(position)
                acc[dexKey].totalValue += position.valueUSD || 0
                acc[dexKey].positionCount += 1

                // Accumulate token balances
                if (position.token0Symbol && position.token0Amount) {
                    acc[dexKey].tokenBalances[position.token0Symbol] = (acc[dexKey].tokenBalances[position.token0Symbol] || 0) + position.token0Amount

                    // Track HYPE and USDT0 separately
                    if (position.token0Symbol === 'WHYPE' || position.token0Symbol === 'HYPE') {
                        acc[dexKey].hypeBalance += position.token0Amount
                    } else if (position.token0Symbol === 'USDT0' || position.token0Symbol === 'USD₮0') {
                        acc[dexKey].usdtBalance += position.token0Amount
                    }
                }

                if (position.token1Symbol && position.token1Amount) {
                    acc[dexKey].tokenBalances[position.token1Symbol] = (acc[dexKey].tokenBalances[position.token1Symbol] || 0) + position.token1Amount

                    // Track HYPE and USDT0 separately
                    if (position.token1Symbol === 'WHYPE' || position.token1Symbol === 'HYPE') {
                        acc[dexKey].hypeBalance += position.token1Amount
                    } else if (position.token1Symbol === 'USDT0' || position.token1Symbol === 'USD₮0') {
                        acc[dexKey].usdtBalance += position.token1Amount
                    }
                }

                return acc
            },
            {} as Record<string, DexSummary>,
        )

        // Convert to array and sort by total value
        return Object.values(grouped).sort((a, b) => b.totalValue - a.totalValue)
    }, [positions])

    const toggleDex = (dex: string) => {
        setExpandedDexes((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(dex)) {
                newSet.delete(dex)
            } else {
                newSet.add(dex)
            }
            return newSet
        })
    }

    return (
        <div className={cn('', className)}>
            {dexSummaries.map((summary) => {
                const isExpanded = expandedDexes.has(summary.dex)

                return (
                    <div key={summary.dex}>
                        {/* Summary Row */}
                        <button
                            onClick={() => toggleDex(summary.dex)}
                            className="w-full border-b border-default/10 py-3 transition-colors hover:bg-default/5 sm:py-2"
                        >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2">
                                    <IconWrapper
                                        id={isExpanded ? IconIds.CHEVRON_DOWN : IconIds.CHEVRON_RIGHT}
                                        className="size-4 flex-shrink-0 text-default/50"
                                    />

                                    {/* DEX Logo */}
                                    {getDexLogo(summary.dex) && (
                                        <FileMapper id={getDexLogo(summary.dex)!} width={16} height={16} className="rounded-md" />
                                    )}

                                    <span className="font-medium capitalize">{summary.dex}</span>
                                    <span className="hidden text-sm text-default/50 sm:inline">
                                        ({summary.positionCount} position{summary.positionCount !== 1 ? 's' : ''})
                                    </span>
                                    <span className="text-xs text-default/50 sm:hidden">({summary.positionCount})</span>
                                    {summary.hypeBalance > 0 && (
                                        <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-200 sm:px-2 sm:text-sm">
                                            LONG
                                        </span>
                                    )}
                                </div>

                                <div className="ml-6 flex flex-wrap items-center gap-3 text-xs sm:ml-0 sm:gap-4 sm:text-sm">
                                    {/* HYPE Balance */}
                                    <div className="flex items-center gap-1">
                                        <FileMapper id={FileIds.TOKEN_HYPE} width={16} height={16} className="rounded-full sm:h-5 sm:w-5" />
                                        <div className="text-right">
                                            <div className="hidden text-sm text-default/50 sm:block">HYPE</div>
                                            <StyledTooltip
                                                content={
                                                    <div className="space-y-1">
                                                        <div className="font-semibold">HYPE Balance Details</div>
                                                        <div className="space-y-0.5 text-sm">
                                                            <div>Amount: {summary.hypeBalance.toFixed(4)} HYPE</div>
                                                            {summary.positions.length > 0 &&
                                                                summary.positions[0]?.token0Symbol === 'HYPE' &&
                                                                summary.positions[0]?.token0Amount &&
                                                                summary.positions[0].token0Amount > 0 && (
                                                                    <>
                                                                        <div>
                                                                            Price:{' '}
                                                                            {formatUSD(
                                                                                (summary.positions[0]!.valueUSD *
                                                                                    (summary.positions[0]!.token0Symbol === 'HYPE' ? 0.5 : 0)) /
                                                                                    summary.positions[0]!.token0Amount,
                                                                            )}
                                                                            /HYPE
                                                                        </div>
                                                                        <div>
                                                                            Value:{' '}
                                                                            {formatUSD(
                                                                                summary.hypeBalance *
                                                                                    ((summary.positions[0].valueUSD * 0.5) /
                                                                                        summary.positions[0].token0Amount),
                                                                            )}
                                                                        </div>
                                                                    </>
                                                                )}
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <div className="cursor-help font-medium hover:underline">
                                                    {summary.hypeBalance.toFixed(getTokenBySymbol('HYPE')?.decimalsForRounding ?? 1)}
                                                </div>
                                            </StyledTooltip>
                                        </div>
                                    </div>

                                    {/* USDT0 Balance */}
                                    <div className="flex items-center gap-1">
                                        <FileMapper id={FileIds.TOKEN_USDT0} width={16} height={16} className="rounded-full sm:h-5 sm:w-5" />
                                        <div className="text-right">
                                            <div className="hidden text-sm text-default/50 sm:block">USDT0</div>
                                            <div className="font-medium">
                                                {summary.usdtBalance.toFixed(getTokenBySymbol('USD₮0')?.decimalsForRounding ?? 0)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* AUM */}
                                    <div className="text-right">
                                        <div className="hidden text-sm text-default/50 sm:block">AUM</div>
                                        <RoundedAmount
                                            amount={summary.totalValue}
                                            className="font-semibold text-primary sm:font-medium sm:text-current"
                                        >
                                            {formatUSD(summary.totalValue)}
                                        </RoundedAmount>
                                    </div>
                                </div>
                            </div>
                        </button>

                        {/* Expanded Details */}
                        {isExpanded && (
                            <div className="bg-default/5 p-3 sm:p-2">
                                <div className="mb-2 flex justify-end">
                                    <StyledTooltip
                                        content={
                                            <pre className="max-h-96 max-w-2xl overflow-auto text-xs">
                                                {JSON.stringify(summary.positions, null, 2)}
                                            </pre>
                                        }
                                        placement="left"
                                    >
                                        <IconWrapper id={IconIds.INFORMATION} className="size-4 cursor-help text-default/40 hover:text-default/60" />
                                    </StyledTooltip>
                                </div>
                                <LPPositionsByDex positions={summary.positions} />
                            </div>
                        )}
                    </div>
                )
            })}

            {/* Total Summary */}
            {dexSummaries.length > 1 && (
                <div className="mt-3 border-t border-default/10 pt-3 sm:mt-2 sm:pt-2">
                    <div className="flex flex-col gap-2 text-xs sm:flex-row sm:justify-between sm:text-sm">
                        <span className="font-medium text-default/50">Total across {dexSummaries.length} DEXes</span>
                        <div className="flex flex-wrap gap-3 sm:gap-4">
                            <div>
                                <span className="text-default/50">Positions: </span>
                                <span className="font-medium">{positions.length}</span>
                            </div>
                            <div>
                                <span className="text-default/50">AUM: </span>
                                <span className="font-medium">${dexSummaries.reduce((sum, s) => sum + s.totalValue, 0).toFixed(2)}</span>
                            </div>
                            <div>
                                <span className="text-default/50">HYPE: </span>
                                <span className="font-medium">{dexSummaries.reduce((sum, s) => sum + s.hypeBalance, 0).toFixed(4)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
