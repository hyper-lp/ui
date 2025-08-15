'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useParams } from 'next/navigation'
import { useQueryState } from 'nuqs'
import { isAddress } from 'viem'
import PageWrapper from '@/components/common/PageWrapper'
import { useAccountData } from '@/hooks/useAccountData'
import { TransactionHistory } from '@/components/app/account'
import { HyperCoreTransactionHistory } from '@/components/app/account/HyperCoreTransactionHistory'
import { LPPositionsTable, WalletBalancesTable, PerpPositionsTable, SpotBalancesTable } from '@/components/app/account/tables'
import AccountTemplate from '@/components/app/account/layout/AccountTemplate'
import { AccountCard } from '@/components/app/account/layout/AccountCard'
import { CollapsibleCard } from '@/components/app/account/CollapsibleCard'
import { RoundedAmount } from '@/components/common/RoundedAmount'
import { getHyperCoreAssetBySymbol } from '@/config/hypercore-assets.config'
import { DEFAULT_TRANSACTION_LIMIT, DEFAULT_HYPE_PRICE } from '@/config/app.config'
import { formatUSD, getDeltaStatus } from '@/utils/format.util'
import { CardSkeleton, SectionSkeleton } from '@/components/common/SkeletonLoader'
import { HypeIcon } from '@/components/common/HypeIcon'
import { HypeDeltaTooltip } from '@/components/common/HypeDeltaTooltip'
import { DeltaDisplay } from '@/components/common/DeltaDisplay'
import { DateWrapperAccurate } from '@/components/common/DateWrapper'
import IconWrapper from '@/components/icons/IconWrapper'
import { IconIds } from '@/enums'

export default function AccountPage() {
    const searchParams = useSearchParams()
    const params = useParams()
    const accountFromUrl = params?.account as string
    const [address, setAddress] = useQueryState('address')

    // Initialize from URL params or account from URL
    const initialAddress = address || accountFromUrl || ''
    const [inputValue, setInputValue] = useState(initialAddress)

    useEffect(() => {
        setInputValue(address || accountFromUrl || '')
    }, [address, accountFromUrl])

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
                            <SectionSkeleton title="Spot" rows={3} />
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

    // Account Header handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInputValue(value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const trimmedValue = inputValue.trim()

            if (trimmedValue && isAddress(trimmedValue)) {
                setAddress(trimmedValue)
                // Trigger refresh when valid address is entered
                if (trimmedValue !== (address || accountFromUrl)) {
                    refetch()
                }
            }
        }
    }

    const handleBlur = () => {
        const trimmedValue = inputValue.trim()

        if (trimmedValue && isAddress(trimmedValue)) {
            setAddress(trimmedValue)
            // Trigger refresh when valid address is entered
            if (trimmedValue !== (address || accountFromUrl)) {
                refetch()
            }
        }
    }

    return (
        <PageWrapper className="px-4">
            {/* Account Header */}
            <div className="mb-4 w-full">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        placeholder="Enter address (0x...)"
                        className="flex-1 border-b border-default/20 bg-background px-1 py-2 font-mono text-sm focus:border-default/50 focus:outline-none"
                    />
                    {lastRefreshTime && <DateWrapperAccurate date={lastRefreshTime} className="whitespace-nowrap text-xs text-default/50" />}
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="rounded p-1 hover:bg-default/10 disabled:opacity-50"
                        title="Refresh all data"
                    >
                        <IconWrapper id={IconIds.REFRESH} className={`size-4 text-default/50 ${isFetching ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

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
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-base text-default/60">
                                        <span className="font-medium text-default">{formatUSD(totalLpValue)}</span>
                                        <span>•</span>
                                        <span>{hyperEvmLpPositions?.length || 0} position{hyperEvmLpPositions?.length !== 1 ? 's' : ''}</span>
                                    </div>
                                    <DeltaDisplay
                                        delta={hyperEvmLpDelta}
                                        hypePrice={hypePrice}
                                        decimals={1}
                                    />
                                </div>
                            }
                        >
                            <LPPositionsTable positions={hyperEvmLpPositions || []} />
                        </CollapsibleCard>
                    ),
                    balances: (
                        <CollapsibleCard
                            title="Wallet"
                            defaultExpanded={false}
                            headerRight={
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-medium text-default">
                                        {formatUSD(hyperEvmTokenBalances?.reduce((sum, b) => sum + b.valueUSD, 0) || 0)}
                                    </span>
                                    <DeltaDisplay
                                        delta={hyperEvmSpotDelta}
                                        hypePrice={hypePrice}
                                        decimals={1}
                                    />
                                </div>
                            }
                        >
                            <WalletBalancesTable balances={hyperEvmTokenBalances || []} />
                        </CollapsibleCard>
                    ),
                    txs: (
                        <CollapsibleCard title="Transactions" defaultExpanded={false}>
                            <TransactionHistory account={evmAddress} limit={DEFAULT_TRANSACTION_LIMIT} />
                        </CollapsibleCard>
                    ),
                }}
                hyperCore={{
                    short: (
                        <CollapsibleCard
                            title="Perpetuals"
                            defaultExpanded={true}
                            headerRight={
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 text-base">
                                        {(() => {
                                            const totalMargin = hyperCorePerpPositions?.reduce((sum, p) => sum + p.marginUsed, 0) || 0
                                            const totalNotional = hyperCorePerpPositions?.reduce((sum, p) => sum + Math.abs(p.notionalValue), 0) || 0
                                            const avgLeverage = totalMargin > 0 ? totalNotional / totalMargin : 0
                                            
                                            return (
                                                <>
                                                    <span className="text-default/60">{formatUSD(totalMargin)} margin</span>
                                                    <span className="text-default/40">•</span>
                                                    <span className="text-default/60">{avgLeverage.toFixed(1)}x</span>
                                                </>
                                            )
                                        })()}
                                    </div>
                                    <DeltaDisplay
                                        delta={hyperCorePerpDelta}
                                        hypePrice={hypePrice}
                                        decimals={1}
                                    />
                                </div>
                            }
                        >
                            <PerpPositionsTable positions={hyperCorePerpPositions || []} />
                        </CollapsibleCard>
                    ),
                    spot: (
                        <CollapsibleCard
                            title="Spot"
                            defaultExpanded={false}
                            headerRight={
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-medium text-default">
                                        {formatUSD(hyperCoreSpotBalances?.reduce((sum, b) => sum + b.valueUSD, 0) || 0)}
                                    </span>
                                    <DeltaDisplay
                                        delta={hyperCoreSpotDelta}
                                        hypePrice={hypePrice}
                                        decimals={1}
                                    />
                                </div>
                            }
                        >
                            <SpotBalancesTable balances={hyperCoreSpotBalances || []} />
                        </CollapsibleCard>
                    ),
                    txs: (
                        <CollapsibleCard title={'Trades'} defaultExpanded={false}>
                            <HyperCoreTransactionHistory account={coreAddress} limit={DEFAULT_TRANSACTION_LIMIT} />
                        </CollapsibleCard>
                    ),
                }}
            />
        </PageWrapper>
    )
}
