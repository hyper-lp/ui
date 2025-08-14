'use client'

import { HYPEREVM_DEXS } from '@/config/hyperevm-dexs.config'
import type { LPPosition } from '@/interfaces'

interface LPPositionsTableProps {
    positions: LPPosition[]
}

export function LPPositionsTable({ positions }: LPPositionsTableProps) {
    const formatNumber = (num: number, decimals = 2) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(num)
    }

    if (!positions || positions.length === 0) return null

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">LP Positions ({positions.length})</h2>

            {/* Main Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border text-sm">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border p-2 text-left">Token ID</th>
                            <th className="border p-2 text-left">DEX</th>
                            <th className="border p-2 text-left">Pair</th>
                            <th className="border p-2 text-left">Fee</th>
                            <th className="border p-2 text-left">Range</th>
                            <th className="border p-2 text-right">Token0 USD</th>
                            <th className="border p-2 text-right">Token1 USD</th>
                            <th className="border p-2 text-right">Total USD</th>
                            <th className="border p-2 text-center">View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {positions.map((position) => {
                            const typedDex = position.dex.toLowerCase() as keyof typeof HYPEREVM_DEXS
                            const positionUrl = HYPEREVM_DEXS[typedDex]?.portfolioUrl || '#'
                            return (
                                <tr key={position.id}>
                                    <td className="border p-2 font-mono">{position.tokenId}</td>
                                    <td className="border p-2">{position.dex}</td>
                                    <td className="border p-2">
                                        {position.token0Symbol}/{position.token1Symbol}
                                    </td>
                                    <td className="border p-2">{position.feeTier || 'N/A'}</td>
                                    <td className="border p-2">
                                        <span className={position.inRange ? 'text-green-600' : 'text-red-600'}>
                                            {position.inRange ? '✓ In' : '✗ Out'}
                                        </span>
                                    </td>
                                    <td className="border p-2 text-right font-mono">
                                        <div className="text-xs text-gray-500">{position.token0Symbol}</div>
                                        <div>{position.token0Amount ? formatNumber(position.token0Amount, 4) : '0'}</div>
                                        <div className="text-xs">${formatNumber(position.token0ValueUSD || 0)}</div>
                                    </td>
                                    <td className="border p-2 text-right font-mono">
                                        <div className="text-xs text-gray-500">{position.token1Symbol}</div>
                                        <div>{position.token1Amount ? formatNumber(position.token1Amount, 4) : '0'}</div>
                                        <div className="text-xs">${formatNumber(position.token1ValueUSD || 0)}</div>
                                    </td>
                                    <td className="border p-2 text-right font-mono font-semibold">${formatNumber(position.valueUSD)}</td>
                                    <td className="border p-2 text-center">
                                        <a
                                            href={positionUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline hover:text-blue-800"
                                        >
                                            View ↗
                                        </a>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Detailed LP Data */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">LP Position Details</h3>
                {positions.map((position) => (
                    <div key={position.id} className="space-y-2 border p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="font-mono text-lg">Position #{position.tokenId}</div>
                                <div className="text-sm text-gray-600">
                                    {position.dex} - {position.token0Symbol}/{position.token1Symbol}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold">${formatNumber(position.valueUSD)}</div>
                                <div className={`text-sm ${position.inRange ? 'text-green-600' : 'text-red-600'}`}>
                                    {position.inRange ? 'In Range' : 'Out of Range'}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                            <div>
                                <span className="text-gray-600">Token0 Address:</span>
                                <div className="truncate font-mono text-xs">{position.token0}</div>
                            </div>
                            <div>
                                <span className="text-gray-600">Token1 Address:</span>
                                <div className="truncate font-mono text-xs">{position.token1}</div>
                            </div>
                            <div>
                                <span className="text-gray-600">Liquidity:</span>
                                <div className="font-mono">{position.liquidity.toString()}</div>
                            </div>
                            <div>
                                <span className="text-gray-600">Fee Tier:</span>
                                <div>{position.feeTier || `${position.fee ? (position.fee / 10000).toFixed(2) + '%' : 'N/A'}`}</div>
                            </div>
                        </div>

                        {(position.tickLower !== undefined || position.tickUpper !== undefined) && (
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-gray-600">Tick Range:</span>
                                    <div className="font-mono">
                                        {position.tickLower ?? 'N/A'} → {position.tickUpper ?? 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-600">Price Range:</span>
                                    <div className="font-mono text-xs">
                                        {position.tickLower ? Math.pow(1.0001, position.tickLower).toFixed(4) : 'N/A'} →{' '}
                                        {position.tickUpper ? Math.pow(1.0001, position.tickUpper).toFixed(4) : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-gray-600">{position.token0Symbol} Amount:</span>
                                <div className="font-mono">{position.token0Amount ? formatNumber(position.token0Amount, 6) : '0'}</div>
                            </div>
                            <div>
                                <span className="text-gray-600">{position.token1Symbol} Amount:</span>
                                <div className="font-mono">{position.token1Amount ? formatNumber(position.token1Amount, 6) : '0'}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
