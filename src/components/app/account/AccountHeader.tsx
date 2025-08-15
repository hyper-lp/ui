'use client'

import { useState, useEffect } from 'react'
import { useQueryState } from 'nuqs'
import { isAddress } from 'viem'
import { useParams } from 'next/navigation'
import { IconIds } from '@/enums'
import IconWrapper from '@/components/icons/IconWrapper'
import { DateWrapperAccurate } from '@/components/common/DateWrapper'

interface AccountHeaderProps {
    onRefresh: () => void
    isFetching?: boolean
    lastRefreshTime?: number | null
}

export function AccountHeader({ onRefresh, isFetching = false, lastRefreshTime }: AccountHeaderProps) {
    const params = useParams()
    const accountFromUrl = params?.account as string

    const [address, setAddress] = useQueryState('address')

    // Initialize from URL params or account from URL
    const initialAddress = address || accountFromUrl || ''

    const [inputValue, setInputValue] = useState(initialAddress)

    useEffect(() => {
        setInputValue(address || accountFromUrl || '')
    }, [address, accountFromUrl])

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
                    onRefresh()
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
                onRefresh()
            }
        }
    }

    return (
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
                    onClick={onRefresh}
                    disabled={isFetching}
                    className="rounded p-1 hover:bg-default/10 disabled:opacity-50"
                    title="Refresh all data"
                >
                    <IconWrapper id={IconIds.REFRESH} className={`size-4 text-default/50 ${isFetching ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>
    )
}
