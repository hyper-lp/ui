'use client'

import { HYPEREVM_DEXS } from '@/config/hyperevm-dexs.config'
import type { LPPosition } from '@/interfaces'
import { ImageWrapper } from '@/components/common/ImageWrapper'
import { DexProtocol } from '@/enums'
import { formatNumber } from '@/utils/format.util'

interface LPPositionsByDexProps {
    positions: LPPosition[]
}

interface DexGroupedPositions {
    dex: DexProtocol
    positions: LPPosition[]
    totalValue: number
    totalDelta: number
}

export function LPPositionsByDex({ positions }: LPPositionsByDexProps) {
    if (!positions || positions.length === 0) {
        return <div className="py-4 text-center text-default/50">No LP positions found</div>
    }

    // Group positions by DEX
    const groupedByDex = positions.reduce(
        (acc, position) => {
            const dex = position.dex.toLowerCase() as DexProtocol
            if (!acc[dex]) {
                acc[dex] = []
            }
            acc[dex].push(position)
            return acc
        },
        {} as Record<DexProtocol, LPPosition[]>,
    )

    // Calculate stats for each DEX
    const dexStats: DexGroupedPositions[] = Object.entries(groupedByDex)
        .map(([dex, dexPositions]) => {
            const totalValue = dexPositions.reduce((sum, p) => sum + p.valueUSD, 0)

            // Calculate delta in HYPE tokens for this DEX
            const totalDelta = dexPositions.reduce((sum, p) => {
                const token0IsHype = p.token0Symbol === 'WHYPE' || p.token0Symbol === 'HYPE'
                const token1IsHype = p.token1Symbol === 'WHYPE' || p.token1Symbol === 'HYPE'

                if (token0IsHype && p.token0Amount) return sum + p.token0Amount
                else if (token1IsHype && p.token1Amount) return sum + p.token1Amount
                return sum
            }, 0)

            return {
                dex: dex as DexProtocol,
                positions: dexPositions,
                totalValue,
                totalDelta,
            }
        })
        .sort((a, b) => b.totalValue - a.totalValue) // Sort by value descending

    return (
        <div className="space-y-4">
            {/* Summary by DEX */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {dexStats.map(({ dex, positions: dexPositions, totalValue, totalDelta }) => {
                    const dexConfig = HYPEREVM_DEXS[dex]
                    return (
                        <div key={dex} className="rounded-lg border p-4">
                            <div className="mb-2 flex items-center gap-2">
                                <ImageWrapper src={dexConfig?.logoUrl} alt={`${dex} logo`} width={24} height={24} className="rounded-full" />
                                <h4 className="font-semibold">{dexConfig?.name || dex}</h4>
                            </div>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-default/50">Positions:</span>
                                    <span className="font-medium">{dexPositions.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-default/50">Total Value:</span>
                                    <span className="font-medium">${formatNumber(totalValue)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-default/50">HYPE Delta:</span>
                                    <span className={`font-medium ${totalDelta > 0 ? 'text-green-600' : totalDelta < 0 ? 'text-red-600' : ''}`}>
                                        {totalDelta > 0 ? '+' : ''}
                                        {formatNumber(totalDelta, 4)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Detailed positions by DEX */}
            <div className="space-y-6">
                {dexStats.map(({ dex, positions: dexPositions }) => {
                    const dexConfig = HYPEREVM_DEXS[dex]
                    return (
                        <div key={dex} className="space-y-4">
                            <div className="flex items-center gap-2">
                                <ImageWrapper src={dexConfig?.logoUrl} alt={`${dex} logo`} width={20} height={20} className="rounded-full" />
                                <h3 className="text-lg font-semibold">
                                    {dexConfig?.name || dex} ({dexPositions.length} position{dexPositions.length !== 1 ? 's' : ''})
                                </h3>
                            </div>

                            {/* Compact Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-default/10">
                                            <th className="border p-2 text-left">Token ID</th>
                                            <th className="border p-2 text-left">Pair</th>
                                            <th className="border p-2 text-left">Fee</th>
                                            <th className="border p-2 text-center">Range</th>
                                            <th className="border p-2 text-right">Token0</th>
                                            <th className="border p-2 text-right">Token1</th>
                                            <th className="border p-2 text-right">Total USD</th>
                                            <th className="border p-2 text-center">View</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dexPositions.map((position) => (
                                            <tr key={position.id} className="hover:bg-default/10">
                                                <td className="border p-2 font-mono">#{position.tokenId}</td>
                                                <td className="border p-2">
                                                    {position.token0Symbol}/{position.token1Symbol}
                                                </td>
                                                <td className="border p-2">{position.feeTier || 'N/A'}</td>
                                                <td className="border p-2 text-center">
                                                    <span className={position.inRange ? 'text-green-600' : 'text-red-600'}>
                                                        {position.inRange ? '✓ In' : '✗ Out'}
                                                    </span>
                                                </td>
                                                <td className="border p-2 text-right">
                                                    <div className="text-xs text-default/50">{position.token0Symbol}</div>
                                                    <div>{position.token0Amount ? formatNumber(position.token0Amount, 4) : '0'}</div>
                                                </td>
                                                <td className="border p-2 text-right">
                                                    <div className="text-xs text-default/50">{position.token1Symbol}</div>
                                                    <div>{position.token1Amount ? formatNumber(position.token1Amount, 4) : '0'}</div>
                                                </td>
                                                <td className="border p-2 text-right font-semibold">${formatNumber(position.valueUSD)}</td>
                                                <td className="border p-2 text-center">
                                                    {dexConfig?.portfolioUrl && (
                                                        <a
                                                            href={dexConfig.portfolioUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 underline hover:text-blue-800"
                                                        >
                                                            View ↗
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Detailed Position Information */}
                            <div className="space-y-2">
                                <h4 className="font-semibold">Detailed Position Information</h4>
                                {dexPositions.map((position) => (
                                    <div key={position.id} className="space-y-3 rounded border bg-default/10 p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="font-mono text-lg font-semibold">Position #{position.tokenId}</div>
                                                <div className="text-sm text-default/50">
                                                    {position.token0Symbol}/{position.token1Symbol} • Fee:{' '}
                                                    {position.feeTier || `${position.fee ? (position.fee / 10000).toFixed(2) + '%' : 'N/A'}`}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold">${formatNumber(position.valueUSD)}</div>
                                                <div className={`text-sm ${position.inRange ? 'text-green-600' : 'text-red-600'}`}>
                                                    {position.inRange ? 'In Range' : 'Out of Range'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Token Addresses */}
                                        <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                                            <div>
                                                <span className="text-default/50">Token0 Address:</span>
                                                <div className="break-all font-mono text-xs">{position.token0}</div>
                                            </div>
                                            <div>
                                                <span className="text-default/50">Token1 Address:</span>
                                                <div className="break-all font-mono text-xs">{position.token1}</div>
                                            </div>
                                        </div>

                                        {/* Liquidity and Amounts */}
                                        <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                                            <div>
                                                <span className="text-default/50">Liquidity:</span>
                                                <div className="font-mono">{position.liquidity.toString()}</div>
                                            </div>
                                            <div>
                                                <span className="text-default/50">{position.token0Symbol} Amount:</span>
                                                <div className="font-mono">
                                                    {position.token0Amount ? formatNumber(position.token0Amount, 6) : '0'}
                                                </div>
                                                <div className="text-xs text-default/50">${formatNumber(position.token0ValueUSD || 0)}</div>
                                            </div>
                                            <div>
                                                <span className="text-default/50">{position.token1Symbol} Amount:</span>
                                                <div className="font-mono">
                                                    {position.token1Amount ? formatNumber(position.token1Amount, 6) : '0'}
                                                </div>
                                                <div className="text-xs text-default/50">${formatNumber(position.token1ValueUSD || 0)}</div>
                                            </div>
                                        </div>

                                        {/* Tick Range Information */}
                                        {(position.tickLower !== undefined || position.tickUpper !== undefined) && (
                                            <div className="space-y-2 text-sm">
                                                <div className="font-semibold">Price Range</div>
                                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                    <div>
                                                        <span className="text-default/50">Tick Range:</span>
                                                        <div className="font-mono">
                                                            {position.tickLower ?? 'N/A'} → {position.tickUpper ?? 'N/A'}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-default/50">Price Range:</span>
                                                        <div className="font-mono text-xs">
                                                            {position.tickLower !== undefined
                                                                ? Math.pow(1.0001, position.tickLower).toFixed(6)
                                                                : 'N/A'}{' '}
                                                            →{' '}
                                                            {position.tickUpper !== undefined
                                                                ? Math.pow(1.0001, position.tickUpper).toFixed(6)
                                                                : 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                                {position.tickCurrent !== undefined && (
                                                    <div>
                                                        <span className="text-default/50">Current Tick:</span>
                                                        <div className="font-mono">
                                                            {position.tickCurrent} (Price: {Math.pow(1.0001, position.tickCurrent).toFixed(6)})
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Additional Details */}
                                        <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                                            <div>
                                                <span className="text-default/50">Pool:</span>
                                                <div className="truncate font-mono text-xs">{position.pool}</div>
                                            </div>
                                            <div>
                                                <span className="text-default/50">ID:</span>
                                                <div className="font-mono text-xs">{position.id}</div>
                                            </div>
                                            {position.fee && (
                                                <div>
                                                    <span className="text-default/50">Fee Tier:</span>
                                                    <div className="font-mono">{(position.fee / 10000).toFixed(2)}%</div>
                                                </div>
                                            )}
                                            {position.sqrtPriceX96 && (
                                                <div>
                                                    <span className="text-default/50">Sqrt Price X96:</span>
                                                    <div className="truncate font-mono text-xs">{position.sqrtPriceX96.toString()}</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Uncollected Fees if available */}
                                        {(position.fees0Uncollected !== undefined || position.fees1Uncollected !== undefined) && (
                                            <div className="border-t pt-2">
                                                <div className="mb-1 text-sm font-semibold">Uncollected Fees</div>
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <span className="text-default/50">{position.token0Symbol}:</span>
                                                        <div className="font-mono">{position.fees0Uncollected || 0}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-default/50">{position.token1Symbol}:</span>
                                                        <div className="font-mono">{position.fees1Uncollected || 0}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
