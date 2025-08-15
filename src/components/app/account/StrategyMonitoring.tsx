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
    metrics: AccountData['metrics']
    snapshots: AccountData['snapshots']
    deltaHistory: DeltaHistory
}

export function StrategyMonitoring({ metrics, snapshots, deltaHistory }: StrategyMonitoringProps) {
    if (!metrics || !snapshots) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-4 border-b pb-6">
            <h2 className="text-xl font-semibold">Live Strategy Monitoring</h2>

            {/* Main charts row */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="h-[400px] rounded-lg border p-4">
                    <DeltaTrackingChart
                        history={deltaHistory}
                        showSpotDelta={true}
                        showHyperEvmDelta={true}
                        totalCapital={metrics.portfolio.totalValueUSD}
                        className="h-full"
                    />
                </div>
                <div className="h-[400px] rounded-lg border p-4">
                    <APRBreakdownChart
                        lpFeeAPR={(snapshots.last?.lpFeeAPRPercent || snapshots.current?.lpFeeAPRPercent || 0) * 100}
                        fundingAPR={(snapshots.last?.fundingAPRPercent || snapshots.current?.fundingAPRPercent || 0) * 100}
                        rebalancingCost={0.2} // Example 0.2% cost
                        className="h-full"
                    />
                </div>
            </div>

            {/* Secondary charts row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="h-[300px] rounded-lg border p-4">
                    <DeltaThresholdGauge currentDelta={metrics.portfolio.netDeltaHYPE} threshold={100} warningThreshold={200} className="h-full" />
                </div>
                <div className="h-[300px] rounded-lg border p-4">
                    <PositionCompositionBar
                        lpValue={metrics.hyperEvm.values.lpUSD}
                        perpMargin={metrics.hyperCore.values.perpUSD}
                        spotValue={metrics.hyperCore.values.spotUSD}
                        hyperEvmValue={metrics.hyperEvm.values.balancesUSD}
                        totalValue={metrics.portfolio.totalValueUSD}
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
