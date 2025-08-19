'use client'

import { WalletBalancesTable } from '@/components/app/account/tables'
import { CollapsibleCard } from '@/components/app/account/CollapsibleCard'
import numeral from 'numeral'
import { useAppStore } from '@/stores/app.store'

export default function AccountWallet() {
    const snapshot = useAppStore((state) => state.getLatestSnapshot())
    const metrics = snapshot?.metrics

    return (
        <CollapsibleCard
            title={<h3 className="text-lg font-semibold text-hyper-evm-balances">Wallet</h3>}
            defaultExpanded={false}
            headerRight={
                <div className="flex items-center gap-6">
                    <p>{numeral(metrics?.hyperEvm?.values?.balancesUSD || 0).format('0,0$')}</p>
                </div>
            }
        >
            <WalletBalancesTable />
        </CollapsibleCard>
    )
}
