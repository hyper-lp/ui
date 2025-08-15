'use client'

import { useSearchParams, useParams } from 'next/navigation'
import PageWrapper from '@/components/common/PageWrapper'
import { useAccountData } from '@/hooks/useAccountData'
import { AccountHeader, PerpPositionsTable, SpotBalancesTable, HyperEvmBalancesTable, TransactionHistory } from '@/components/app/account'
import { HyperCoreTransactionHistory } from '@/components/app/account/HyperCoreTransactionHistory'
import { CollapsibleLPPositions } from '@/components/app/account/CollapsibleLPPositions'
import AccountTemplate from '@/components/app/account/layout/AccountTemplate'
import { AccountCard } from '@/components/app/account/layout/AccountCard'
import { CollapsibleCard } from '@/components/app/account/CollapsibleCard'
import { RoundedAmount } from '@/components/common/RoundedAmount'
import { getTokenBySymbol } from '@/config/hyperevm-tokens.config'
import { getHyperCoreAssetBySymbol } from '@/config/hypercore-assets.config'
import { DEFAULT_TRANSACTION_LIMIT, DEFAULT_HYPE_PRICE } from '@/config/app.config'
import { formatUSD, getDeltaStatus } from '@/utils/format.util'
import { CardSkeleton, SectionSkeleton } from '@/components/common/SkeletonLoader'
import { HypeIcon } from '@/components/common/HypeIcon'
import { HypeDeltaTooltip } from '@/components/common/HypeDeltaTooltip'
import { DeltaDisplay } from '@/components/common/DeltaDisplay'

export default function AccountPage() {
    const searchParams = useSearchParams()
    const params = useParams()
    const accountFromUrl = params?.account as string
    const addressParam = searchParams?.get('address') || accountFromUrl || ''

    const {
        accountInfo,
        hyperEvmLpPositions,
        hyperEvmTokenBalances,
        hyperCorePerpPositions,
        hyperCoreSpotBalances,
        accountSummary,
        isSuccess,
        hyperEvmLpDelta,
        hyperEvmSpotDelta,
        hyperCorePerpDelta,
        hyperCoreSpotDelta,
        totalNetDelta,
        totalPortfolioValue,
        totalLpValue,
        totalPerpValue,
        isLoading,
        error,
        isFetching,
        refetch,
        lastRefreshTime,
        evmAddress,
        coreAddress,
    } = useAccountData(addressParam, addressParam)

    // Loading state
    if (isLoading && !accountInfo) {
        return (
            <PageWrapper className="px-4">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                        <CardSkeleton />
                        <CardSkeleton />
                        <CardSkeleton />
                        <CardSkeleton />
                    </div>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div className="space-y-4">
                            <SectionSkeleton title="Liquidity Positions" rows={2} />
                            <SectionSkeleton title="Wallet Balances" rows={3} />
                        </div>
                        <div className="space-y-4">
                            <SectionSkeleton title="Perpetual Positions" rows={2} />
                            <SectionSkeleton title="Spot Balances" rows={3} />
                        </div>
                    </div>
                </div>
            </PageWrapper>
        )
    }

    // Error state
    if (error) {
        return (
            <PageWrapper className="px-4">
                <div className="space-y-4 py-12 text-center">
                    <p className="text-default/50">{error instanceof Error ? error.message : 'Failed to load account'}</p>
                    <button
                        onClick={() => refetch()}
                        className="rounded border border-default/20 px-4 py-2 text-sm transition-colors hover:bg-default/5"
                    >
                        Retry
                    </button>
                </div>
            </PageWrapper>
        )
    }

    // No data state
    if (!isSuccess || !accountInfo) {
        return (
            <PageWrapper className="px-4">
                <div className="space-y-4 py-12 text-center">
                    <p className="text-default/50">
                        No data for <code className="font-mono text-sm">{addressParam}</code>
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="rounded border border-default/20 px-4 py-2 text-sm transition-colors hover:bg-default/5"
                    >
                        Refresh
                    </button>
                </div>
            </PageWrapper>
        )
    }

    // Calculate HYPE price from LP or spot balances
    const getHypePrice = () => {
        // Try to get from LP positions
        if (hyperEvmLpPositions && hyperEvmLpPositions.length > 0) {
            const hypePosition = hyperEvmLpPositions.find(
                (p) => p.token0Symbol === 'HYPE' || p.token1Symbol === 'HYPE' || p.token0Symbol === 'WHYPE' || p.token1Symbol === 'WHYPE',
            )
            if (hypePosition) {
                const hypeAmount =
                    hypePosition.token0Symbol === 'HYPE' || hypePosition.token0Symbol === 'WHYPE'
                        ? hypePosition.token0Amount
                        : hypePosition.token1Amount
                const hypeValue =
                    hypePosition.token0Symbol === 'HYPE' || hypePosition.token0Symbol === 'WHYPE'
                        ? hypePosition.token0ValueUSD
                        : hypePosition.token1ValueUSD
                if (hypeAmount && hypeValue && hypeAmount > 0) {
                    return hypeValue / hypeAmount
                }
            }
        }

        // Try to get from wallet balances
        if (hyperEvmTokenBalances && hyperEvmTokenBalances.length > 0) {
            const hypeBalance = hyperEvmTokenBalances.find((b) => b.symbol === 'HYPE')
            if (hypeBalance && hypeBalance.balance && hypeBalance.valueUSD) {
                const amount = Number(hypeBalance.balance) / 10 ** hypeBalance.decimals
                if (amount > 0) return hypeBalance.valueUSD / amount
            }
        }

        // Default fallback price
        return DEFAULT_HYPE_PRICE
    }

    const hypePrice = getHypePrice()

    return (
        <PageWrapper className="px-4">
            <AccountHeader onRefresh={refetch} isFetching={isFetching} lastRefreshTime={lastRefreshTime} />

            <AccountTemplate
                summary={{
                    address: (
                        <AccountCard>
                            <span className="text-xs text-default/50">Capital Deployed</span>
                            <RoundedAmount amount={totalPortfolioValue} className="text-xl font-semibold">
                                {formatUSD(totalPortfolioValue)}
                            </RoundedAmount>
                            <span className="text-xs text-default/50">
                                {hyperEvmLpPositions?.length || 0} position{hyperEvmLpPositions?.length !== 1 ? 's' : ''}
                            </span>
                        </AccountCard>
                    ),
                    aum: (
                        <AccountCard>
                            <span className="text-xs text-default/50">Long LP</span>
                            <RoundedAmount amount={totalLpValue} className="text-xl font-semibold">
                                {formatUSD(totalLpValue)}
                            </RoundedAmount>
                            <span className="text-xs text-default/50">
                                {accountSummary?.currentAPR?.lpFeeAPR ? `${accountSummary.currentAPR.lpFeeAPR.toFixed(1)}% APR` : 'N/A'}
                            </span>
                        </AccountCard>
                    ),
                    netDelta: (
                        <AccountCard>
                            <span className="text-xs text-default/50">Short Perp</span>
                            <RoundedAmount amount={Math.abs(totalPerpValue)} className="text-xl font-semibold">
                                {formatUSD(Math.abs(totalPerpValue))}
                            </RoundedAmount>
                            <span className="text-xs text-default/50">
                                {accountSummary?.currentAPR?.fundingAPR ? `${accountSummary.currentAPR.fundingAPR.toFixed(1)}% APR` : 'N/A'}
                            </span>
                        </AccountCard>
                    ),
                    apr: (
                        <AccountCard>
                            <span className="text-xs text-default/50">Net Delta</span>
                            <div className="flex items-center gap-1">
                                <HypeIcon size={20} />
                                <HypeDeltaTooltip
                                    delta={totalNetDelta}
                                    hypePrice={hypePrice}
                                    decimals={getHyperCoreAssetBySymbol('HYPE')?.decimalsForRounding ?? 1}
                                    className="text-xl font-semibold"
                                />
                            </div>
                            <span className="text-xs text-default/50">{getDeltaStatus(totalNetDelta)}</span>
                        </AccountCard>
                    ),
                }}
                hyperEvm={{
                    lp: (
                        <CollapsibleCard
                            title="Liquidity Positions"
                            defaultExpanded={true}
                            headerRight={
                                <DeltaDisplay
                                    delta={hyperEvmLpDelta}
                                    hypePrice={hypePrice}
                                    decimals={getTokenBySymbol('HYPE')?.decimalsForRounding ?? 1}
                                />
                            }
                        >
                            {hyperEvmLpPositions && hyperEvmLpPositions.length > 0 ? (
                                <CollapsibleLPPositions positions={hyperEvmLpPositions} />
                            ) : (
                                <div className="py-4 text-center text-default/50">No positions</div>
                            )}
                        </CollapsibleCard>
                    ),
                    balances: (
                        <CollapsibleCard
                            title="Wallet Balances"
                            defaultExpanded={false}
                            headerRight={
                                <DeltaDisplay
                                    delta={hyperEvmSpotDelta}
                                    hypePrice={hypePrice}
                                    decimals={getTokenBySymbol('HYPE')?.decimalsForRounding ?? 1}
                                />
                            }
                        >
                            {hyperEvmTokenBalances && hyperEvmTokenBalances.length > 0 ? (
                                <HyperEvmBalancesTable balances={hyperEvmTokenBalances} />
                            ) : (
                                <div className="py-4 text-center text-default/50">No balances</div>
                            )}
                        </CollapsibleCard>
                    ),
                    txs: (
                        <CollapsibleCard title={`Last ${DEFAULT_TRANSACTION_LIMIT} Transactions`} defaultExpanded={false}>
                            <TransactionHistory account={evmAddress} limit={DEFAULT_TRANSACTION_LIMIT} />
                        </CollapsibleCard>
                    ),
                }}
                hyperCore={{
                    short: (
                        <CollapsibleCard
                            title="Perpetual Positions"
                            defaultExpanded={true}
                            headerRight={
                                <DeltaDisplay
                                    delta={hyperCorePerpDelta}
                                    hypePrice={hypePrice}
                                    decimals={getHyperCoreAssetBySymbol('HYPE')?.decimalsForRounding ?? 1}
                                />
                            }
                        >
                            {hyperCorePerpPositions && hyperCorePerpPositions.length > 0 ? (
                                <PerpPositionsTable positions={hyperCorePerpPositions} />
                            ) : (
                                <div className="py-4 text-center text-default/50">No positions</div>
                            )}
                        </CollapsibleCard>
                    ),
                    spot: (
                        <CollapsibleCard
                            title="Spot Balances"
                            defaultExpanded={false}
                            headerRight={
                                <DeltaDisplay
                                    delta={hyperCoreSpotDelta}
                                    hypePrice={hypePrice}
                                    decimals={getHyperCoreAssetBySymbol('HYPE')?.decimalsForRounding ?? 1}
                                />
                            }
                        >
                            {hyperCoreSpotBalances && hyperCoreSpotBalances.length > 0 ? (
                                <SpotBalancesTable balances={hyperCoreSpotBalances} />
                            ) : (
                                <div className="py-4 text-center text-default/50">No balances</div>
                            )}
                        </CollapsibleCard>
                    ),
                    txs: (
                        <CollapsibleCard title={`Last ${DEFAULT_TRANSACTION_LIMIT} Trades`} defaultExpanded={false}>
                            <HyperCoreTransactionHistory account={coreAddress} limit={DEFAULT_TRANSACTION_LIMIT} />
                        </CollapsibleCard>
                    ),
                }}
            />
        </PageWrapper>
    )
}
