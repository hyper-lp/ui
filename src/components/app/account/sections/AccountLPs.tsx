'use client'

import { LPPositionsTable } from '@/components/app/account/tables'
import { CollapsibleCard } from '@/components/app/account/CollapsibleCard'
import StyledTooltip from '@/components/common/StyledTooltip'
import numeral from 'numeral'
import { useAppStore } from '@/stores/app.store'

export default function AccountLPs() {
    const snapshot = useAppStore((state) => state.getLatestSnapshot())
    const lpAPRs = snapshot?.metrics.hyperEvm?.apr
    const weightedAvgAPR = lpAPRs?.weightedAvg24h
    const metrics = snapshot?.metrics

    return (
        <CollapsibleCard
            title={<h3 className="text-lg font-semibold text-hyper-evm-lps">LPs</h3>}
            defaultExpanded={false}
            headerRight={
                <div className="flex items-center gap-6">
                    {weightedAvgAPR !== null && (
                        <StyledTooltip
                            content={
                                <div className="space-y-3">
                                    <div className="font-semibold">LP average APR (historic)</div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between gap-6">
                                            <span className="text-sm font-medium opacity-60">24h APR</span>
                                            <span className="text-sm font-medium">
                                                {lpAPRs?.weightedAvg24h !== null ? `${lpAPRs?.weightedAvg24h.toFixed(2)}%` : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-6">
                                            <span className="text-sm font-medium opacity-60">7d APR</span>
                                            <span className="text-sm font-medium">
                                                {lpAPRs?.weightedAvg7d !== null ? `${lpAPRs?.weightedAvg7d.toFixed(2)}%` : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-6">
                                            <span className="text-sm font-medium opacity-60">30d APR</span>
                                            <span className="text-sm font-medium">
                                                {lpAPRs?.weightedAvg30d !== null ? `${lpAPRs?.weightedAvg30d.toFixed(2)}%` : 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-default/10 pt-2">
                                        <div className="text-sm opacity-60">Weighted by position value</div>
                                    </div>
                                </div>
                            }
                        >
                            <div className="flex items-center gap-1 rounded bg-default/5 px-2 py-1">
                                <p className="text-sm text-default/50">24h APR</p>
                                <p className="text-sm font-medium text-success">
                                    {weightedAvgAPR && weightedAvgAPR < 0.01 && weightedAvgAPR > 0
                                        ? `${numeral(weightedAvgAPR).divide(100).format('0,0.[0]%')}`
                                        : `${numeral(weightedAvgAPR).divide(100).format('0,0.[0]%')}`}{' '}
                                </p>
                            </div>
                        </StyledTooltip>
                    )}
                    <p>{numeral(metrics?.hyperEvm?.values?.lpsUSDWithFees || 0).format('0,0$')}</p>
                </div>
            }
        >
            <LPPositionsTable />
        </CollapsibleCard>
    )
}
