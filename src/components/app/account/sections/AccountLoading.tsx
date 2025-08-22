'use client'

import { CollapsibleCard } from '@/components/app/account/CollapsibleCard'
import AccountTemplate from '@/components/app/account/layout/AccountTemplate'
import { SECTION_CONFIG, SectionType } from '@/config/sections.config'

export default function AccountLoading() {
    return (
        <AccountTemplate
            header={
                <div className="flex flex-col gap-4 px-2 lg:flex-row lg:items-center lg:justify-between lg:px-4">
                    {/* Address skeleton - mirrors the actual loaded header structure */}
                    <div className="mb-1 flex flex-col">
                        <div className="mb-10 flex items-center gap-1">
                            <div className="h-5 w-60 animate-pulse rounded bg-default/20" />
                            <div className="h-5 w-10 animate-pulse rounded bg-default/20" />
                            <div className="h-5 w-48 animate-pulse rounded bg-default/20" />
                        </div>
                        <div className="flex items-baseline gap-2 text-sm">
                            <div className="h-5 w-96 animate-pulse rounded bg-default/20" />
                            <div className="h-5 w-14 animate-pulse rounded bg-default/20" />
                            <div className="h-5 w-14 animate-pulse rounded bg-default/20" />
                            <div className="h-5 w-14 animate-pulse rounded bg-default/20" />
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-sm">
                            <div className="h-5 w-48 animate-pulse rounded bg-default/20" />
                        </div>
                    </div>

                    {/* KPIs skeleton - matches the actual KPIs layout */}
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <div className="h-5 w-24 animate-pulse rounded bg-default/20" />
                            <div className="mt-1 h-6 w-16 animate-pulse rounded bg-default/20" />
                        </div>
                        <div className="h-8 w-px border-l border-dashed border-default/20" />
                        <div className="flex flex-col items-end">
                            <div className="h-5 w-40 animate-pulse rounded bg-default/20" />
                            <div className="mt-1 h-6 w-32 animate-pulse rounded bg-default/20" />
                        </div>
                    </div>
                </div>
            }
            charts={<div className="flex h-[400px] w-full items-center justify-center text-sm text-default/50 md:h-[400px]">Loading chart...</div>}
            hyperEvm={{
                longEvm: (
                    <CollapsibleCard
                        title={
                            <h3 className={`text-lg font-semibold ${SECTION_CONFIG[SectionType.LONG_EVM].className}`}>
                                {SECTION_CONFIG[SectionType.LONG_EVM].displayName}
                            </h3>
                        }
                        defaultExpanded={false}
                        headerRight={null}
                        isLoading
                    />
                ),
                balances: (
                    <CollapsibleCard
                        title={
                            <h3 className={`text-lg font-semibold ${SECTION_CONFIG[SectionType.WALLET].className}`}>
                                {SECTION_CONFIG[SectionType.WALLET].displayName}
                            </h3>
                        }
                        defaultExpanded={false}
                        headerRight={null}
                        isLoading
                    />
                ),
                txs: null,
            }}
            hyperCore={{
                short: (
                    <CollapsibleCard
                        title={
                            <h3 className={`text-lg font-semibold ${SECTION_CONFIG[SectionType.PERPS].className}`}>
                                {SECTION_CONFIG[SectionType.PERPS].displayName}
                            </h3>
                        }
                        defaultExpanded={false}
                        headerRight={null}
                        isLoading
                    />
                ),
                spot: (
                    <CollapsibleCard
                        title={
                            <h3 className={`text-lg font-semibold ${SECTION_CONFIG[SectionType.SPOTS].className}`}>
                                {SECTION_CONFIG[SectionType.SPOTS].displayName}
                            </h3>
                        }
                        defaultExpanded={false}
                        headerRight={null}
                        isLoading
                    />
                ),
                txs: null,
            }}
        />
    )
}
