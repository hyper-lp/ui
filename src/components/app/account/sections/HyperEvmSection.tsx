'use client'

import { useAppStore } from '@/stores/app.store'
import { CollapsibleSection as CollapsibleCard } from '../CollapsibleCard'
import { LPPositionsTable, WalletBalancesTable } from '../tables'
import { TransactionHistory } from '../TransactionHistory'
import { DeltaDisplay } from '@/components/common/DeltaDisplay'
import StyledTooltip from '@/components/common/StyledTooltip'
import { formatUSD } from '@/utils/format.util'
import { DEFAULT_TRANSACTION_LIMIT } from '@/config/app.config'
// import { calculateTokenBreakdown } from '@/utils/token.util'

import { calculateTokenBreakdown } from '@/utils/token.util'

export function HyperEvmSection() {
    // Get data directly from the store
    const snapshot = useAppStore((state) => state.getLatestSnapshot())
    const currentAddress = useAppStore((state) => state.currentAddress)

    if (!snapshot || !currentAddress) {
        return null
    }

    const { positions, metrics, prices } = snapshot
    const hypePrice = prices?.HYPE || 100
    // const hyperEvmBreakdown = calculateTokenBreakdown(positions.hyperEvm?.lps, positions.hyperEvm?.balances)

    return (
        <>
            <CollapsibleCard
                title="Liquidity Positions"
                defaultExpanded={false}
                headerRight={
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-base text-default">
                            <span className="font-medium">$ {metrics.hyperEvm.values.lpsUSD.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                            <span>•</span>
                            <span>
                                {positions.hyperEvm?.lps?.length || 0} LP{positions.hyperEvm?.lps?.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <DeltaDisplay delta={metrics.hyperEvm.deltas.lpsHYPE} hypePrice={hypePrice} decimals={1} />
                    </div>
                }
            >
                <LPPositionsTable />
            </CollapsibleCard>

            <CollapsibleCard
                title="Wallet"
                defaultExpanded={false}
                headerRight={
                    <div className="flex items-center gap-2">
                        <span className="text-base font-medium text-default">
                            ${' '}
                            {(positions.hyperEvm?.balances?.reduce((sum, b) => sum + b.valueUSD, 0) || 0)
                                .toFixed(0)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </span>
                        <DeltaDisplay delta={metrics.hyperEvm.deltas.balancesHYPE} hypePrice={hypePrice} decimals={1} />
                    </div>
                }
            >
                <WalletBalancesTable />
            </CollapsibleCard>

            <CollapsibleCard title="Transactions" defaultExpanded={false}>
                <TransactionHistory account={currentAddress} limit={DEFAULT_TRANSACTION_LIMIT} />
            </CollapsibleCard>
        </>
    )
}

export function HyperEvmCapitalInfo() {
    // Get data directly from the store
    const snapshot = useAppStore((state) => state.getLatestSnapshot())

    if (!snapshot) {
        return null
    }

    const { positions, metrics, prices } = snapshot
    const hypePrice = prices?.HYPE || 100
    const hyperEvmBreakdown = calculateTokenBreakdown(positions.hyperEvm?.lps, positions.hyperEvm?.balances)

    if (hyperEvmBreakdown.total <= 0) {
        return null
    }

    return (
        <>
            <StyledTooltip
                content={
                    <div className="space-y-1">
                        <div className="flex items-center justify-between gap-8">
                            <span className="text-default">HYPE:</span>
                            <span className="font-medium text-default">
                                {formatUSD(hyperEvmBreakdown.hypeValue)} ({hyperEvmBreakdown.hypePercent.toFixed(0)}%)
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-8">
                            <span className="text-default">Stable:</span>
                            <span className="font-medium text-default">
                                {formatUSD(hyperEvmBreakdown.stableValue)} ({hyperEvmBreakdown.stablePercent.toFixed(0)}%)
                            </span>
                        </div>
                    </div>
                }
                placement="bottom"
            >
                <div className="cursor-help text-sm font-medium text-default">Deployed capital: {formatUSD(hyperEvmBreakdown.total)}</div>
            </StyledTooltip>
            <DeltaDisplay delta={metrics.hyperEvm.deltas.lpsHYPE + metrics.hyperEvm.deltas.balancesHYPE} hypePrice={hypePrice} decimals={1} />
        </>
    )
}
