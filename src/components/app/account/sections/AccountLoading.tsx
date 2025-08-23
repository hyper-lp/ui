'use client'

import { CollapsibleCard } from '@/components/app/account/CollapsibleCard'
import AccountTemplate from '@/components/app/account/layout/AccountTemplate'
import { SECTION_CONFIG, SectionType } from '@/config/sections.config'
import { SectionCard } from '@/components/app/account/layout/Cards'

export default function AccountLoading() {
    return (
        <AccountTemplate
            header={
                <div className="flex flex-col gap-2 text-lg lg:text-xl">
                    {/* Title skeleton */}
                    <div className="mb-2 flex w-full flex-wrap items-center gap-1">
                        <div className="h-6 w-48 animate-pulse rounded bg-default/20" />
                        <div className="h-6 w-24 animate-pulse rounded bg-default/20" />
                        <div className="h-6 w-32 animate-pulse rounded bg-default/20" />
                    </div>

                    {/* Summary skeleton */}
                    <div className="flex flex-col gap-3 lg:w-full lg:flex-row lg:justify-between">
                        {/* Address section */}
                        <SectionCard padding="px-4 py-2" className="flex w-fit flex-col justify-around lg:grow">
                            <div className="flex items-center gap-2 text-sm">
                                <div className="h-5 w-60 animate-pulse rounded bg-default/20" />
                                <div className="h-5 w-10 animate-pulse rounded bg-default/20" />
                                <div className="h-5 w-10 animate-pulse rounded bg-default/20" />
                                <div className="h-5 w-14 animate-pulse rounded bg-default/20" />
                            </div>
                            <div className="flex items-center gap-1.5 text-sm">
                                <div className="h-4 w-4 animate-pulse rounded bg-default/20" />
                                <div className="h-4 w-48 animate-pulse rounded bg-default/20" />
                            </div>
                        </SectionCard>

                        {/* Global KPIs */}
                        <div className="flex w-full items-center gap-3 lg:w-max">
                            {/* HyperLP balance */}
                            <SectionCard padding="px-4 py-2" className="flex flex-col items-center lg:items-end">
                                <div className="h-5 w-24 animate-pulse rounded bg-default/20" />
                                <div className="mt-1 h-6 w-20 animate-pulse rounded bg-default/20" />
                            </SectionCard>

                            {/* Net P&L */}
                            <SectionCard padding="px-4 py-2" className="hidden flex-col items-center md:flex lg:items-end">
                                <div className="h-5 w-16 animate-pulse rounded bg-default/20" />
                                <div className="mt-1 h-6 w-24 animate-pulse rounded bg-default/20" />
                            </SectionCard>

                            {/* Estimated Gross APR */}
                            <SectionCard padding="px-4 py-2" className="flex flex-col items-center lg:items-end">
                                <div className="h-5 w-32 animate-pulse rounded bg-default/20" />
                                <div className="mt-1 h-6 w-28 animate-pulse rounded bg-default/20" />
                            </SectionCard>
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
