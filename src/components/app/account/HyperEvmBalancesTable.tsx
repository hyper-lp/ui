'use client'

import { useState } from 'react'
import type { HyperEvmBalance } from '@/interfaces'
import { IconIds, FileIds } from '@/enums'
import IconWrapper from '@/components/icons/IconWrapper'
import FileMapper from '@/components/common/FileMapper'
import { getTokenBySymbol, NATIVE_HYPE_ADDRESS } from '@/config/hyperevm-tokens.config'
import StyledTooltip from '@/components/common/StyledTooltip'
import { formatNumber } from '@/utils/format.util'

interface HyperEvmBalancesTableProps {
    balances: HyperEvmBalance[]
}

export function HyperEvmBalancesTable({ balances }: HyperEvmBalancesTableProps) {
    const [expandedTokens, setExpandedTokens] = useState<Set<string>>(new Set())

    const formatBalance = (balance: number, symbol: string) => {
        const tokenConfig = getTokenBySymbol(symbol)
        const decimals = tokenConfig?.decimalsForRounding ?? 2
        return formatNumber(balance, decimals)
    }

    const toggleToken = (tokenId: string) => {
        setExpandedTokens((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(tokenId)) {
                newSet.delete(tokenId)
            } else {
                newSet.add(tokenId)
            }
            return newSet
        })
    }

    if (!balances || balances.length === 0) return null

    // Sort balances by value USD descending
    const sortedBalances = [...balances].sort((a, b) => b.valueUSD - a.valueUSD)

    return (
        <div>
            {sortedBalances.map((balance) => {
                const isExpanded = expandedTokens.has(balance.id)
                const formattedBalance = Number(balance.balance) / 10 ** balance.decimals

                return (
                    <div key={balance.id}>
                        {/* Summary Row */}
                        <button
                            onClick={() => toggleToken(balance.id)}
                            className="w-full border-b border-default/10 py-2 transition-colors hover:bg-default/5"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <IconWrapper id={isExpanded ? IconIds.CHEVRON_DOWN : IconIds.CHEVRON_RIGHT} className="size-4 text-default/50" />

                                    {/* Token Logo */}
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
                                        width={16}
                                        height={16}
                                        className="rounded-full"
                                    />

                                    <span className="font-medium">{balance.symbol}</span>
                                    {balance.symbol === 'HYPE' && (
                                        <span className="rounded bg-green-100 px-2 py-0.5 text-sm text-green-800 dark:bg-green-900 dark:text-green-200">
                                            LONG
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 text-sm">
                                    <div className="text-right">
                                        <div className="text-sm text-default/50">Balance</div>
                                        {balance.symbol === 'HYPE' ? (
                                            <StyledTooltip
                                                content={
                                                    <div className="space-y-1">
                                                        <div className="font-semibold">HYPE Balance</div>
                                                        <div className="space-y-0.5 text-sm">
                                                            <div>Amount: {formattedBalance.toFixed(4)} HYPE</div>
                                                            <div>Price: ${(balance.valueUSD / formattedBalance).toFixed(2)}/HYPE</div>
                                                            <div>Value: ${balance.valueUSD.toFixed(2)}</div>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <div className="cursor-help font-medium hover:underline">
                                                    {formatBalance(formattedBalance, balance.symbol)}
                                                </div>
                                            </StyledTooltip>
                                        ) : (
                                            <div className="font-medium">{formatBalance(formattedBalance, balance.symbol)}</div>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        <div className="text-sm text-default/50">Value</div>
                                        <div className="font-medium">${formatNumber(balance.valueUSD)}</div>
                                    </div>
                                </div>
                            </div>
                        </button>

                        {/* Expanded Details */}
                        {isExpanded && (
                            <div className="bg-default/5 p-2 text-sm">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-default/50">Contract Address:</span>
                                            <span className="font-mono text-sm">
                                                {balance.address === NATIVE_HYPE_ADDRESS ? 'Native HYPE' : balance.address}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-default/50">Decimals:</span>
                                            <span>{balance.decimals}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-default/50">Raw Balance:</span>
                                            <span className="font-mono text-sm">{balance.balance}</span>
                                        </div>
                                    </div>
                                    <StyledTooltip
                                        content={<pre className="max-h-96 max-w-2xl overflow-auto text-xs">{JSON.stringify(balance, null, 2)}</pre>}
                                        placement="left"
                                    >
                                        <IconWrapper
                                            id={IconIds.INFORMATION}
                                            className="ml-2 size-4 cursor-help text-default/40 hover:text-default/60"
                                        />
                                    </StyledTooltip>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
