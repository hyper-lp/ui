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

export default function HeaderDesktop(props: { className?: string }) {
    const { authenticated, ready } = usePrivy()

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={cn('hidden md:flex justify-between items-start w-full px-8 pb-4 pt-7', props.className)}
        >
            <motion.div
                className="flex gap-4 items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
                    <LinkWrapper href={AppUrls.HOME} className="cursor-pointer flex items-center gap-2">
                        <Image src={FileIds.APP_LOGO} alt="Logo" width={50} height={50} />
                        {/* <p className="text-2xl font-bold">{SITE_NAME}</p> */}
                        <p className="text-2xl font-light">
                            Hyper
                            <span className="italic -ml-0.5">LP</span>
                        </p>
                    </LinkWrapper>
                </motion.div>
            </motion.div>
            <motion.div
                className="flex items-start gap-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            >
                <AnimatePresence mode="wait">
                    {!ready ? (
                        <div className="h-10 w-40 skeleton-loading" />
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
                            className="flex flex-col gap-2 items-center group w-full"
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
                                    className="opacity-50 hover:opacity-100 transition-all duration-500 ease-in-out hover:underline underline-offset-1 cursor-alias"
                                >
                                    <p className="text-xs italic">Powered by Privy</p>
                                </LinkWrapper>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}>
                <ThemeSwitcher />
            </motion.div>
        </motion.header>
    )
}
