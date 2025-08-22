'use client'

import { FileIds } from '@/enums'
import FileMapper from '@/components/common/FileMapper'
import type { HyperDrivePositionLeg } from '@/interfaces/position-leg.interface'
import { formatUSD, formatNumber } from '@/utils/format.util'
import { cn } from '@/utils'
import StyledTooltip from '@/components/common/StyledTooltip'
import { useAppStore } from '@/stores/app.store'
import { EmptyTablePlaceholder } from './EmptyTablePlaceholder'

interface HyperDrivePositionsTableProps {
    className?: string
}

// Default market display for HyperDrive
const DEFAULT_MARKET = { symbol: 'HYPE', fileId: FileIds.TOKEN_HYPE }

export function HyperDrivePositionsTableHeader() {
    return (
        <div role="row" className="grid h-8 grid-cols-6 items-center gap-3 border-b border-default/10 px-3 text-xs text-default/50">
            <span role="columnheader" className="truncate">
                Market
            </span>
            <span role="columnheader" className="truncate text-right">
                Deposited
            </span>
            <span role="columnheader" className="truncate text-right">
                Shares
            </span>
            <span role="columnheader" className="truncate text-right">
                Value
            </span>
            <span role="columnheader" className="truncate text-right">
                APR
            </span>
            <span role="columnheader" className="truncate text-right">
                Delta HYPE
            </span>
        </div>
    )
}

export function HyperDrivePositionsTable({ className }: HyperDrivePositionsTableProps) {
    // Get positions directly from the store
    const snapshot = useAppStore((state) => state.getLatestSnapshot())
    const positions = (snapshot?.positions?.longLegs?.find((l) => l.type === 'hyperdrive')?.positions as unknown as HyperDrivePositionLeg[]) || []

    if (!positions || positions.length === 0) {
        return <EmptyTablePlaceholder message="No HyperDrive positions" className={className} />
    }

    return (
        <div role="table" className={cn('overflow-x-auto', className)}>
            <div className="min-w-max">
                <HyperDrivePositionsTableHeader />
                <div role="rowgroup" className="divide-y divide-default/5">
                    {positions.map((position) => {
                        const marketConfig = DEFAULT_MARKET

                        return (
                            <div
                                key={position.id}
                                role="row"
                                className="grid h-10 grid-cols-6 items-center gap-3 px-3 text-sm transition-colors hover:bg-default/5"
                            >
                                {/* Market */}
                                <div role="cell" className="flex items-center gap-1.5">
                                    {marketConfig.fileId && <FileMapper id={marketConfig.fileId} width={18} height={18} className="rounded-full" />}
                                    <p className="truncate font-medium">{marketConfig.symbol}</p>
                                </div>

                                {/* Deposited */}
                                <div role="cell">
                                    <StyledTooltip
                                        content={
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium opacity-60">Deposited Amount</p>
                                                <p className="text-sm font-medium">
                                                    {formatNumber(position.assetsUnits, 4)} {marketConfig.symbol}
                                                </p>
                                                <p className="text-sm opacity-60">Your underlying HYPE in HyperDrive</p>
                                            </div>
                                        }
                                    >
                                        <p className="cursor-help text-right font-medium hover:underline">{formatNumber(position.assetsUnits, 3)}</p>
                                    </StyledTooltip>
                                </div>

                                {/* Shares */}
                                <div role="cell">
                                    <StyledTooltip
                                        content={
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium opacity-60">Share Tokens</p>
                                                <p className="text-sm font-medium">{formatNumber(position.sharesUnits, 4)} HD-MKT-HYPE</p>
                                                <p className="text-sm opacity-60">Your share of the lending pool</p>
                                            </div>
                                        }
                                    >
                                        <p className="cursor-help text-right hover:underline">{formatNumber(position.sharesUnits, 3)}</p>
                                    </StyledTooltip>
                                </div>

                                {/* Value */}
                                <div role="cell">
                                    <p className="text-right font-medium">{formatUSD(position.valueUSD)}</p>
                                </div>

                                {/* APR */}
                                <div role="cell">
                                    <StyledTooltip
                                        content={
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium opacity-60">Lending APR</p>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between gap-4">
                                                        <span className="text-sm opacity-60">Current:</span>
                                                        <span className="text-sm">
                                                            {position.apr?.current ? `${position.apr.current.toFixed(2)}%` : 'N/A'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between gap-4">
                                                        <span className="text-sm opacity-60">7d Avg:</span>
                                                        <span className="text-sm">
                                                            {position.apr?.avg7d ? `${position.apr.avg7d.toFixed(2)}%` : 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    >
                                        <p className="cursor-help text-right font-medium text-success hover:underline">
                                            {position.apr?.current ? `${position.apr.current.toFixed(1)}%` : '-'}
                                        </p>
                                    </StyledTooltip>
                                </div>

                                {/* Delta HYPE */}
                                <div role="cell">
                                    <StyledTooltip
                                        content={
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium opacity-60">HYPE Exposure</p>
                                                <p className="text-sm font-medium">{formatNumber(position.deltaHYPE, 4)} HYPE</p>
                                                <p className="text-sm opacity-60">
                                                    {position.deltaHYPE > 0
                                                        ? 'Long exposure'
                                                        : position.deltaHYPE < 0
                                                          ? 'Short exposure'
                                                          : 'No exposure'}
                                                </p>
                                            </div>
                                        }
                                    >
                                        <p
                                            className={cn(
                                                'cursor-help text-right font-medium hover:underline',
                                                position.deltaHYPE > 0 ? 'text-success' : position.deltaHYPE < 0 ? 'text-danger' : 'text-default/50',
                                            )}
                                        >
                                            {position.deltaHYPE !== 0 ? formatNumber(position.deltaHYPE, 2) : '-'}
                                        </p>
                                    </StyledTooltip>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
