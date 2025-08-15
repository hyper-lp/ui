'use client'

import { cn } from '@/utils'
import { motion, AnimatePresence } from 'framer-motion'
import LinkWrapper from '../common/LinkWrapper'
import { AppUrls } from '@/enums'
import { FileIds } from '@/enums/files.enum'
import { WaitlistButton } from '../app/waitlist/WaitlistButton'
import { WaitlistForm } from '../app/waitlist/WaitlistForm'
import { usePrivy } from '@privy-io/react-auth'
import ThemeSwitcher from '../common/ThemeSwitcher'
import { SHOW_WAITLIST } from '@/config/app.config'
import { ImageWrapper } from '../common/ImageWrapper'

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
                        <span className="relative inline-block">
                            {/* Lightning effect */}
                            <span
                                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 block h-[40px] w-[40px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-hl-light/70 via-hl-light/30 to-transparent opacity-20 blur-[8px] transition-colors dark:from-hl-dark/70 dark:via-hl-dark/30 dark:to-transparent"
                                aria-hidden="true"
                            />
                            <ImageWrapper src={FileIds.APP_LOGO} alt="Logo" width={70} height={70} />
                        </span>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-light">
                                    Hyper
                                    <span className="-ml-0.5 italic">LP</span>
                                </p>
                                <p className="text-xs text-default/40">Alpha</p>
                            </div>
                            <ImageWrapper src={FileIds.POWERED_BY_HYPERLIQUID_HL300} alt="Logo" width={140} height={16} className="rounded-none" />
                        </div>
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
