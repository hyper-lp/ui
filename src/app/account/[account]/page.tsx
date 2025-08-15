'use client'

import { useState, useEffect, useMemo } from 'react'
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
import { CollapsibleSection as CollapsibleCard } from '@/components/app/account/CollapsibleCard'
import { RoundedAmount } from '@/components/common/RoundedAmount'
import { getHyperCoreAssetBySymbol } from '@/config/hypercore-assets.config'
import { DEFAULT_TRANSACTION_LIMIT, DEFAULT_HYPE_PRICE } from '@/config/app.config'
import { formatUSD, getDeltaStatus } from '@/utils/format.util'
import { HypeIcon } from '@/components/common/HypeIcon'
import { HypeDeltaTooltip } from '@/components/common/HypeDeltaTooltip'
import { DeltaDisplay } from '@/components/common/DeltaDisplay'
import { DateWrapperAccurate } from '@/components/common/DateWrapper'
import StyledTooltip from '@/components/common/StyledTooltip'
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
    const accountData = useAccountData(addressParam, addressParam)
    const { positions, metrics, meta, actions, accountInfo, accountSummary } = accountData

    // Calculate HyperEVM capital breakdown (HYPE vs Stable) - must be before early returns
    const hyperEvmBreakdown = useMemo(() => {
        let hypeValue = 0
        let stableValue = 0

        // LP positions
        positions.lp?.forEach((p) => {
            // Token 0
            if (p.token0Symbol === 'HYPE' || p.token0Symbol === 'WHYPE') {
                hypeValue += p.token0ValueUSD || 0
            } else if (p.token0Symbol === 'USDT0' || p.token0Symbol === 'USD₮0' || p.token0Symbol === 'USDC') {
                stableValue += p.token0ValueUSD || 0
            }
            // Token 1
            if (p.token1Symbol === 'HYPE' || p.token1Symbol === 'WHYPE') {
                hypeValue += p.token1ValueUSD || 0
            } else if (p.token1Symbol === 'USDT0' || p.token1Symbol === 'USD₮0' || p.token1Symbol === 'USDC') {
                stableValue += p.token1ValueUSD || 0
            }
        })

        // Wallet balances
        positions.wallet?.forEach((b) => {
            if (b.symbol === 'HYPE' || b.symbol === 'WHYPE') {
                hypeValue += b.valueUSD || 0
            } else if (b.symbol === 'USDT0' || b.symbol === 'USD₮0' || b.symbol === 'USDC') {
                stableValue += b.valueUSD || 0
            }
        })

        const total = hypeValue + stableValue
        return {
            total,
            hypeValue,
            stableValue,
            hypePercent: total > 0 ? (hypeValue / total) * 100 : 0,
            stablePercent: total > 0 ? (stableValue / total) * 100 : 0,
        }
    }, [positions.lp, positions.wallet])

    // Calculate HyperCore capital and leverage metrics - must be before early returns
    const hyperCoreBreakdown = useMemo(() => {
        const margin = metrics.perp.totalMargin
        const notional = metrics.perp.totalNotional
        const leverage = metrics.perp.avgLeverage

        // Spot balances
        const spotValue = positions.spot?.reduce((sum, b) => sum + b.valueUSD, 0) || 0
        const total = margin + spotValue

        return {
            total,
            margin,
            notional,
            leverage,
            spotValue,
        }
    }, [metrics.perp, positions.spot])

    // Loading state
    if (meta.isLoading && !accountInfo) {
        return (
            <PageWrapper className="px-4">
                <AccountTemplate
                    header={
                        <div className="mb-4 w-full">
                            <div className="h-10 w-full animate-pulse rounded bg-default/20" />
                        </div>
                    }
                    summary={{
                        address: <AccountCard isLoading />,
                        aum: <AccountCard isLoading />,
                        netDelta: <AccountCard isLoading />,
                        apr: <AccountCard isLoading />,
                    }}
                    hyperEvm={{
                        lp: <CollapsibleCard title="LPs" defaultExpanded={false} isLoading />,
                        balances: <CollapsibleCard title="Wallet" defaultExpanded={false} isLoading />,
                        txs: <CollapsibleCard title="Transactions" defaultExpanded={false} isLoading />,
                    }}
                    hyperCore={{
                        short: <CollapsibleCard title="Perpetuals" defaultExpanded={false} isLoading />,
                        spot: <CollapsibleCard title="Spot" defaultExpanded={false} isLoading />,
                        txs: <CollapsibleCard title="Trades" defaultExpanded={false} isLoading />,
                    }}
                />
            </PageWrapper>
        )
    }

    // Error state
    if (meta.error) {
        return (
            <PageWrapper className="px-4">
                <div className="space-y-4 py-12 text-center">
                    <p className="text-default/50">{meta.error instanceof Error ? meta.error.message : 'Failed to load account'}</p>
                    <button
                        onClick={() => actions.refetch()}
                        className="rounded border border-default/20 px-4 py-2 text-sm transition-colors hover:bg-default/5"
                    >
                        Retry
                    </button>
                </div>
            </PageWrapper>
        )
    }

    // No data state
    if (!meta.isSuccess || !accountInfo) {
        return (
            <PageWrapper className="px-4">
                <div className="space-y-4 py-12 text-center">
                    <p className="text-default/50">
                        No data for <code className="font-mono text-sm">{addressParam}</code>
                    </p>
                    <button
                        onClick={() => actions.refetch()}
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
        if (positions.lp && positions.lp.length > 0) {
            const hypePosition = positions.lp.find(
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
        if (positions.wallet && positions.wallet.length > 0) {
            const hypeBalance = positions.wallet.find((b) => b.symbol === 'HYPE')
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
                    actions.refetch()
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
                actions.refetch()
            }
        }
    }

    return (
        <PageWrapper className="px-4">
            <AccountTemplate
                header={
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
                            {meta.lastRefreshTime && (
                                <DateWrapperAccurate date={meta.lastRefreshTime} className="whitespace-nowrap text-sm text-default/50" />
                            )}
                            <button
                                onClick={() => actions.refetch()}
                                disabled={meta.isFetching}
                                className="rounded p-1 hover:bg-default/10 disabled:opacity-50"
                                title="Refresh all data"
                            >
                                <IconWrapper id={IconIds.REFRESH} className={`size-4 text-default/50 ${meta.isFetching ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>
                }
                summary={{
                    address: (
                        <AccountCard>
                            <span className="text-sm text-default/50">Capital Deployed</span>
                            <RoundedAmount amount={metrics.values.totalPortfolio} className="text-xl font-semibold">
                                {formatUSD(metrics.values.totalPortfolio)}
                            </RoundedAmount>
                            <span className="text-sm text-default/50">
                                {positions.lp?.length || 0} position{positions.lp?.length !== 1 ? 's' : ''}
                            </span>
                        </AccountCard>
                    ),
                    aum: (
                        <AccountCard>
                            <span className="text-sm text-default/50">Long LP</span>
                            <RoundedAmount amount={metrics.values.totalLp} className="text-xl font-semibold">
                                {formatUSD(metrics.values.totalLp)}
                            </RoundedAmount>
                            <span className="text-sm text-default/50">
                                {accountSummary?.currentAPR?.lpFeeAPR ? `${accountSummary.currentAPR.lpFeeAPR.toFixed(1)}% APR` : 'N/A'}
                            </span>
                        </AccountCard>
                    ),
                    netDelta: (
                        <AccountCard>
                            <span className="text-sm text-default/50">Short Perp</span>
                            <RoundedAmount amount={Math.abs(metrics.values.totalPerp)} className="text-xl font-semibold">
                                {formatUSD(Math.abs(metrics.values.totalPerp))}
                            </RoundedAmount>
                            <span className="text-sm text-default/50">
                                {accountSummary?.currentAPR?.fundingAPR ? `${accountSummary.currentAPR.fundingAPR.toFixed(1)}% APR` : 'N/A'}
                            </span>
                        </AccountCard>
                    ),
                    apr: (
                        <AccountCard>
                            <span className="text-sm text-default/50">Net Delta</span>
                            <div className="flex items-center gap-1">
                                <HypeIcon size={20} />
                                <HypeDeltaTooltip
                                    delta={metrics.deltas.netTotal}
                                    hypePrice={hypePrice}
                                    decimals={getHyperCoreAssetBySymbol('HYPE')?.decimalsForRounding ?? 1}
                                    className="text-xl font-semibold"
                                />
                            </div>
                            <span className="text-sm text-default/50">{getDeltaStatus(metrics.deltas.netTotal)}</span>
                        </AccountCard>
                    ),
                }}
                hyperEvm={{
                    lp: (
                        <CollapsibleCard
                            title="Liquidity Positions"
                            defaultExpanded={false}
                            headerRight={
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-base text-default">
                                        <span className="font-medium">$ {metrics.values.totalLp.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                                        <span>•</span>
                                        <span>
                                            {positions.lp?.length || 0} LP{positions.lp?.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <DeltaDisplay delta={metrics.deltas.lp} hypePrice={hypePrice} decimals={1} />
                                </div>
                            }
                        >
                            <LPPositionsTable positions={positions.lp} />
                        </CollapsibleCard>
                    ),
                    balances: (
                        <CollapsibleCard
                            title="Wallet"
                            defaultExpanded={false}
                            headerRight={
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-medium text-default">
                                        $ {(positions.wallet?.reduce((sum, b) => sum + b.valueUSD, 0) || 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    </span>
                                    <DeltaDisplay delta={metrics.deltas.wallet} hypePrice={hypePrice} decimals={1} />
                                </div>
                            }
                        >
                            <WalletBalancesTable balances={positions.wallet} />
                        </CollapsibleCard>
                    ),
                    txs: (
                        <CollapsibleCard title="Transactions" defaultExpanded={false}>
                            <TransactionHistory account={meta.addresses.evm} limit={DEFAULT_TRANSACTION_LIMIT} />
                        </CollapsibleCard>
                    ),
                    capital:
                        hyperEvmBreakdown.total > 0 ? (
                            <StyledTooltip
                                content={
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between gap-8">
                                            <span className="text-default">HYPE:</span>
                                            <span className="font-medium text-default">
                                                {formatUSD(hyperEvmBreakdown.hypeValue)} ({hyperEvmBreakdown.hypePercent.toFixed(0)}%)
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-8">
                                            <span className="text-default">Stable:</span>
                                            <span className="font-medium text-default">
                                                {formatUSD(hyperEvmBreakdown.stableValue)} ({hyperEvmBreakdown.stablePercent.toFixed(0)}%)
                                            </span>
                                        </div>
                                    </div>
                                }
                                placement="bottom"
                            >
                                <div className="cursor-help text-sm font-medium text-default">{formatUSD(hyperEvmBreakdown.total)}</div>
                            </StyledTooltip>
                        ) : null,
                }}
                hyperCore={{
                    short: (
                        <CollapsibleCard
                            title="Perpetuals"
                            defaultExpanded={false}
                            headerRight={
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 text-base text-default">
                                        <span>$ {metrics.perp.totalMargin.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} margin</span>
                                        <span>•</span>
                                        <span>{metrics.perp.avgLeverage.toFixed(1)}x lev</span>
                                    </div>
                                    <DeltaDisplay delta={metrics.deltas.perp} hypePrice={hypePrice} decimals={1} />
                                </div>
                            }
                        >
                            <PerpPositionsTable positions={positions.perp} />
                        </CollapsibleCard>
                    ),
                    spot: (
                        <CollapsibleCard
                            title="Spot"
                            defaultExpanded={false}
                            headerRight={
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-medium text-default">
                                        $ {(positions.spot?.reduce((sum, b) => sum + b.valueUSD, 0) || 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    </span>
                                    <DeltaDisplay delta={metrics.deltas.spot} hypePrice={hypePrice} decimals={1} />
                                </div>
                            }
                        >
                            <SpotBalancesTable balances={positions.spot} />
                        </CollapsibleCard>
                    ),
                    txs: (
                        <CollapsibleCard title="Trades" defaultExpanded={false}>
                            <HyperCoreTransactionHistory account={meta.addresses.core} limit={DEFAULT_TRANSACTION_LIMIT} />
                        </CollapsibleCard>
                    ),
                    capital:
                        hyperCoreBreakdown.total > 0 ? (
                            <StyledTooltip
                                content={
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between gap-8">
                                            <span className="text-default">Margin:</span>
                                            <span className="font-medium text-default">{formatUSD(hyperCoreBreakdown.margin)}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-8">
                                            <span className="text-default">Notional:</span>
                                            <span className="font-medium text-default">{formatUSD(hyperCoreBreakdown.notional)}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-8">
                                            <span className="text-default">Leverage:</span>
                                            <span className="font-medium text-default">{hyperCoreBreakdown.leverage.toFixed(1)}x</span>
                                        </div>
                                        {hyperCoreBreakdown.spotValue > 0 && (
                                            <div className="flex items-center justify-between gap-8 border-t border-default/20 pt-1">
                                                <span className="text-default">Spot:</span>
                                                <span className="font-medium text-default">{formatUSD(hyperCoreBreakdown.spotValue)}</span>
                                            </div>
                                        )}
                                    </div>
                                }
                                placement="bottom"
                            >
                                <div className="cursor-help text-sm font-medium text-default">{formatUSD(hyperCoreBreakdown.total)}</div>
                            </StyledTooltip>
                        ) : null,
                }}
            />
        </PageWrapper>
    )
}
