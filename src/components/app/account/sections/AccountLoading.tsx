'use client'

import { SectionCard } from '@/components/app/account/layout/Cards'

export default function AccountLoading() {
    return (
        <div className="flex animate-pulse flex-col gap-5">
            {/* Header skeleton */}
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

            {/* Content skeleton */}
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-4">
                {/* Charts skeleton */}
                <div className="flex-1">
                    <SectionCard className="h-[400px] !p-1 md:h-[460px] md:!p-2">
                        <div className="flex h-full w-full items-center justify-center text-sm text-default/50">Loading chart...</div>
                    </SectionCard>
                </div>

                {/* Right column skeleton */}
                <div className="3xl:w-[800px] flex h-min w-full flex-col gap-8 lg:w-[500px] xl:w-[600px] 2xl:w-[700px]">
                    {/* HyperEvm section skeleton */}
                    <div>
                        <div className="mb-2 ml-4 h-7 w-48 animate-pulse rounded bg-default/20" />
                        <div className="flex flex-col gap-2 p-2">
                            {/* Long EVM card skeleton */}
                            <div className="rounded-lg border border-default/20 p-4">
                                <div className="h-6 w-32 animate-pulse rounded bg-default/20" />
                                <div className="mt-4 space-y-2">
                                    <div className="h-4 w-full animate-pulse rounded bg-default/20" />
                                    <div className="h-4 w-3/4 animate-pulse rounded bg-default/20" />
                                </div>
                            </div>
                            {/* Balances card skeleton */}
                            <div className="rounded-lg border border-default/20 p-4">
                                <div className="h-6 w-24 animate-pulse rounded bg-default/20" />
                                <div className="mt-4 space-y-2">
                                    <div className="h-4 w-full animate-pulse rounded bg-default/20" />
                                    <div className="h-4 w-2/3 animate-pulse rounded bg-default/20" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HyperCore section skeleton */}
                    <div>
                        <div className="mb-2 ml-4 h-7 w-48 animate-pulse rounded bg-default/20" />
                        <div className="flex flex-col gap-2 p-2">
                            {/* Perps card skeleton */}
                            <div className="rounded-lg border border-default/20 p-4">
                                <div className="h-6 w-24 animate-pulse rounded bg-default/20" />
                                <div className="mt-4 space-y-2">
                                    <div className="h-4 w-full animate-pulse rounded bg-default/20" />
                                    <div className="h-4 w-3/4 animate-pulse rounded bg-default/20" />
                                </div>
                            </div>
                            {/* Spots card skeleton */}
                            <div className="rounded-lg border border-default/20 p-4">
                                <div className="h-6 w-24 animate-pulse rounded bg-default/20" />
                                <div className="mt-4 space-y-2">
                                    <div className="h-4 w-full animate-pulse rounded bg-default/20" />
                                    <div className="h-4 w-2/3 animate-pulse rounded bg-default/20" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
