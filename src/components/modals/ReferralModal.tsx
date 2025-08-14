'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrivy } from '@privy-io/react-auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { decodeReferralCode } from '@/utils/referral.util'
import { WaitlistButton } from '@/components/app/WaitlistButton'

interface ReferralModalProps {
    referralCode?: string | null
}

export default function ReferralModal({ referralCode: propReferralCode }: ReferralModalProps = {}) {
    const [isOpen, setIsOpen] = useState(false)
    const [, setReferralCode] = useState<string | null>(null)
    const [referrerHandle, setReferrerHandle] = useState<string | null>(null)
    const { authenticated } = usePrivy()
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Check for referral code in URL or props
        const urlReferralCode = searchParams.get('ref')
        const code = propReferralCode || urlReferralCode

        if (code && !authenticated) {
            setReferralCode(code)
            setReferrerHandle(code)
            setIsOpen(true)

            // Optional: Try to decode if it's a valid Twitter ID referral
            try {
                const twitterId = decodeReferralCode(code)
                if (twitterId) {
                    console.log('Valid Twitter referral ID:', twitterId)
                } else {
                    console.log('Using raw referral code:', code)
                }
            } catch (error) {
                console.log('Using raw referral code:', { error, code })
            }
        }
    }, [searchParams, authenticated, propReferralCode])

    const handleSuccess = () => {
        setIsOpen(false)
        // The WaitlistButton handles the login flow
    }

    const handleClose = () => {
        setIsOpen(false)
        // Optional: Remove ref param from URL
        const newSearchParams = new URLSearchParams(searchParams.toString())
        newSearchParams.delete('ref')
        const newUrl = newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''
        router.replace(`/${newUrl}`)
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
                        className="fixed inset-0 z-50 bg-default/20 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                        className="fixed inset-0 z-50 flex items-center justify-center px-4"
                        onClick={handleClose}
                    >
                        <div
                            className="relative w-full min-w-[300px] max-w-[400px] rounded-xl border border-default/10 bg-background/95 p-8 shadow-2xl backdrop-blur-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={handleClose}
                                className="absolute right-4 top-4 text-default/40 transition-colors hover:text-default/60"
                                aria-label="Close modal"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Content */}
                            <div className="flex flex-col items-center text-center">
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="mb-2 text-2xl font-bold text-default"
                                >
                                    Join Now
                                </motion.h2>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="w-full"
                                >
                                    <WaitlistButton className="w-full" onSuccess={handleSuccess} />
                                </motion.div>

                                {referrerHandle && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="mt-2 text-xs text-default/40"
                                    >
                                        Referred by {referrerHandle.toUpperCase()}
                                    </motion.p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
