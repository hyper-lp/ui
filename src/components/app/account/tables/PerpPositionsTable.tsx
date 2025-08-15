'use client'

import { useState } from 'react'
import type { PerpPosition } from '@/interfaces'
import { IconIds } from '@/enums'
import FileMapper from '@/components/common/FileMapper'
import IconWrapper from '@/components/icons/IconWrapper'
import { getHyperCoreAssetBySymbol } from '@/config/hypercore-assets.config'
import { PerpRowTemplate } from './TableTemplates'
import { formatUSD, formatNumber, shortenValue } from '@/utils/format.util'
import { cn } from '@/utils'
import StyledTooltip from '@/components/common/StyledTooltip'

interface PerpPositionsTableProps {
    positions: PerpPosition[]
    className?: string
}

export function PerpPositionsTableHeader() {
    return (
        <PerpRowTemplate
            asset={<p className="font-medium text-default/60">Asset</p>}
            side={<p className="font-medium text-default/60">Side</p>}
            size={<p className="text-right font-medium text-default/60">Size</p>}
            notional={<p className="text-right font-medium text-default/60">Notional</p>}
            entry={<p className="text-right font-medium text-default/60">Entry</p>}
            mark={<p className="text-right font-medium text-default/60">Mark</p>}
            pnl={<p className="text-right font-medium text-default/60">PnL</p>}
            funding={<p className="text-right font-medium text-default/60">Funding</p>}
            margin={<p className="text-right font-medium text-default/60">Margin</p>}
            leverage={<p className="text-right font-medium text-default/60">Lev</p>}
            className="h-8 border-b border-default/10"
        />
    )
}

export function PerpPositionsTable({ positions, className }: PerpPositionsTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

    if (!positions || positions.length === 0) {
        return <div className={cn('py-8 text-center text-default/50', className)}>No perpetual positions</div>
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

    const sortedPositions = [...positions].sort((a, b) => Math.abs(b.notionalValue) - Math.abs(a.notionalValue))

    return (
        <div className={cn('overflow-x-auto', className)}>
            <div className="min-w-max">
                <PerpPositionsTableHeader />
                <div className="divide-y divide-default/5">
                    {sortedPositions.map((position) => {
                        const isExpanded = expandedRows.has(position.id)
                        const isLong = position.size > 0
                        const pnlPercentage =
                            position.entryPrice !== 0 ? (position.unrealizedPnl / (Math.abs(position.size) * position.entryPrice)) * 100 : 0
                        const leverage = position.marginUsed > 0 ? Math.abs(position.notionalValue) / position.marginUsed : 0

                        return (
                            <div key={position.id}>
                                <div onClick={() => toggleRow(position.id)} className="cursor-pointer">
                                    <PerpRowTemplate
                                        asset={
                                            <div className="flex items-center gap-1.5">
                                                <IconWrapper
                                                    id={isExpanded ? IconIds.CHEVRON_DOWN : IconIds.CHEVRON_RIGHT}
                                                    className="size-3 text-default/40"
                                                />
                                                {getHyperCoreAssetBySymbol(position.asset)?.fileId && (
                                                    <FileMapper
                                                        id={getHyperCoreAssetBySymbol(position.asset)!.fileId}
                                                        width={20}
                                                        height={20}
                                                        className="rounded-full"
                                                    />
                                                )}
                                                <span className="text-sm">{position.asset}</span>
                                            </div>
                                        }
                                        side={
                                            <span
                                                className={`rounded px-2 py-0.5 text-xs font-medium ${
                                                    isLong
                                                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                                        : 'bg-red-500/10 text-red-600 dark:text-red-400'
                                                }`}
                                            >
                                                {isLong ? 'LONG' : 'SHORT'}
                                            </span>
                                        }
                                        size={
                                            <span className={`font-medium ${isLong ? 'text-green-600' : 'text-red-600'}`}>
                                                {formatNumber(Math.abs(position.size), 4)}
                                            </span>
                                        }
                                        notional={<span className="font-medium">{formatUSD(Math.abs(position.notionalValue))}</span>}
                                        entry={<span>{formatUSD(position.entryPrice)}</span>}
                                        mark={<span>{formatUSD(position.markPrice)}</span>}
                                        pnl={
                                            <div>
                                                <span className={`font-medium ${position.unrealizedPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {formatUSD(position.unrealizedPnl)}
                                                </span>
                                                <span className={`ml-1 text-xs ${position.unrealizedPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    ({pnlPercentage >= 0 ? '+' : ''}
                                                    {Math.abs(pnlPercentage) < 0.05 ? '0' : pnlPercentage.toFixed(1)}%)
                                                </span>
                                            </div>
                                        }
                                        funding={
                                            <span className={`font-medium ${!isLong ? 'text-green-600' : 'text-red-600'}`}>
                                                {!isLong ? '+' : '-'}8.5%
                                            </span>
                                        }
                                        margin={<span>{formatUSD(position.marginUsed)}</span>}
                                        leverage={<span className="font-medium">{leverage.toFixed(1)}x</span>}
                                        className="h-10 transition-colors hover:bg-default/5"
                                    />
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="border-t border-default/10 bg-default/5 px-4 py-3">
                                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                                            {/* Position Details */}
                                            <div>
                                                <p className="text-xs text-default/50">Position ID</p>
                                                <p className="font-mono text-xs">{shortenValue(position.id)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-default/50">Direction</p>
                                                <p className={`font-medium ${isLong ? 'text-green-600' : 'text-red-600'}`}>
                                                    {isLong ? 'LONG' : 'SHORT'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-default/50">Size</p>
                                                <p className="font-medium">
                                                    {formatNumber(Math.abs(position.size), 6)} {position.asset}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-default/50">Notional Value</p>
                                                <p className="font-medium">{formatUSD(Math.abs(position.notionalValue))}</p>
                                            </div>

                                            {/* Prices */}
                                            <div>
                                                <p className="text-xs text-default/50">Entry Price</p>
                                                <p className="font-medium">{formatUSD(position.entryPrice)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-default/50">Mark Price</p>
                                                <p className="font-medium">{formatUSD(position.markPrice)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-default/50">Price Change</p>
                                                <p
                                                    className={`font-medium ${position.markPrice > position.entryPrice ? 'text-green-600' : 'text-red-600'}`}
                                                >
                                                    {(((position.markPrice - position.entryPrice) / position.entryPrice) * 100).toFixed(2)}%
                                                </p>
                                            </div>

                                            {/* PnL Details */}
                                            <div>
                                                <p className="text-xs text-default/50">Unrealized PnL</p>
                                                <p className={`font-medium ${position.unrealizedPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {formatUSD(position.unrealizedPnl)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-default/50">PnL %</p>
                                                <p className={`font-medium ${pnlPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {pnlPercentage >= 0 ? '+' : ''}
                                                    {Math.abs(pnlPercentage) < 0.005 ? '0' : pnlPercentage.toFixed(2)}%
                                                </p>
                                            </div>

                                            {/* Margin & Leverage */}
                                            <div>
                                                <p className="text-xs text-default/50">Margin Used</p>
                                                <p className="font-medium">{formatUSD(position.marginUsed)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-default/50">Leverage</p>
                                                <p className="font-medium">{leverage.toFixed(2)}x</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-default/50">Liquidation Price</p>
                                                <p className="font-medium text-orange-500">
                                                    {/* Mock calculation - would need actual maintenance margin */}
                                                    {formatUSD(isLong ? position.entryPrice * 0.85 : position.entryPrice * 1.15)}
                                                </p>
                                            </div>

                                            {/* Funding */}
                                            <div>
                                                <p className="text-xs text-default/50">Funding Paid</p>
                                                <p className={`font-medium ${position.fundingPaid >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {formatUSD(position.fundingPaid)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-default/50">Est. Daily Funding</p>
                                                <p className={`font-medium ${!isLong ? 'text-green-600' : 'text-red-600'}`}>
                                                    {formatUSD((Math.abs(position.notionalValue) * 0.085) / 365)}/day
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-default/50">Funding APR</p>
                                                <p className={`font-medium ${!isLong ? 'text-green-600' : 'text-red-600'}`}>
                                                    {!isLong ? '+' : '-'}8.5%
                                                </p>
                                            </div>
                                        </div>

                                        {/* Raw JSON */}
                                        <div className="mt-3 flex justify-end">
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
