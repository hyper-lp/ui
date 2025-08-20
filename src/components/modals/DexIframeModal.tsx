'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import IframeWrapper from '@/components/common/IframeWrapper'
import type { LPPosition } from '@/interfaces'

interface DexIframeModalProps {
    isOpen: boolean
    onClose: () => void
    position: LPPosition | null
    dexUrl?: string
}

export default function DexIframeModal({ isOpen, onClose, position, dexUrl }: DexIframeModalProps) {
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

    if (!position) return null

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
                            className="relative flex max-h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-default/10 bg-background shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            {/* <div className="flex items-center justify-between border-b border-default/10 px-6 py-4">
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-lg font-semibold">
                                        {position.dex} Position
                                    </h2>
                                    <div className="flex items-center gap-4 text-sm text-default/60">
                                        <span>ID: {shortenValue(position.id)}</span>
                                        <span>•</span>
                                        <span>Value: {formatUSD(position.valueUSD)}</span>
                                        <span>•</span>
                                        <span>NFT #{position.tokenId}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="rounded-lg p-2 text-default/50 transition-colors hover:bg-default/10 hover:text-default"
                                    aria-label="Close modal"
                                >
                                    <IconWrapper id={IconIds.X} className="size-5" />
                                </button>
                            </div> */}

                            {/* Content */}
                            <div className="flex flex-1 items-center justify-center overflow-auto p-2">
                                {dexUrl ? (
                                    <IframeWrapper src={dexUrl} width="w-full" height="h-[70vh]" />
                                ) : (
                                    <p className="text-default/50">No portfolio URL available for this DEX</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
