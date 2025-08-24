'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/stores/app.store'
import { formatUSD, formatNumber, shortenValue } from '@/utils/format.util'
import FileMapper from '@/components/common/FileMapper'
import { getProtocolByName } from '@/config'
import type { ProtocolType } from '@/config/hyperevm-protocols.config'
import { FileIds } from '@/enums'
import StyledTooltip from '@/components/common/StyledTooltip'
import LinkWrapper from '@/components/common/LinkWrapper'
import { RebalanceRowTemplate } from '@/components/app/account/tables/RebalanceRowTemplate'
import type { RebalanceTransaction } from '@/interfaces/rebalance.interface'
import { DateWrapperAccurate } from '@/components/common/DateWrapper'

interface RebalanceModalProps {
    isOpen: boolean
    onClose: () => void
    vaultAddress?: string
}

export default function RebalanceModal({ isOpen, onClose, vaultAddress }: RebalanceModalProps) {
    // Get rebalance events from the store
    const rebalanceEvents = useAppStore((state) => state.rebalanceEvents)

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEsc)
        }

        return () => {
            document.removeEventListener('keydown', handleEsc)
        }
    }, [isOpen, onClose])

    // Filter events for the current vault address if provided
    const filteredEvents = vaultAddress
        ? rebalanceEvents.filter((event) => event.vaultAddress.toLowerCase() === vaultAddress.toLowerCase())
        : rebalanceEvents

    // Sort by timestamp descending (most recent first)
    const sortedEvents = [...filteredEvents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const formatRange = (range: [number, number]) => {
        if (!range || range.length !== 2) return '-'
        return `${formatNumber(range[0], 2)}-${formatNumber(range[1], 2)}`
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 bg-default/40 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={onClose}
                    >
                        <div
                            className="relative flex max-h-[70vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-default/10 bg-background shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-default/10 px-6 py-4">
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-lg font-semibold">Rebalancing History</h2>
                                    <div className="flex items-center gap-1 text-sm text-default/60">
                                        <span>{sortedEvents.length} rebalances</span>
                                        {vaultAddress && <span>for vault {vaultAddress}</span>}
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="rounded-lg p-2 text-default/50 transition-colors hover:bg-default/10 hover:text-default"
                                    aria-label="Close modal"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex flex-1 overflow-auto">
                                {sortedEvents.length === 0 ? (
                                    <div className="flex flex-1 items-center justify-center p-8">
                                        <div className="text-center">
                                            <p className="text-lg text-default/50">No rebalance transactions found</p>
                                            <p className="mt-2 text-sm text-default/30">
                                                Rebalance events will appear here once the vault performs its first rebalance
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full overflow-x-auto">
                                        <div className="min-w-max">
                                            {/* Header */}
                                            <RebalanceRowTemplate
                                                time={<span className="text-xs text-default/60">Time</span>}
                                                dex={<span className="text-xs text-default/60">DEX</span>}
                                                pair={<span className="text-xs text-default/60">Pair</span>}
                                                summary={<span className="text-xs text-default/60">Summary</span>}
                                                transactions={<span className="text-xs text-default/60">Transactions</span>}
                                                raw={<span className="text-xs text-default/60">Raw</span>}
                                                className="sticky top-0 z-10 h-10 border-b border-default/10 bg-default/5 backdrop-blur"
                                            />
                                            {/* Body */}
                                            <div className="divide-y divide-default/10">
                                                {sortedEvents.map((event) => {
                                                    const dexProtocol = getProtocolByName(event.metadata?.dexName as ProtocolType)
                                                    const token0Symbol = event.metadata?.token0Symbol || 'Token0'
                                                    const token1Symbol = event.metadata?.token1Symbol || 'Token1'
                                                    const isHypeToken0 = token0Symbol === 'HYPE' || token0Symbol === 'WHYPE'

                                                    return (
                                                        <RebalanceRowTemplate
                                                            key={event.id}
                                                            time={
                                                                <p className="text-sm">
                                                                    <DateWrapperAccurate date={event.timestamp} />
                                                                </p>
                                                            }
                                                            dex={
                                                                <div className="flex items-center gap-2">
                                                                    {dexProtocol?.fileId && (
                                                                        <FileMapper
                                                                            id={dexProtocol.fileId}
                                                                            width={20}
                                                                            height={20}
                                                                            className="rounded"
                                                                        />
                                                                    )}
                                                                    {/* <span className="text-xs text-default/60">
                                                                        {event.metadata?.dexName || 'Unknown'}
                                                                    </span> */}
                                                                </div>
                                                            }
                                                            pair={
                                                                <div className="flex flex-col gap-1">
                                                                    <div className="flex items-center gap-1">
                                                                        <FileMapper
                                                                            id={isHypeToken0 ? FileIds.TOKEN_HYPE : FileIds.TOKEN_USDT0}
                                                                            width={16}
                                                                            height={16}
                                                                            className="rounded-full"
                                                                        />
                                                                        <span className="text-sm font-medium">{token0Symbol}</span>
                                                                        <span className="text-default/40">/</span>
                                                                        <FileMapper
                                                                            id={!isHypeToken0 ? FileIds.TOKEN_HYPE : FileIds.TOKEN_USDT0}
                                                                            width={16}
                                                                            height={16}
                                                                            className="rounded-full"
                                                                        />
                                                                        <span className="text-sm font-medium">{token1Symbol}</span>
                                                                    </div>
                                                                    <div className="text-xs text-default/60">
                                                                        At price:{' '}
                                                                        {event.metadata?.currentPrice ? formatUSD(event.metadata.currentPrice) : '-'}
                                                                    </div>
                                                                </div>
                                                            }
                                                            summary={
                                                                <div className="flex flex-col gap-1">
                                                                    <div className="text-sm font-medium">
                                                                        {event.metadata?.summary.split(' ').slice(2).join(' ') ||
                                                                            `${formatRange(event.metadata?.fromRange)} → ${formatRange(event.metadata?.toRange)}`}
                                                                    </div>
                                                                    <div className="text-xs text-default/60">
                                                                        {event.metadata?.reason || 'Manual rebalance'}
                                                                    </div>
                                                                </div>
                                                            }
                                                            transactions={
                                                                <div className="flex flex-col truncate">
                                                                    {event.metadata?.txs?.map((tx: RebalanceTransaction, idx: number) => (
                                                                        <div key={idx} className="flex flex-wrap items-start gap-1">
                                                                            <p className="text-xs text-default/60">
                                                                                {/* {getActionName(tx.action_name)} */}
                                                                                {idx + 1}. {tx.action_name}{' '}
                                                                                {tx.swap_method ? (
                                                                                    tx.swap_method.toLowerCase().includes('liquidlabs') ? (
                                                                                        <LinkWrapper href="https://liqd.ag/" target="_blank">
                                                                                            <FileMapper
                                                                                                id={FileIds.SWAP_LIQUIDSWAP}
                                                                                                width={100}
                                                                                                height={26}
                                                                                                className="rounded"
                                                                                            />
                                                                                        </LinkWrapper>
                                                                                    ) : (
                                                                                        `> ${tx.swap_method}`
                                                                                    )
                                                                                ) : (
                                                                                    ''
                                                                                )}
                                                                            </p>
                                                                            {tx.hash && tx.hash !== 'SKIPPED' && (
                                                                                <LinkWrapper
                                                                                    href={`https://hyperevmscan.io/tx/${tx.hash.replace('0x0x', '0x')}`}
                                                                                    target="_blank"
                                                                                >
                                                                                    <StyledTooltip
                                                                                        content={`https://hyperevmscan.io/tx/${tx.hash.replace('0x0x', '0x')}`}
                                                                                    >
                                                                                        <p className="text-xs text-primary hover:underline">
                                                                                            {shortenValue(tx.hash.replace('0x0x', '0x'))}
                                                                                        </p>
                                                                                    </StyledTooltip>
                                                                                </LinkWrapper>
                                                                            )}
                                                                            {tx.hash === 'SKIPPED' && (
                                                                                <p className="text-xs text-default/30">skipped</p>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            }
                                                            raw={
                                                                <StyledTooltip
                                                                    content={
                                                                        <div className="max-h-[400px] max-w-[600px] overflow-auto">
                                                                            <pre className="text-foreground text-xs">
                                                                                {JSON.stringify(event.metadata, null, 2)}
                                                                            </pre>
                                                                        </div>
                                                                    }
                                                                >
                                                                    <button className="text-xs text-default hover:text-primary">Raw data</button>
                                                                </StyledTooltip>
                                                            }
                                                            className="py-3 transition-colors hover:bg-default/5"
                                                        />
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
