'use client'

import { PerpPositionsTable } from '@/components/app/account/tables'
import { CollapsibleCard } from '@/components/app/account/CollapsibleCard'
import numeral from 'numeral'
import { useAppStore } from '@/stores/app.store'
import StyledTooltip from '@/components/common/StyledTooltip'
import { cn } from '@/utils'

export default function AccountPerps() {
    const snapshot = useAppStore((state) => state.getLatestSnapshot())
    const metrics = snapshot?.metrics
    const fundingAPRs = snapshot?.metrics.hyperCore?.apr
    const perpFundingAPR = fundingAPRs?.currentFundingAPR

    return (
        <CollapsibleCard
            title={<h3 className="text-lg font-semibold text-hyper-core-perps">Perps</h3>}
            defaultExpanded={false}
            headerRight={
                <div className="flex items-center gap-6">
                    {perpFundingAPR != null && (
                        <StyledTooltip
                            content={
                                <div className="space-y-3">
                                    <div className="font-semibold">Funding Rates (8h settlement)</div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between gap-3">
                                            <span className="text-sm font-medium opacity-60">Current 8h</span>
                                            <span className="text-sm font-medium">
                                                {fundingAPRs?.currentFundingAPR !== null && fundingAPRs?.currentFundingAPR !== undefined
                                                    ? `${fundingAPRs.currentFundingAPR > 0 ? '+' : ''}${(fundingAPRs.currentFundingAPR / (365 * 3)).toFixed(4)}%`
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-3">
                                            <span className="text-sm font-medium opacity-60">24h APR</span>
                                            <span className="text-sm font-medium">
                                                {fundingAPRs?.fundingAPR24h !== null && fundingAPRs?.fundingAPR24h !== undefined
                                                    ? `${fundingAPRs.fundingAPR24h > 0 ? '+' : ''}${fundingAPRs.fundingAPR24h.toFixed(2)}%`
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-3">
                                            <span className="text-sm font-medium opacity-60">7d APR</span>
                                            <span className="text-sm font-medium">
                                                {fundingAPRs?.fundingAPR7d !== null && fundingAPRs?.fundingAPR7d !== undefined
                                                    ? `${fundingAPRs.fundingAPR7d > 0 ? '+' : ''}${fundingAPRs.fundingAPR7d.toFixed(2)}%`
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-3">
                                            <span className="text-sm font-medium opacity-60">30d APR</span>
                                            <span className="text-sm font-medium">
                                                {fundingAPRs?.fundingAPR30d !== null && fundingAPRs?.fundingAPR30d !== undefined
                                                    ? `${fundingAPRs.fundingAPR30d > 0 ? '+' : ''}${fundingAPRs.fundingAPR30d.toFixed(2)}%`
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-default/10 pt-2">
                                        <div className="text-sm opacity-60">Weighted by position notional</div>
                                    </div>
                                </div>
                            }
                        >
                            <div className="flex items-center gap-1 rounded bg-default/5 px-2 py-1">
                                <p className="text-sm text-default/50">Funding APR</p>
                                <p
                                    className={cn(
                                        'text-sm font-medium',
                                        perpFundingAPR > 0 ? 'text-success' : perpFundingAPR < 0 ? 'text-error' : 'text-default',
                                    )}
                                >
                                    {perpFundingAPR > 0 ? '+' : ''}
                                    {perpFundingAPR.toFixed(1)}%
                                </p>
                            </div>
                        </StyledTooltip>
                    )}
                    <p>
                        {numeral(
                            (metrics?.hyperCore?.values?.perpsNotionalUSDPlusPnlUsd || 0) + (metrics?.hyperCore?.values?.withdrawableUSDC || 0),
                        ).format('0,0$')}
                    </p>
                    {/* <div className="flex w-20 items-center justify-end gap-1">
                                        <HypeDeltaTooltip delta={metrics.hyperCore?.deltas?.perpsHYPE || 0} hypePrice={hypePrice} decimals={1} />
                                        <HypeIcon size={20} />
                                        <p className="text-default/50">Δ</p>
                                    </div> */}
                </div>
            }
        >
            <PerpPositionsTable />
        </CollapsibleCard>
    )
}
