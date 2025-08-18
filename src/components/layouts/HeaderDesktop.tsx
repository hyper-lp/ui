'use client'

import { cn } from '@/utils'
import { motion, AnimatePresence } from 'framer-motion'
import LinkWrapper from '../common/LinkWrapper'
import { AppUrls, FileIds } from '@/enums'
import { WaitlistButton } from '../app/waitlist/WaitlistButton'
import { WaitlistForm } from '../app/waitlist/WaitlistForm'
import { usePrivy } from '@privy-io/react-auth'
import ThemeSwitcher from '../common/ThemeSwitcher'
import { SHOW_WAITLIST } from '@/config/app.config'
import HeaderLogo from './HeaderLogo'
import FileMapper from '../common/FileMapper'
import StyledTooltip from '../common/StyledTooltip'

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
            <div className="flex items-center gap-2">
                {[
                    {
                        id: FileIds.TEAM_MERSO,
                        taikaiUrl: 'https://taikai.network/Merso',
                        xUrl: 'https://x.com/0xMerso',
                        name: 'Merso',
                        description: 'Rust / Solidity',
                        width: 30,
                        height: 30,
                        className: 'rounded-full border border-primary/50 shadow',
                    },
                    {
                        id: FileIds.TEAM_KATALYSTER,
                        taikaiUrl: 'https://taikai.network/Katalyster',
                        xUrl: 'https://x.com/Katalyster',
                        name: 'Katalyster',
                        description: 'BD / Ops',
                        width: 30,
                        height: 30,
                        className: '-ml-2 rounded-full border border-primary/50 shadow',
                    },
                    {
                        id: FileIds.TEAM_ZARBOQ,
                        taikaiUrl: 'https://taikai.network/zarboq',
                        xUrl: 'https://x.com/zarboq',
                        name: 'Zarboq',
                        description: 'Rust / Solidity',
                        width: 30,
                        height: 30,
                        className: '-ml-2 rounded-full border border-primary/50 shadow',
                    },
                    {
                        id: FileIds.TEAM_FBERGER,
                        taikaiUrl: 'https://taikai.network/fberger-xyz',
                        xUrl: 'https://x.com/fberger_xyz',
                        name: 'fberger',
                        description: 'Fullstack dev',
                        width: 30,
                        height: 30,
                        className: '-ml-2 rounded-full border border-primary/50 shadow',
                    },
                ].map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex items-center gap-2">
                        <StyledTooltip content={item.taikaiUrl}>
                            <LinkWrapper
                                href={item.taikaiUrl}
                                target="_blank"
                                className="flex cursor-alias items-center gap-2 transition-all duration-300 hover:scale-110"
                            >
                                <FileMapper {...item} priority />
                            </LinkWrapper>
                        </StyledTooltip>
                    </div>
                ))}
            </div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}>
                <ThemeSwitcher />
            </motion.div>
        </motion.header>
    )
}
