'use client'

import { cn } from '@/utils'
import { motion, AnimatePresence } from 'framer-motion'
import LinkWrapper from '../common/LinkWrapper'
import { AppUrls } from '@/enums'
import { FileIds } from '@/enums/files.enum'
import Image from 'next/image'
import { WaitlistButton } from '../app/WaitlistButton'
import { WaitlistForm } from '../app/WaitlistForm'
import { usePrivy } from '@privy-io/react-auth'
import ThemeSwitcher from '../common/ThemeSwitcher'
import { SHOW_WAITLIST } from '@/config/app.config'

export default function HeaderDesktop(props: { className?: string }) {
    const { authenticated, ready } = usePrivy()

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={cn('hidden w-full items-start justify-between px-6 pb-4 pt-6 md:flex', props.className)}
        >
            <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            >
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
                    <LinkWrapper href={AppUrls.HOME} className="flex cursor-pointer items-center gap-2">
                        <Image src={FileIds.APP_LOGO} alt="Logo" width={60} height={60} priority />
                        <p className="text-2xl font-light">
                            Hyper
                            <span className="-ml-0.5 italic">LP</span>
                        </p>
                    </LinkWrapper>
                </motion.div>
            </motion.div>
            {SHOW_WAITLIST && (
                <motion.div
                    className="flex items-start gap-2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                >
                    <AnimatePresence mode="wait">
                        {!ready ? (
                            <div className="skeleton-loading h-10 w-40" />
                        ) : authenticated ? (
                            <motion.div
                                key="waitlist-form"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <WaitlistForm />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="waitlist-button"
                                className="group flex w-full flex-col items-center gap-1"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <WaitlistButton />
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                                    <LinkWrapper
                                        href={AppUrls.PRIVY}
                                        target="_blank"
                                        className="cursor-alias underline-offset-1 opacity-50 transition-all duration-500 ease-in-out hover:underline hover:opacity-100"
                                    >
                                        <p className="text-xs italic">Powered by Privy</p>
                                    </LinkWrapper>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}>
                <ThemeSwitcher />
            </motion.div>
        </motion.header>
    )
}
