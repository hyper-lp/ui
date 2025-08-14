'use client'

import dynamic from 'next/dynamic'
import type { AccountData } from '@/interfaces'

// Dynamically import charts to avoid SSR issues
const DeltaTrackingChart = dynamic(() => import('@/components/charts/account/DeltaTrackingChart'), { ssr: false })
const APRBreakdownChart = dynamic(() => import('@/components/charts/account/APRBreakdownChart'), { ssr: false })
const DeltaThresholdGauge = dynamic(() => import('@/components/charts/account/DeltaThresholdGauge'), { ssr: false })
const PositionCompositionBar = dynamic(() => import('@/components/charts/account/PositionCompositionBar'), { ssr: false })
const RebalancingLog = dynamic(() => import('@/components/charts/account/RebalancingLog'), { ssr: false })
const PoolTVLTable = dynamic(() => import('@/components/charts/shared/PoolTVLTable'), { ssr: false })

import type { DeltaHistory } from '@/stores/delta-history.store'

interface StrategyMonitoringProps {
    summary: NonNullable<AccountData['summary']>
    deltaHistory: DeltaHistory
}

export function StrategyMonitoring({ summary, deltaHistory }: StrategyMonitoringProps) {
    return (
        <div className="space-y-4 border-b pb-6">
            <h2 className="text-xl font-semibold">Live Strategy Monitoring</h2>

            {/* Main charts row */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="h-[400px] rounded-lg border p-4">
                    <DeltaTrackingChart
                        history={deltaHistory}
                        showSpotDelta={true}
                        showHyperEvmDelta={!!summary.hyperEvmDelta}
                        totalCapital={summary.totalValue}
                        className="h-full"
                    />
                </div>
                <div className="h-[400px] rounded-lg border p-4">
                    <APRBreakdownChart
                        lpFeeAPR={(summary.lastSnapshot?.lpFeeAPR || summary.currentAPR?.lpFeeAPR || 0) * 100}
                        fundingAPR={(summary.lastSnapshot?.fundingAPR || summary.currentAPR?.fundingAPR || 0) * 100}
                        rebalancingCost={0.2} // Example 0.2% cost
                        className="h-full"
                    />
                </div>
            </div>

            {/* Secondary charts row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="h-[300px] rounded-lg border p-4">
                    <DeltaThresholdGauge currentDelta={summary.netDelta} threshold={100} warningThreshold={200} className="h-full" />
                </div>
                <div className="h-[300px] rounded-lg border p-4">
                    <PositionCompositionBar
                        lpValue={summary.totalLpValue}
                        perpMargin={summary.totalPerpValue}
                        spotValue={summary.totalSpotValue}
                        hyperEvmValue={summary.totalHyperEvmValue || 0}
                        totalValue={summary.totalValue}
                        className="h-full"
                    />
                </div>
                <div className="h-[300px] rounded-lg border p-4">
                    <RebalancingLog events={deltaHistory.rebalanceEvents} maxEvents={5} className="h-full" />
                </div>
            </div>

            {/* Pool TVL Overview */}
            <div className="grid grid-cols-1">
                <PoolTVLTable />
            </div>
        </div>
    )
}
