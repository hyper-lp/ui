'use client'
import { useState } from 'react'
import { FileIds, IconIds, ProtocolType } from '@/enums'
import FileMapper from '@/components/common/FileMapper'
import IconWrapper from '@/components/icons/IconWrapper'
import type { HyperDrivePositionLeg } from '@/interfaces/position-leg.interface'
import { formatUSD, formatNumber, shortenValue } from '@/utils/format.util'
import { cn } from '@/utils'
import StyledTooltip from '@/components/common/StyledTooltip'
import { useAppStore } from '@/stores/app.store'
import { EmptyTablePlaceholder } from './EmptyTablePlaceholder'
import numeral from 'numeral'
import LinkWrapper from '@/components/common/LinkWrapper'
import { getProtocolByName } from '@/config'
import PositionIframeModal from '@/components/modals/PositionIframeModal'

interface HyperDrivePositionsTableProps {
    className?: string
}

// Create a row template for HyperDrive similar to LPRowTemplate
const HyperDriveRowTemplate = (props: {
    protocol: React.ReactNode
    market: React.ReactNode
    deposited: React.ReactNode
    shares: React.ReactNode
    value: React.ReactNode
    apr: React.ReactNode
    deltaHype: React.ReactNode
    positionId: React.ReactNode
    className?: string
}) => {
    return (
        <div role="row" className={cn('flex items-center gap-1 px-2 text-sm', props.className)}>
            <div role="cell" className="w-[70px] pl-2">
                {props.protocol}
            </div>
            <div role="cell" className="w-[130px]">
                {props.market}
            </div>
            <div role="cell" className="w-[70px] text-right">
                {props.deposited}
            </div>
            {/* <div role="cell" className="w-[60px] text-right">
                {props.shares}
            </div> */}
            <div role="cell" className="w-[60px] text-right">
                {props.value}
            </div>
            <div role="cell" className="w-[70px] text-center">
                {props.apr}
            </div>
            {/* <div role="cell" className="w-[80px] text-right">
                {props.deltaHype}
            </div>
            <div role="cell" className="w-[100px] text-center">
                {props.positionId}
            </div> */}
        </div>
    )
}

export function HyperDrivePositionsTableHeader() {
    return (
        <HyperDriveRowTemplate
            protocol={
                <span role="columnheader" className="truncate">
                    Protocol
                </span>
            }
            market={
                <span role="columnheader" className="truncate">
                    Market
                </span>
            }
            deposited={
                <span role="columnheader" className="truncate">
                    Deposited
                </span>
            }
            shares={
                <span role="columnheader" className="truncate">
                    Shares
                </span>
            }
            value={
                <span role="columnheader" className="truncate">
                    Value $
                </span>
            }
            apr={
                <span role="columnheader" className="truncate">
                    APR
                </span>
            }
            deltaHype={
                <span role="columnheader" className="truncate">
                    Δ HYPE
                </span>
            }
            positionId={
                <span role="columnheader" className="truncate">
                    Position ID
                </span>
            }
            className="h-8 border-b border-default/10 text-xs text-default/50"
        />
    )
}

export function HyperDrivePositionsTable({ className }: HyperDrivePositionsTableProps) {
    const [selectedPosition, setSelectedPosition] = useState<HyperDrivePositionLeg | null>(null)

    // Get positions directly from the store
    const snapshot = useAppStore((state) => state.getLatestSnapshot())
    const positions = (snapshot?.positions?.longLegs?.find((l) => l.type === 'hyperdrive')?.positions as unknown as HyperDrivePositionLeg[]) || []

    if (!positions || positions.length === 0) {
        return <EmptyTablePlaceholder message="No HyperDrive positions" className={className} />
    }

    const protocol = getProtocolByName(ProtocolType.HYPERDRIVE)

    const handlePositionClick = (position: HyperDrivePositionLeg) => {
        setSelectedPosition(position)
    }

    const handleCloseModal = () => {
        setSelectedPosition(null)
    }

    return (
        <div role="table" className={cn('overflow-x-auto', className)}>
            <div className="min-w-max">
                <HyperDrivePositionsTableHeader />
                <div role="rowgroup" className="divide-y divide-default/5">
                    {positions.map((position) => {
                        return (
                            <div
                                key={position.id}
                                onClick={() => handlePositionClick(position)}
                                className="cursor-pointer transition-colors hover:bg-default/5"
                                role="presentation"
                            >
                                <HyperDriveRowTemplate
                                    protocol={
                                        <div className="flex items-center gap-1.5">
                                            {protocol?.fileId && <FileMapper id={protocol.fileId} width={18} height={18} className="rounded" />}
                                            <IconWrapper id={IconIds.EXPAND} className="size-3 text-default/40" />
                                        </div>
                                    }
                                    market={
                                        <div className="flex items-center gap-1.5">
                                            <FileMapper id={FileIds.TOKEN_HYPE} width={16} height={16} className="rounded-full" />
                                            <p className="truncate font-medium">HYPE LST Market</p>
                                        </div>
                                    }
                                    deposited={
                                        <StyledTooltip
                                            content={
                                                <div className="space-y-3">
                                                    <div className="font-semibold">Deposited Amount</div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-1">
                                                            <FileMapper id={FileIds.TOKEN_HYPE} width={16} height={16} className="rounded-full" />
                                                            <p className="text-sm font-medium">{formatNumber(position.assetsUnits, 4)} HYPE</p>
                                                        </div>
                                                        <div className="text-sm opacity-60">Value: {formatUSD(position.valueUSD)}</div>
                                                    </div>
                                                    <div className="border-t border-default/10 pt-2">
                                                        <div className="text-sm opacity-60">Your underlying HYPE in HyperDrive</div>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <div className="flex items-center justify-end gap-1">
                                                <p className="cursor-help font-medium hover:underline">{formatNumber(position.assetsUnits, 2)}</p>
                                                <FileMapper id={FileIds.TOKEN_HYPE} width={16} height={16} className="rounded-full" />
                                            </div>
                                        </StyledTooltip>
                                    }
                                    shares={
                                        <StyledTooltip
                                            content={
                                                <div className="space-y-3">
                                                    <div className="font-semibold">Share Tokens</div>
                                                    <div className="space-y-2">
                                                        <p className="text-sm font-medium">
                                                            {numeral(position.sharesUnits).format('0,0.[0000]')} HD-MKT-HYPE
                                                        </p>
                                                        <div className="text-sm opacity-60">
                                                            Share/Asset Ratio: {(position.sharesUnits / position.assetsUnits).toFixed(4)}
                                                        </div>
                                                    </div>
                                                    <div className="border-t border-default/10 pt-2">
                                                        <div className="text-xs opacity-60">Your share of the lending pool</div>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <p className="cursor-help hover:underline">{formatNumber(position.sharesUnits, 2)}</p>
                                        </StyledTooltip>
                                    }
                                    value={
                                        <StyledTooltip
                                            content={
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium opacity-60">Position Value</p>
                                                    <p className="text-sm font-medium">{numeral(position.valueUSD).format('0,0.[00]$')}</p>
                                                </div>
                                            }
                                        >
                                            <span className="font-medium hover:underline">{formatUSD(position.valueUSD)}</span>
                                        </StyledTooltip>
                                    }
                                    apr={
                                        <StyledTooltip
                                            content={
                                                <div className="space-y-3">
                                                    <div className="font-semibold">Lending APR</div>
                                                    <div className="space-y-2">
                                                        {position.apr?.current !== undefined && (
                                                            <div className="flex justify-between gap-3">
                                                                <span className="text-sm font-medium opacity-60">Current</span>
                                                                <span className="text-sm font-medium text-success">
                                                                    {(position.apr.current ?? 0) > 0 ? '+' : ''}
                                                                    {(position.apr.current ?? 0).toFixed(2)}%
                                                                </span>
                                                            </div>
                                                        )}
                                                        {/* {position.apr?.avg7d !== undefined && (
                                                            <div className="flex justify-between gap-3">
                                                                <span className="text-sm font-medium opacity-60">7d avg</span>
                                                                <span className="text-sm font-medium text-success">
                                                                    {(position.apr.avg7d ?? 0) > 0 ? '+' : ''}
                                                                    {(position.apr.avg7d ?? 0).toFixed(2)}%
                                                                </span>
                                                            </div>
                                                        )}
                                                        {position.apr?.avg30d !== undefined && (
                                                            <div className="flex justify-between gap-3">
                                                                <span className="text-sm font-medium opacity-60">30d avg</span>
                                                                <span className="text-sm font-medium text-success">
                                                                    {(position.apr.avg30d ?? 0) > 0 ? '+' : ''}
                                                                    {(position.apr.avg30d ?? 0).toFixed(2)}%
                                                                </span>
                                                            </div>
                                                        )} */}
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <p className="cursor-help font-medium text-success hover:underline">
                                                {position.apr?.current ? `${position.apr.current.toFixed(1)}%` : '-'}
                                            </p>
                                        </StyledTooltip>
                                    }
                                    deltaHype={
                                        <StyledTooltip
                                            content={
                                                <div className="space-y-3">
                                                    <div className="font-semibold">HYPE Exposure</div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-1">
                                                            <FileMapper id={FileIds.TOKEN_HYPE} width={16} height={16} className="rounded-full" />
                                                            <p className="text-sm font-medium">
                                                                {formatNumber(Math.abs(position.deltaHYPE), 4)} HYPE
                                                            </p>
                                                        </div>
                                                        <div className="text-sm">
                                                            <span
                                                                className={cn(
                                                                    'font-medium',
                                                                    position.deltaHYPE > 0
                                                                        ? 'text-success'
                                                                        : position.deltaHYPE < 0
                                                                          ? 'text-danger'
                                                                          : 'text-default/50',
                                                                )}
                                                            >
                                                                {position.deltaHYPE > 0
                                                                    ? 'Long exposure'
                                                                    : position.deltaHYPE < 0
                                                                      ? 'Short exposure'
                                                                      : 'Delta neutral'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="border-t border-default/10 pt-2">
                                                        <div className="text-xs opacity-60">Net HYPE exposure after hedging</div>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <p
                                                className={cn(
                                                    'cursor-help font-medium hover:underline',
                                                    position.deltaHYPE > 0
                                                        ? 'text-success'
                                                        : position.deltaHYPE < 0
                                                          ? 'text-danger'
                                                          : 'text-default/50',
                                                )}
                                            >
                                                {position.deltaHYPE !== 0 ? (
                                                    <>
                                                        {position.deltaHYPE > 0 ? '+' : ''}
                                                        {formatNumber(position.deltaHYPE, 2)}
                                                    </>
                                                ) : (
                                                    '-'
                                                )}
                                            </p>
                                        </StyledTooltip>
                                    }
                                    positionId={
                                        <StyledTooltip
                                            content={
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium opacity-60">Position ID</p>
                                                    <p className="text-sm font-medium">{position.id}</p>
                                                    <p className="text-sm opacity-60">Click to view on HyperDrive</p>
                                                </div>
                                            }
                                        >
                                            <LinkWrapper href="https://hyperdrive.hypertest.xyz/" target="_blank">
                                                <p className="truncate hover:underline">{shortenValue(position.id)}</p>
                                            </LinkWrapper>
                                        </StyledTooltip>
                                    }
                                    className="h-10 text-sm transition-colors hover:bg-default/5"
                                />
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* HyperDrive Iframe Modal */}
            <PositionIframeModal
                isOpen={!!selectedPosition}
                onClose={handleCloseModal}
                position={selectedPosition}
                url={protocol?.portfolioUrl}
                title="HyperDrive Position"
            />
        </div>
    )
}
