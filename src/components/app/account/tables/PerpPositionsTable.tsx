'use client'

import { useState } from 'react'
// import type { PerpPosition } from '@/interfaces'
import { FileIds, IconIds } from '@/enums'
import FileMapper from '@/components/common/FileMapper'
import IconWrapper from '@/components/icons/IconWrapper'
import { getHyperCoreAssetBySymbol } from '@/config/hypercore-assets.config'
import { PerpRowTemplate, SpotRowTemplate } from './TableTemplates'
import { formatUSD, formatNumber, shortenValue } from '@/utils/format.util'
import { cn } from '@/utils'
import StyledTooltip from '@/components/common/StyledTooltip'
import { useAppStore } from '@/stores/app.store'
import { RoundedAmount } from '@/components/common/RoundedAmount'

interface PerpPositionsTableProps {
    className?: string
}

function WithdrawableUSDCTable({ withdrawableUSDC }: { withdrawableUSDC: number }) {
    if (withdrawableUSDC <= 0) return null

    return (
        <div className="mb-4">
            <h3 className="ml-2 text-sm font-medium text-default/60">1. Withdrawable</h3>
            <div className="overflow-x-auto">
                <div className="min-w-max">
                    <SpotRowTemplate
                        asset={<p className="truncate text-xs text-default/50">Asset</p>}
                        balance={<p className="truncate text-right text-xs text-default/50">Available</p>}
                        value={<p className="truncate text-right text-xs text-default/50">Value $</p>}
                        className="h-8 border-b border-default/10"
                    />
                    <SpotRowTemplate
                        asset={
                            <div className="flex items-center gap-1.5">
                                <FileMapper id={FileIds.TOKEN_USDC} width={20} height={20} className="rounded-full" />
                                <span className="text-sm font-medium">USDC</span>
                            </div>
                        }
                        balance={<span className="font-medium">{formatNumber(withdrawableUSDC, 2)}</span>}
                        value={
                            <RoundedAmount amount={withdrawableUSDC}>
                                <span className="font-semibold text-green-600">{formatUSD(withdrawableUSDC)}</span>
                            </RoundedAmount>
                        }
                        className="h-10 border-b border-default/10"
                    />
                </div>
            </div>
        </div>
    )
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

export function PerpPositionsTable({ className }: PerpPositionsTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

    // Get positions directly from the store
    const snapshot = useAppStore((state) => state.getLatestSnapshot())
    const positions = snapshot?.positions?.hyperCore?.perps || []
    const withdrawableUSDC = snapshot?.metrics?.hyperCore?.values?.withdrawableUSDC || 0

    if (!positions || positions.length === 0) {
        return (
            <div className={className}>
                <WithdrawableUSDCTable withdrawableUSDC={withdrawableUSDC} />
                <div className="py-8 text-center text-default/50">No perpetual positions</div>
            </div>
        )
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
        <div className={className}>
            <WithdrawableUSDCTable withdrawableUSDC={withdrawableUSDC} />

            <h3 className="mb-2 ml-2 text-sm font-medium text-default/60">2. Perpetual Positions</h3>
            <div className="overflow-x-auto">
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
                                                    <span
                                                        className={`font-medium ${position.unrealizedPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}
                                                    >
                                                        {formatUSD(position.unrealizedPnl)}
                                                    </span>
                                                    <span
                                                        className={`ml-1 text-xs ${position.unrealizedPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}
                                                    >
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
                                        <div className="space-y-4 border-t border-default/10 bg-default/5 px-4 py-4">
                                            {/* Position Details Grid */}
                                            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3 lg:grid-cols-4">
                                                {/* Core Position Info */}
                                                <div className="col-span-full mb-2">
                                                    <h4 className="text-sm font-semibold text-default/80">Position Details</h4>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-default/50">Position ID</p>
                                                    <p className="text-sm">{shortenValue(position.id)}</p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-default/50">Asset</p>
                                                    <p className="font-medium">{position.asset}</p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-default/50">Direction</p>
                                                    <p className={cn('font-medium', isLong ? 'text-green-600' : 'text-red-600')}>
                                                        {isLong ? '↑ LONG' : '↓ SHORT'}
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
                                                    <p className="font-bold text-primary">{formatUSD(Math.abs(position.notionalValue))}</p>
                                                </div>

                                                {/* Price Information Section */}
                                                <div className="col-span-full mb-2 mt-3">
                                                    <h4 className="text-sm font-semibold text-default/80">Price Information</h4>
                                                </div>

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
                                                        className={cn(
                                                            'font-medium',
                                                            position.markPrice > position.entryPrice ? 'text-green-600' : 'text-red-600',
                                                        )}
                                                    >
                                                        {(((position.markPrice - position.entryPrice) / position.entryPrice) * 100).toFixed(2)}%
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-default/50">Liquidation Price</p>
                                                    <p className="font-medium text-orange-500">
                                                        {formatUSD(isLong ? position.entryPrice * 0.85 : position.entryPrice * 1.15)}
                                                    </p>
                                                </div>

                                                {/* PnL Section */}
                                                <div className="col-span-full mb-2 mt-3">
                                                    <h4 className="text-sm font-semibold text-default/80">Profit & Loss</h4>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-default/50">Unrealized PnL</p>
                                                    <p className={cn('font-bold', position.unrealizedPnl >= 0 ? 'text-green-600' : 'text-red-600')}>
                                                        {position.unrealizedPnl >= 0 ? '+' : ''}
                                                        {formatUSD(position.unrealizedPnl)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-default/50">PnL %</p>
                                                    <p className={cn('font-medium', pnlPercentage >= 0 ? 'text-green-600' : 'text-red-600')}>
                                                        {pnlPercentage >= 0 ? '+' : ''}
                                                        {Math.abs(pnlPercentage) < 0.005 ? '0' : pnlPercentage.toFixed(2)}%
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-default/50">ROI</p>
                                                    <p className={cn('font-medium', position.unrealizedPnl >= 0 ? 'text-green-600' : 'text-red-600')}>
                                                        {((position.unrealizedPnl / position.marginUsed) * 100).toFixed(1)}%
                                                    </p>
                                                </div>

                                                {/* Margin & Risk Section */}
                                                <div className="col-span-full mb-2 mt-3">
                                                    <h4 className="text-sm font-semibold text-default/80">Margin & Risk</h4>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-default/50">Margin Used</p>
                                                    <p className="font-medium">{formatUSD(position.marginUsed)}</p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-default/50">Leverage</p>
                                                    <p
                                                        className={cn(
                                                            'font-medium',
                                                            leverage > 5 ? 'text-orange-500' : leverage > 3 ? 'text-yellow-500' : 'text-default',
                                                        )}
                                                    >
                                                        {leverage.toFixed(2)}x
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-default/50">Margin Ratio</p>
                                                    <p className="font-medium">
                                                        {((position.marginUsed / Math.abs(position.notionalValue)) * 100).toFixed(1)}%
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-default/50">Distance to Liq</p>
                                                    <p
                                                        className={cn(
                                                            'font-medium',
                                                            Math.abs(
                                                                (position.markPrice -
                                                                    (isLong ? position.entryPrice * 0.85 : position.entryPrice * 1.15)) /
                                                                    position.markPrice,
                                                            ) < 0.1
                                                                ? 'text-red-500'
                                                                : 'text-default',
                                                        )}
                                                    >
                                                        {(
                                                            Math.abs(
                                                                (position.markPrice -
                                                                    (isLong ? position.entryPrice * 0.85 : position.entryPrice * 1.15)) /
                                                                    position.markPrice,
                                                            ) * 100
                                                        ).toFixed(1)}
                                                        %
                                                    </p>
                                                </div>

                                                {/* Funding Section */}
                                                <div className="col-span-full mb-2 mt-3">
                                                    <h4 className="text-sm font-semibold text-default/80">Funding Information</h4>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-default/50">Total Funding Paid</p>
                                                    <p className={cn('font-medium', position.fundingPaid >= 0 ? 'text-green-600' : 'text-red-600')}>
                                                        {formatUSD(position.fundingPaid)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-default/50">Current Funding APR</p>
                                                    <p className={cn('font-medium', !isLong ? 'text-green-600' : 'text-red-600')}>
                                                        {!isLong ? '+' : '-'}8.5%
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-default/50">Est. Daily Funding</p>
                                                    <p className={cn('font-medium', !isLong ? 'text-green-600' : 'text-red-600')}>
                                                        {!isLong ? '+' : '-'}
                                                        {formatUSD((Math.abs(position.notionalValue) * 0.085) / 365)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-default/50">Est. Monthly Funding</p>
                                                    <p className={cn('font-medium', !isLong ? 'text-green-600' : 'text-red-600')}>
                                                        {!isLong ? '+' : '-'}
                                                        {formatUSD((Math.abs(position.notionalValue) * 0.085) / 12)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Raw Data */}
                                            <div className="mt-4 flex items-center justify-between">
                                                <span className="text-xs text-default/40">Raw data available via tooltip →</span>
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
                                                        <span className="text-default/60">Position Data</span>
                                                    </div>
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
        </div>
    )
}
