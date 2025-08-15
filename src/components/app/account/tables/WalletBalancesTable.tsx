'use client'

import { useState } from 'react'
import type { HyperEvmBalance } from '@/interfaces'
import { FileIds, IconIds } from '@/enums'
import FileMapper from '@/components/common/FileMapper'
import IconWrapper from '@/components/icons/IconWrapper'
import { WalletRowTemplate } from './TableTemplates'
import { formatNumber, formatUSD } from '@/utils/format.util'
import { cn, shortenValue } from '@/utils'
import { NATIVE_HYPE_ADDRESS } from '@/config/hyperevm-tokens.config'
import StyledTooltip from '@/components/common/StyledTooltip'

interface WalletBalancesTableProps {
    balances: HyperEvmBalance[]
    className?: string
}

export function WalletBalancesTableHeader() {
    return (
        <WalletRowTemplate
            token={<p className="font-medium text-default/60">Token</p>}
            balance={<p className="text-right font-medium text-default/60">Balance</p>}
            value={<p className="text-right font-medium text-default/60">Value</p>}
            price={<p className="text-right font-medium text-default/60">Price</p>}
            address={<p className="font-medium text-default/60">Address</p>}
            className="h-8 border-b border-default/10"
        />
    )
}

export function WalletBalancesTable({ balances, className }: WalletBalancesTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

    if (!balances || balances.length === 0) {
        return <div className={cn('py-8 text-center text-default/50', className)}>No wallet balances</div>
    }

    const toggleRow = (id: string) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            return newSet
        })
    }

    const sortedBalances = [...balances].sort((a, b) => b.valueUSD - a.valueUSD)

    return (
        <div className={cn('overflow-x-auto', className)}>
            <div className="min-w-max">
                <WalletBalancesTableHeader />
                <div className="divide-y divide-default/5">
                    {sortedBalances.map((balance) => {
                        const isExpanded = expandedRows.has(balance.id)
                        const formattedBalance = Number(balance.balance) / 10 ** balance.decimals
                        const price = balance.valueUSD / formattedBalance

                        return (
                            <div key={balance.id}>
                                <div onClick={() => toggleRow(balance.id)} className="cursor-pointer">
                                    <WalletRowTemplate
                                        token={
                                            <div className="flex items-center gap-1.5">
                                                <IconWrapper
                                                    id={isExpanded ? IconIds.CHEVRON_DOWN : IconIds.CHEVRON_RIGHT}
                                                    className="size-3 text-default/40"
                                                />
                                                <FileMapper
                                                    id={
                                                        balance.symbol === 'HYPE'
                                                            ? FileIds.TOKEN_HYPE
                                                            : balance.symbol === 'USDT0'
                                                              ? FileIds.TOKEN_USDT0
                                                              : balance.symbol === 'USDC'
                                                                ? FileIds.TOKEN_USDC
                                                                : undefined
                                                    }
                                                    width={20}
                                                    height={20}
                                                    className="rounded-full"
                                                />
                                                <span className="text-default">{balance.symbol}</span>
                                                {balance.symbol === 'HYPE' && (
                                                    <span className="rounded bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                                                        LONG
                                                    </span>
                                                )}
                                            </div>
                                        }
                                        balance={
                                            <span className="font-medium">{formatNumber(formattedBalance, balance.decimals === 18 ? 4 : 2)}</span>
                                        }
                                        value={<span className="font-medium text-primary">{formatUSD(balance.valueUSD)}</span>}
                                        price={formattedBalance > 0 ? <span>{formatUSD(price)}</span> : <span className="text-default/50">-</span>}
                                        address={
                                            <span className="truncate text-default/70">
                                                {balance.address === NATIVE_HYPE_ADDRESS ? 'Native HYPE' : shortenValue(balance.address)}
                                            </span>
                                        }
                                        className="h-10 transition-colors hover:bg-default/5"
                                    />
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="border-t border-default/10 bg-default/5 px-4 py-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3 lg:grid-cols-4">
                                            <div>
                                                <p className="text-xs text-default/50">Contract Address</p>
                                                <p className="truncate font-mono text-xs" title={balance.address}>
                                                    {balance.address === NATIVE_HYPE_ADDRESS ? 'Native HYPE' : balance.address}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-default/50">Decimals</p>
                                                <p className="font-medium">{balance.decimals}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-default/50">Raw Balance</p>
                                                <p className="font-mono text-xs">{balance.balance}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-default/50">Formatted Balance</p>
                                                <p className="font-medium">{formatNumber(formattedBalance, 8)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-default/50">Price per Token</p>
                                                <p className="font-medium">{formatUSD(price)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-default/50">Total Value</p>
                                                <p className="font-medium text-primary">{formatUSD(balance.valueUSD)}</p>
                                            </div>
                                            {balance.symbol === 'HYPE' && (
                                                <>
                                                    <div>
                                                        <p className="text-xs text-default/50">Market Cap</p>
                                                        <p className="font-medium">{formatUSD(price * 1000000000)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-default/50">Position Type</p>
                                                        <p className="font-medium text-green-600">LONG</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Raw JSON */}
                                        <div className="mt-4 flex justify-end">
                                            <StyledTooltip
                                                content={
                                                    <pre className="max-h-96 max-w-2xl overflow-auto text-xs">{JSON.stringify(balance, null, 2)}</pre>
                                                }
                                                placement="left"
                                            >
                                                <IconWrapper
                                                    id={IconIds.INFORMATION}
                                                    className="size-4 cursor-help text-default/40 hover:text-default/60"
                                                />
                                            </StyledTooltip>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
