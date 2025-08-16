'use client'

import { useAppStore } from '@/stores/app.store'
import { ThemeCard } from '../layout/Cards'
import { RoundedAmount } from '@/components/common/RoundedAmount'
import { formatUSD, getDeltaStatus } from '@/utils/format.util'
import { HypeIcon } from '@/components/common/HypeIcon'
import { HypeDeltaTooltip } from '@/components/common/HypeDeltaTooltip'
import { getHyperCoreAssetBySymbol } from '@/config/hypercore-assets.config'

export function AccountSummaryCards() {
    // Get data directly from the store
    const snapshot = useAppStore((state) => state.getLatestSnapshot())

    if (!snapshot) {
        // Loading state
        return (
            <>
                <ThemeCard isLoading />
                <ThemeCard isLoading />
                <ThemeCard isLoading />
                <ThemeCard isLoading />
            </>
        )
    }

    const { positions, metrics, prices } = snapshot
    const hypePrice = prices?.HYPE || 100

    return (
        <>
            <ThemeCard>
                <span className="text-sm text-default/50">Capital Deployed</span>
                <RoundedAmount amount={metrics.portfolio.totalUSD} className="text-xl font-semibold">
                    {formatUSD(metrics.portfolio.totalUSD)}
                </RoundedAmount>
                <span className="text-sm text-default/50">
                    {positions.hyperEvm?.lps?.length || 0} position{positions.hyperEvm?.lps?.length !== 1 ? 's' : ''}
                </span>
            </ThemeCard>

            <ThemeCard>
                <span className="text-sm text-default/50">Long LP</span>
                <RoundedAmount amount={metrics.hyperEvm.values.lpsUSD} className="text-xl font-semibold">
                    {formatUSD(metrics.hyperEvm.values.lpsUSD)}
                </RoundedAmount>
                <span className="text-sm text-default/50">N/A</span>
            </ThemeCard>

            <ThemeCard>
                <span className="text-sm text-default/50">Short Perp</span>
                <RoundedAmount amount={Math.abs(metrics.hyperCore.values.perpsUSD)} className="text-xl font-semibold">
                    {formatUSD(Math.abs(metrics.hyperCore.values.perpsUSD))}
                </RoundedAmount>
                <span className="text-sm text-default/50">N/A</span>
            </ThemeCard>

            <ThemeCard>
                <span className="text-sm text-default/50">Net Delta</span>
                <div className="flex items-center gap-1">
                    <HypeIcon size={20} />
                    <HypeDeltaTooltip
                        delta={metrics.portfolio.netDeltaHYPE}
                        hypePrice={hypePrice}
                        decimals={getHyperCoreAssetBySymbol('HYPE')?.decimalsForRounding ?? 1}
                        className="text-xl font-semibold"
                    />
                </div>
                <span className="text-sm text-default/50">{getDeltaStatus(metrics.portfolio.netDeltaHYPE)}</span>
            </ThemeCard>
        </>
    )
}
