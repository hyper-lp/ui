'use client'

import { useState, useEffect } from 'react'
import { useQueryState } from 'nuqs'
import { isAddress } from 'viem'
import { useParams } from 'next/navigation'

interface AccountHeaderProps {
    onRefresh: () => void
    isFetching: boolean
}

export function AccountHeader({ onRefresh, isFetching }: AccountHeaderProps) {
    const params = useParams()
    const accountFromUrl = params?.account as string

    const [hyperEvmAddress, setHyperEvmAddress] = useQueryState('evm')
    const [hyperCoreAddress, setHyperCoreAddress] = useQueryState('core')

    // Initialize from URL params or account from URL
    const initialEvm = hyperEvmAddress || accountFromUrl || ''
    const initialCore = hyperCoreAddress || accountFromUrl || ''

    const [evmInputValue, setEvmInputValue] = useState(initialEvm)
    const [coreInputValue, setCoreInputValue] = useState(initialCore)
    const [useSameAddress, setUseSameAddress] = useState(initialEvm === initialCore && !!initialEvm)
    const [evmError, setEvmError] = useState<string | null>(null)
    const [coreError, setCoreError] = useState<string | null>(null)

    useEffect(() => {
        setEvmInputValue(hyperEvmAddress || accountFromUrl || '')
        setCoreInputValue(hyperCoreAddress || accountFromUrl || '')
        setUseSameAddress((hyperEvmAddress || accountFromUrl) === (hyperCoreAddress || accountFromUrl) && !!(hyperEvmAddress || accountFromUrl))
    }, [hyperEvmAddress, hyperCoreAddress, accountFromUrl])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const trimmedEvmValue = evmInputValue.trim()
        const trimmedCoreValue = useSameAddress ? trimmedEvmValue : coreInputValue.trim()

        let hasError = false

        if (!trimmedEvmValue) {
            setEvmError('Please enter a HyperEVM address')
            hasError = true
        } else if (!isAddress(trimmedEvmValue)) {
            setEvmError('Invalid EVM address format')
            hasError = true
        }

        if (!useSameAddress) {
            if (!trimmedCoreValue) {
                setCoreError('Please enter a HyperCore address')
                hasError = true
            } else if (!isAddress(trimmedCoreValue)) {
                setCoreError('Invalid address format')
                hasError = true
            }
        }

        if (hasError) return

        setEvmError(null)
        setCoreError(null)
        setHyperEvmAddress(trimmedEvmValue)
        setHyperCoreAddress(trimmedCoreValue)
    }

    const handleEvmInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setEvmInputValue(value)

        if (useSameAddress) {
            setCoreInputValue(value)
        }

        if (evmError) {
            setEvmError(null)
        }

        if (value && !isAddress(value)) {
            setEvmError('Invalid EVM address format')
        }
    }

    const handleCoreInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setCoreInputValue(value)

        if (coreError) {
            setCoreError(null)
        }

        if (value && !isAddress(value)) {
            setCoreError('Invalid address format')
        }
    }

    const handleToggleSameAddress = () => {
        const newUseSameAddress = !useSameAddress
        setUseSameAddress(newUseSameAddress)

        if (newUseSameAddress) {
            setCoreInputValue(evmInputValue)
            setCoreError(null)
        }
    }

    // Check if we have valid addresses (either from query params or from URL)
    const effectiveEvmAddress = hyperEvmAddress || accountFromUrl
    const effectiveCoreAddress = hyperCoreAddress || accountFromUrl
    const isValidAddresses = effectiveEvmAddress && isAddress(effectiveEvmAddress) && effectiveCoreAddress && isAddress(effectiveCoreAddress)

    return (
        <div className="border-b pb-4">
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="sameAddress"
                        checked={useSameAddress}
                        onChange={handleToggleSameAddress}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="sameAddress" className="text-sm text-gray-700">
                        Use same address for HyperEVM and HyperCore
                    </label>
                </div>

                <div className="space-y-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">HyperEVM Address</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={evmInputValue}
                                onChange={handleEvmInputChange}
                                placeholder="Enter EVM address (0x...)"
                                className={`flex-1 rounded border px-3 py-2 font-mono text-sm ${
                                    evmError
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                } focus:outline-none focus:ring-1`}
                            />
                        </div>
                        {evmError && <p className="mt-1 text-sm text-red-500">{evmError}</p>}
                    </div>

                    {!useSameAddress && (
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">HyperCore Address</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={coreInputValue}
                                    onChange={handleCoreInputChange}
                                    placeholder="Enter Core address (0x...)"
                                    className={`flex-1 rounded border px-3 py-2 font-mono text-sm ${
                                        coreError
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                    } focus:outline-none focus:ring-1`}
                                />
                            </div>
                            {coreError && <p className="mt-1 text-sm text-red-500">{coreError}</p>}
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={!evmInputValue || !!evmError || (!useSameAddress && (!coreInputValue || !!coreError))}
                        className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                        Load Addresses
                    </button>
                    {isValidAddresses && (
                        <button
                            type="button"
                            onClick={onRefresh}
                            disabled={isFetching}
                            className="flex items-center gap-2 rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isFetching ? (
                                <>
                                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                                    Refreshing...
                                </>
                            ) : (
                                'Refresh'
                            )}
                        </button>
                    )}
                </div>
            </form>

            {isValidAddresses && (
                <div className="mt-4 space-y-2">
                    <div>
                        <h2 className="text-sm font-medium text-gray-500">HyperEVM</h2>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-lg text-gray-700">
                                {effectiveEvmAddress?.slice(0, 6)}...{effectiveEvmAddress?.slice(-4)}
                            </span>
                            <a
                                href={`https://explorer.hyperliquid.xyz/address/${effectiveEvmAddress}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-500 hover:underline"
                            >
                                Explorer ↗
                            </a>
                        </div>
                    </div>

                    {effectiveEvmAddress !== effectiveCoreAddress && (
                        <div>
                            <h2 className="text-sm font-medium text-gray-500">HyperCore</h2>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-lg text-gray-700">
                                    {effectiveCoreAddress?.slice(0, 6)}...{effectiveCoreAddress?.slice(-4)}
                                </span>
                                <a
                                    href={`https://explorer.hyperliquid.xyz/address/${effectiveCoreAddress}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-500 hover:underline"
                                >
                                    Explorer ↗
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
