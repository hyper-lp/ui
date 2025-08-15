'use client'

import { useState } from 'react'
import type { PerpPosition } from '@/interfaces'
import { IconIds } from '@/enums'
import IconWrapper from '@/components/icons/IconWrapper'
import FileMapper from '@/components/common/FileMapper'
import { getHyperCoreAssetBySymbol } from '@/config/hypercore-assets.config'
import StyledTooltip from '@/components/common/StyledTooltip'
import { formatUSD, formatNumber } from '@/utils/format.util'
import { RoundedAmount } from '@/components/common/RoundedAmount'

interface PerpPositionsTableProps {
    positions: PerpPosition[]
}

export function PerpPositionsTable({ positions }: PerpPositionsTableProps) {
    const [expandedPositions, setExpandedPositions] = useState<Set<string>>(new Set())

    const formatSize = (size: number, asset: string) => {
        const assetConfig = getHyperCoreAssetBySymbol(asset)
        const decimals = assetConfig?.decimalsForRounding ?? 4
        return formatNumber(Math.abs(size), decimals)
    }

    const togglePosition = (positionId: string) => {
        setExpandedPositions((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(positionId)) {
                newSet.delete(positionId)
            } else {
                newSet.add(positionId)
            }
            return newSet
        })
    }

    if (!positions || positions.length === 0) return null

    // Sort positions by notional value descending
    const sortedPositions = [...positions].sort((a, b) => Math.abs(b.notionalValue) - Math.abs(a.notionalValue))

    return (
        <div>
            {sortedPositions.map((position) => {
                const isExpanded = expandedPositions.has(position.id)
                const isLong = position.size > 0
                const pnlPercentage = position.entryPrice !== 0 ? (position.unrealizedPnl / (Math.abs(position.size) * position.entryPrice)) * 100 : 0

                return (
                    <div key={position.id}>
                        {/* Summary Row */}
                        <button
                            onClick={() => togglePosition(position.id)}
                            className="w-full border-b border-default/10 py-2 transition-colors hover:bg-default/5"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <IconWrapper id={isExpanded ? IconIds.CHEVRON_DOWN : IconIds.CHEVRON_RIGHT} className="size-4 text-default/50" />

                                    {/* Asset Logo */}
                                    {getHyperCoreAssetBySymbol(position.asset)?.fileId && (
                                        <FileMapper
                                            id={getHyperCoreAssetBySymbol(position.asset)!.fileId}
                                            width={16}
                                            height={16}
                                            className="rounded-full"
                                        />
                                    )}

                                    <span className="font-medium">{position.asset}-PERP</span>
                                    <span
                                        className={`rounded px-2 py-0.5 text-sm ${isLong ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                                    >
                                        {isLong ? 'LONG' : 'SHORT'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-sm">
                                    <div className="text-right">
                                        <div className="text-sm text-default/50">Size</div>
                                        <div className={`font-medium ${isLong ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatSize(position.size, position.asset)}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-xs text-default/50">Notional</div>
                                        <RoundedAmount amount={Math.abs(position.notionalValue)} className="font-medium">
                                            {formatUSD(Math.abs(position.notionalValue))}
                                        </RoundedAmount>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-sm text-default/50">Funding APR</div>
                                        <div className={`font-medium ${!isLong ? 'text-green-600' : 'text-red-600'}`}>
                                            {/* Mock funding APR - in production this would come from API */}
                                            {!isLong ? '+' : '-'}8.5%
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-sm text-default/50">PnL</div>
                                        <div className={`font-medium ${position.unrealizedPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            ${formatNumber(position.unrealizedPnl)}
                                            <span className="ml-1 text-xs">
                                                ({pnlPercentage >= 0 ? '+' : ''}
                                                {pnlPercentage.toFixed(2)}%)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </button>

                        {/* Expanded Details */}
                        {isExpanded && (
                            <div className="bg-default/5 p-2 text-sm">
                                <div className="flex items-start justify-between">
                                    <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-3">
                                        <div>
                                            <span className="text-default/50">Entry Price:</span>
                                            <div className="font-medium">${formatNumber(position.entryPrice)}</div>
                                        </div>
                                        <div>
                                            <span className="text-default/50">Mark Price:</span>
                                            <div className="font-medium">${formatNumber(position.markPrice)}</div>
                                        </div>
                                        <div>
                                            <span className="text-default/50">Margin Used:</span>
                                            <div className="font-medium">${formatNumber(position.marginUsed)}</div>
                                        </div>
                                        <div>
                                            <span className="text-default/50">Funding Paid:</span>
                                            <div className={`font-medium ${position.fundingPaid >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                ${formatNumber(position.fundingPaid)}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-default/50">Est. Daily Funding:</span>
                                            <div className={`font-medium ${!isLong ? 'text-green-600' : 'text-red-600'}`}>
                                                {/* Mock calculation - in production would use actual funding rate */}$
                                                {formatNumber((Math.abs(position.notionalValue) * 0.085) / 365)}/day
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-default/50">Leverage:</span>
                                            <div className="font-medium">
                                                {position.marginUsed > 0 ? (Math.abs(position.notionalValue) / position.marginUsed).toFixed(2) : '0'}x
                                            </div>
                                        </div>
                                    </div>
                                    <StyledTooltip
                                        content={<pre className="max-h-96 max-w-2xl overflow-auto text-xs">{JSON.stringify(position, null, 2)}</pre>}
                                        placement="left"
                                    >
                                        <IconWrapper
                                            id={IconIds.INFORMATION}
                                            className="ml-2 size-4 cursor-help text-default/40 hover:text-default/60"
                                        />
                                    </StyledTooltip>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
