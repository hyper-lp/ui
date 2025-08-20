'use client'

import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import PageWrapper from '@/components/common/PageWrapper'
import { useAccountData } from '@/hooks/useAccountData'
import { useAppStore } from '@/stores/app.store'
import AccountTemplate from '@/components/app/account/layout/AccountTemplate'
import { REFRESH_INTERVALS } from '@/config/app.config'
import { IS_DEV } from '@/config'
import { getDurationBetween } from '@/utils/date.util'
import { calculateHypePrice } from '@/utils/token.util'

// Section components
import AccountHeader from '@/components/app/account/sections/AccountHeader'
import AccountLoading from '@/components/app/account/sections/AccountLoading'
import AccountLPs from '@/components/app/account/sections/AccountLPs'
import AccountWallet from '@/components/app/account/sections/AccountWallet'
import AccountPerps from '@/components/app/account/sections/AccountPerps'
import AccountSpots from '@/components/app/account/sections/AccountSpots'
import { CollapsibleCard } from '@/components/app/account/CollapsibleCard'
import { CombinedActivity } from '@/components/app/account'

// Dynamically import chart to avoid SSR issues
const DeltaTrackingChart = dynamic(
    () =>
        import('@/components/charts/account/DeltaTrackingChart').catch(() => {
            // Fallback if the module fails to load
            return {
                default: () => (
                    <div className="flex h-[400px] w-full items-center justify-center text-sm text-default/50 md:h-[550px]">Chart unavailable</div>
                ),
            }
        }),
    {
        ssr: false,
        loading: () => <div className="flex h-[400px] w-full items-center justify-center text-sm text-default/50 md:h-[550px]">Loading chart...</div>,
    },
)

export default function AccountClient() {
    const params = useParams()
    const accountFromUrl = params?.account as string
    const [lastRefreshTime, setLastRefreshTime] = useState<number | null>(null)
    const [nextUpdateIn, setNextUpdateIn] = useState<string>('')

    // Use the simplified hook for data fetching
    const { isLoading, isFetching, error, refetch } = useAccountData(accountFromUrl)

    // Get data directly from the store
    const getLatestSnapshot = useAppStore((state) => state.getLatestSnapshot)
    const snapshot = getLatestSnapshot()

    // Update refresh time when new data arrives
    useEffect(() => {
        if (snapshot) {
            setLastRefreshTime(Date.now())
        }
    }, [snapshot])

    // Calculate next update countdown
    useEffect(() => {
        if (!lastRefreshTime) return

        const updateInterval = IS_DEV ? REFRESH_INTERVALS.DEV : REFRESH_INTERVALS.PROD

        const calculateTimeLeft = () => {
            const now = Date.now()
            const nextUpdateTime = lastRefreshTime + updateInterval

            if (now >= nextUpdateTime) {
                return 'now'
            }

            const duration = getDurationBetween({
                startTs: now,
                endTs: nextUpdateTime,
                showYears: false,
                showMonths: false,
                showWeeks: false,
                showDays: false,
                showHours: false,
                showMinutes: true,
                showSeconds: true,
                shortFormat: true,
                ago: false,
            })

            // Remove the "ago" suffix from oneLiner
            return duration.oneLiner.replace(' ago', '').trim()
        }

        // Update immediately
        setNextUpdateIn(calculateTimeLeft())

        // Update every second
        const timer = setInterval(() => {
            setNextUpdateIn(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(timer)
    }, [lastRefreshTime])

    // Extract metrics for display
    const metrics = snapshot?.metrics || {
        hyperEvm: {
            values: { lpsUSD: 0, lpsUSDWithFees: 0, unclaimedFeesUSD: 0, balancesUSD: 0, totalUSD: 0 },
            deltas: { lpsHYPE: 0, balancesHYPE: 0, totalHYPE: 0 },
            apr: { weightedAvg24h: null, weightedAvg7d: null, weightedAvg30d: null },
        },
        hyperCore: {
            values: {
                perpsNotionalUSD: 0,
                perpsPnlUSD: 0,
                perpsNotionalUSDPlusPnlUsd: 0,
                withdrawableUSDC: 0,
                perpsUSD: 0,
                spotUSD: 0,
                totalUSD: 0,
            },
            deltas: { perpsHYPE: 0, spotHYPE: 0, totalHYPE: 0 },
            perpAggregates: { totalMargin: 0, totalNotional: 0, totalPnl: 0, avgLeverage: 0 },
            apr: { currentFundingAPR: null, fundingAPR24h: null, fundingAPR7d: null, fundingAPR30d: null },
        },
        portfolio: {
            totalUSD: 0,
            deployedAUM: 0,
            netDeltaHYPE: 0,
            strategyDelta: 0,
            apr: { combined24h: null, combined7d: null, combined30d: null },
        },
    }

    // Get HYPE price for loading check
    const hypePrice =
        snapshot?.prices?.HYPE ||
        calculateHypePrice({
            lp: snapshot?.positions?.hyperEvm?.lps,
            wallet: snapshot?.positions?.hyperEvm?.balances,
        })

    // Show loading state while initial data is being fetched or if we don't have price data
    if ((isLoading && !snapshot) || !hypePrice) {
        return (
            <PageWrapper className="px-4">
                <AccountLoading />
            </PageWrapper>
        )
    }

    // Show simple error state if there's an error
    if (error && !snapshot) {
        return (
            <PageWrapper className="px-4">
                <div className="space-y-4 py-12 text-center">
                    <p className="text-default/50">{error instanceof Error ? error.message : 'Failed to load account'}</p>
                </div>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper className="px-4">
            <AccountTemplate
                header={
                    <AccountHeader
                        accountFromUrl={accountFromUrl}
                        lastRefreshTime={lastRefreshTime}
                        nextUpdateIn={nextUpdateIn}
                        isFetching={isFetching}
                        refetch={refetch}
                        metrics={metrics}
                        timings={snapshot?.timings}
                    />
                }
                // charts={null}
                charts={<DeltaTrackingChart />}
                hyperEvm={{
                    lp: <AccountLPs />,
                    balances: <AccountWallet />,
                    txs: null,
                }}
                hyperCore={{
                    short: <AccountPerps />,
                    spot: <AccountSpots />,
                    txs: null,
                }}
                activity={
                    <CollapsibleCard title="Activity" defaultExpanded={false} headerRight={null}>
                        <CombinedActivity account={params.account as string} limit={50} />
                    </CollapsibleCard>
                }
            />
        </PageWrapper>
    )
}
