'use client'

import { useAppStore } from '@/stores/app.store'
import { CollapsibleSection as CollapsibleCard } from '../CollapsibleCard'
import { PerpPositionsTable, SpotBalancesTable } from '../tables'
import { HyperCoreTransactionHistory } from '../HyperCoreTransactionHistory'
import { DeltaDisplay } from '@/components/common/DeltaDisplay'
import StyledTooltip from '@/components/common/StyledTooltip'
import { formatUSD } from '@/utils/format.util'
import { DEFAULT_TRANSACTION_LIMIT } from '@/config/app.config'

export function HyperCoreSection() {
    // Get data directly from the store
    const snapshot = useAppStore((state) => state.getLatestSnapshot())
    const currentAddress = useAppStore((state) => state.currentAddress)

    if (!snapshot || !currentAddress) {
        return null
    }

    const { positions, metrics, prices } = snapshot
    const hypePrice = prices?.HYPE || 100

    return (
        <>
            <CollapsibleCard
                title="Perpetuals"
                defaultExpanded={false}
                headerRight={
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-base text-default">
                            <span>
                                $ {(metrics.hyperCore.perpAggregates?.totalMargin || 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} margin
                            </span>
                            <span>•</span>
                            <span>{(metrics.hyperCore.perpAggregates?.avgLeverage || 0).toFixed(1)}x lev</span>
                        </div>
                        <DeltaDisplay delta={metrics.hyperCore.deltas.perpsHYPE} hypePrice={hypePrice} decimals={1} />
                    </div>
                }
            >
                <PerpPositionsTable />
            </CollapsibleCard>

            <CollapsibleCard
                title="Spot"
                defaultExpanded={false}
                headerRight={
                    <div className="flex items-center gap-2">
                        <span className="text-base font-medium text-default">
                            ${' '}
                            {(positions.hyperCore?.spots?.reduce((sum, b) => sum + b.valueUSD, 0) || 0)
                                .toFixed(0)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </span>
                        <DeltaDisplay delta={metrics.hyperCore.deltas.spotHYPE} hypePrice={hypePrice} decimals={1} />
                    </div>
                }
            >
                <SpotBalancesTable />
            </CollapsibleCard>

            <CollapsibleCard title="Trades" defaultExpanded={false}>
                <HyperCoreTransactionHistory account={currentAddress} limit={DEFAULT_TRANSACTION_LIMIT} />
            </CollapsibleCard>
        </>
    )
}

export function HyperCoreSummary() {
    // Get data directly from the store
    const snapshot = useAppStore((state) => state.getLatestSnapshot())

    if (!snapshot) {
        return null
    }

    const { positions, metrics, prices } = snapshot
    const hypePrice = prices?.HYPE || 100

    // Calculate HyperCore capital and leverage metrics
    const margin = metrics.hyperCore.perpAggregates?.totalMargin || 0
    const notional = metrics.hyperCore.perpAggregates?.totalNotional || 0
    const leverage = metrics.hyperCore.perpAggregates?.avgLeverage || 0
    const spotValue = positions.hyperCore?.spots?.reduce((sum, b) => sum + b.valueUSD, 0) || 0
    const hyperCoreBreakdown = {
        total: margin + spotValue,
        margin,
        notional,
        leverage,
        spotValue,
    }

    return (
        <>
            {hyperCoreBreakdown.total > 0 && (
                <StyledTooltip
                    content={
                        <div className="space-y-1">
                            <div className="flex items-center justify-between gap-8">
                                <span className="text-default">Margin:</span>
                                <span className="font-medium text-default">{formatUSD(hyperCoreBreakdown.margin)}</span>
                            </div>
                            <div className="flex items-center justify-between gap-8">
                                <span className="text-default">Notional:</span>
                                <span className="font-medium text-default">{formatUSD(hyperCoreBreakdown.notional)}</span>
                            </div>
                            <div className="flex items-center justify-between gap-8">
                                <span className="text-default">Leverage:</span>
                                <span className="font-medium text-default">{hyperCoreBreakdown.leverage.toFixed(1)}x</span>
                            </div>
                            {hyperCoreBreakdown.spotValue > 0 && (
                                <div className="flex items-center justify-between gap-8 border-t border-default/20 pt-1">
                                    <span className="text-default">Spot:</span>
                                    <span className="font-medium text-default">{formatUSD(hyperCoreBreakdown.spotValue)}</span>
                                </div>
                            )}
                        </div>
                    }
                    placement="bottom"
                >
                    <div className="cursor-help text-sm font-medium text-default">Deployed capital: {formatUSD(hyperCoreBreakdown.total)}</div>
                </StyledTooltip>
            )}
            <DeltaDisplay delta={metrics.hyperCore.deltas.perpsHYPE + metrics.hyperCore.deltas.spotHYPE} hypePrice={hypePrice} decimals={1} />
        </>
    )
}
