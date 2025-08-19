'use client'

import { SpotBalancesTable } from '@/components/app/account/tables'
import { CollapsibleCard } from '@/components/app/account/CollapsibleCard'
import numeral from 'numeral'
import { useAppStore } from '@/stores/app.store'

export default function AccountSpots() {
    const snapshot = useAppStore((state) => state.getLatestSnapshot())
    const metrics = snapshot?.metrics

    return (
        <CollapsibleCard
            title={
                <h3 className="text-lg font-semibold text-hyper-core-spots">
                    Spot
                    <span className="pl-1 text-default/30">= dust</span>
                </h3>
            }
            defaultExpanded={false}
            headerRight={
                <div className="flex items-center gap-6">
                    <p>{numeral(metrics?.hyperCore?.values?.spotUSD || 0).format('0,0$')}</p>
                </div>
            }
        >
            <SpotBalancesTable />
        </CollapsibleCard>
    )
}
