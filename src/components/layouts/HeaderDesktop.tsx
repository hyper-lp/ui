'use client'

import { cn } from '@/utils'
import { motion, AnimatePresence } from 'framer-motion'
import LinkWrapper from '../common/LinkWrapper'
import { AppUrls } from '@/enums'
import { WaitlistButton } from '../app/waitlist/WaitlistButton'
import { WaitlistForm } from '../app/waitlist/WaitlistForm'
import { usePrivy } from '@privy-io/react-auth'
import ThemeSwitcher from '../common/ThemeSwitcher'
import { SHOW_WAITLIST } from '@/config/app.config'
import HeaderLogo from './HeaderLogo'

export default function HeaderDesktop(props: { className?: string }) {
    const { authenticated, ready } = usePrivy()

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={cn('hidden w-full items-start justify-between px-6 pb-4 pt-6 md:flex', props.className)}
        >
            <HeaderLogo />
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
