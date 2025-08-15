'use client'

import { useState } from 'react'
import type { SpotBalance } from '@/interfaces'
import { IconIds } from '@/enums'
import FileMapper from '@/components/common/FileMapper'
import IconWrapper from '@/components/icons/IconWrapper'
import { getHyperCoreAssetBySymbol } from '@/config/hypercore-assets.config'
import { SpotRowTemplate } from './TableTemplates'
import { formatNumber, formatUSD } from '@/utils/format.util'
import { cn } from '@/utils'
import StyledTooltip from '@/components/common/StyledTooltip'

interface SpotBalancesTableProps {
    balances: SpotBalance[]
    className?: string
}

export function SpotBalancesTableHeader() {
    return (
        <SpotRowTemplate
            asset={<p className="font-medium text-default/60">Asset</p>}
            balance={<p className="text-right font-medium text-default/60">Balance</p>}
            value={<p className="text-right font-medium text-default/60">Value</p>}
            price={<p className="text-right font-medium text-default/60">Price</p>}
            className="h-8 border-b border-default/10"
        />
    )
}

export function SpotBalancesTable({ balances, className }: SpotBalancesTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

    if (!balances || balances.length === 0) {
        return <div className={cn('py-8 text-center text-default/50', className)}>No spot balances</div>
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
                <SpotBalancesTableHeader />
                <div className="divide-y divide-default/5">
                    {sortedBalances.map((balance) => {
                        const isExpanded = expandedRows.has(balance.id)
                        const balanceNum = typeof balance.balance === 'string' ? parseFloat(balance.balance) : balance.balance
                        const displayBalance = balanceNum > 1e10 ? balanceNum / 1e18 : balanceNum
                        const price = balance.valueUSD > 0 && displayBalance > 0 ? balance.valueUSD / displayBalance : 0

                        return (
                            <div key={balance.id}>
                                <div onClick={() => toggleRow(balance.id)} className="cursor-pointer">
                                    <SpotRowTemplate
                                        asset={
                                            <div className="flex items-center gap-1.5">
                                                <IconWrapper
                                                    id={isExpanded ? IconIds.CHEVRON_DOWN : IconIds.CHEVRON_RIGHT}
                                                    className="size-3 text-default/40"
                                                />
                                                {getHyperCoreAssetBySymbol(balance.asset)?.fileId && (
                                                    <FileMapper
                                                        id={getHyperCoreAssetBySymbol(balance.asset)!.fileId}
                                                        width={20}
                                                        height={20}
                                                        className="rounded-full"
                                                    />
                                                )}
                                                <span className="text-sm">{balance.asset}</span>
                                                {balance.asset === 'HYPE' && (
                                                    <span className="rounded bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                                                        LONG
                                                    </span>
                                                )}
                                            </div>
                                        }
                                        balance={
                                            <span className="font-medium">{formatNumber(displayBalance, balance.asset === 'HYPE' ? 4 : 2)}</span>
                                        }
                                        value={<span className="font-medium text-primary">{formatUSD(balance.valueUSD)}</span>}
                                        price={price > 0 ? <span>{formatUSD(price)}</span> : <span className="text-default/50">-</span>}
                                        className="h-10 transition-colors hover:bg-default/5"
                                    />
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="border-t border-default/10 bg-default/5 px-4 py-3">
                                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                                            <div>
                                                <p className="text-xs text-default/50">Asset Symbol</p>
                                                <p className="font-medium">{balance.asset}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-default/50">Asset Type</p>
                                                <p className="font-medium">Spot</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-default/50">Raw Balance</p>
                                                <p className="font-mono text-xs">{balance.balance.toString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-default/50">Display Balance</p>
                                                <p className="font-medium">{formatNumber(displayBalance, 8)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-default/50">Current Price</p>
                                                <p className="font-medium">{price > 0 ? formatUSD(price) : 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-default/50">Total Value USD</p>
                                                <p className="font-medium text-primary">{formatUSD(balance.valueUSD)}</p>
                                            </div>
                                            {balance.asset === 'HYPE' && (
                                                <>
                                                    <div>
                                                        <p className="text-xs text-default/50">Position Type</p>
                                                        <p className="font-medium text-green-600">LONG</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-default/50">Market Cap (Est)</p>
                                                        <p className="font-medium">{formatUSD(price * 1000000000)}</p>
                                                    </div>
                                                </>
                                            )}
                                            {balance.asset === 'USDC' && (
                                                <div>
                                                    <p className="text-xs text-default/50">Collateral Type</p>
                                                    <p className="font-medium">Margin Collateral</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Raw JSON */}
                                        <div className="mt-3 flex justify-end">
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
