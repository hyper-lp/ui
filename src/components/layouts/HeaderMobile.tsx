'use client'

import { APP_PAGES, SHOW_WAITLIST } from '@/config/app.config'
import { useAppStore } from '@/stores/app.store'
import { cn } from '@/utils'
import { useRef, useEffect } from 'react'
import { useKeyboardShortcut } from '@/hooks/helpers/useKeyboardShortcutArgs'
import Image from 'next/image'
import { AppUrls, IconIds, FileIds } from '@/enums'
import IconWrapper from '../icons/IconWrapper'
import LinkWrapper from '../common/LinkWrapper'
import { AnimatePresence, motion } from 'framer-motion'
import { WaitlistButton } from '../app/waitlist/WaitlistButton'
import { WaitlistForm } from '../app/waitlist/WaitlistForm'
import { usePrivy } from '@privy-io/react-auth'
import ThemeSwitcher from '../common/ThemeSwitcher'

export default function HeaderMobile() {
    const { showMobileMenu, setShowMobileMenu } = useAppStore()
    const { authenticated, ready } = usePrivy()

    // menu
    const menuDropdown = useRef<HTMLButtonElement>(null)
    useKeyboardShortcut({ key: 'Escape', onKeyPressed: () => setShowMobileMenu(false) })

    // Lock body scroll when menu is open
    useEffect(() => {
        if (showMobileMenu) {
            const scrollY = window.scrollY
            document.body.style.position = 'fixed'
            document.body.style.top = `-${scrollY}px`
            document.body.style.width = '100%'

            return () => {
                document.body.style.position = ''
                document.body.style.top = ''
                document.body.style.width = ''
                window.scrollTo(0, scrollY)
            }
        }
    }, [showMobileMenu])

    return (
        <header className="z-50 flex w-full justify-center">
            <div className="flex w-full justify-between px-5 py-4 md:hidden">
                {/* left */}
                <div className="z-30 flex grow items-center gap-4">
                    {/* logo */}
                    <LinkWrapper href={AppUrls.HOME} className="flex cursor-pointer items-center gap-2">
                        <Image src={FileIds.APP_LOGO} alt="Logo" width={40} height={40} priority />
                        {/* <p className="text-2xl font-bold">{SITE_NAME}</p> */}
                        <p className="text-2xl font-light">
                            Hyper
                            <span className="-ml-0.5 italic">LP</span>
                        </p>
                    </LinkWrapper>
                </div>

                {/* right */}
                <div className={cn('flex gap-2', showMobileMenu ? 'z-40' : 'z-30')}>
                    {/* menu */}
                    <button
                        ref={menuDropdown}
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="flex h-9 items-center gap-1 rounded-xl px-2.5 transition-colors duration-300"
                    >
                        <IconWrapper id={showMobileMenu ? IconIds.CLOSE : IconIds.MENU} className="size-8" />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showMobileMenu && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed inset-0 z-20 flex h-[calc(100vh-0px)] w-full items-center justify-center bg-background/40 px-4 backdrop-blur-xl md:hidden"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setShowMobileMenu(false)
                            }
                        }}
                    >
                        <motion.nav
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
                            className="absolute inset-2 z-30 flex h-fit flex-col items-center justify-center gap-4 pt-28"
                        >
                            {/* Waitlist Button/Form at the top */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="mb-4"
                            >
                                <LinkWrapper href={AppUrls.TAIKAI} className="flex items-center gap-1" target="_blank">
                                    <p className="cursor-alias truncate text-lg hover:text-primary hover:underline">
                                        Hyperliquid Community Hackathon
                                    </p>
                                    <IconWrapper id={IconIds.ARROW_UP_RIGHT} className="size-4" />
                                </LinkWrapper>
                            </motion.div>
                            {SHOW_WAITLIST && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 * (APP_PAGES.length + 1) }}
                                    className="mt-10"
                                >
                                    {!ready ? (
                                        <div className="skeleton-loading h-10 w-40" />
                                    ) : authenticated ? (
                                        <WaitlistForm />
                                    ) : (
                                        <div className="flex flex-col items-center gap-1">
                                            <WaitlistButton />
                                            <LinkWrapper href={AppUrls.PRIVY}>
                                                <p className="text-xs italic">Powered by Privy</p>
                                            </LinkWrapper>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 * (APP_PAGES.length + 1) }}
                                className="my-10"
                            >
                                <ThemeSwitcher iconClassName="size-10" buttonClassName="p-4 py-3 rounded-2xl" containerClassName="gap-4" />
                            </motion.div>
                        </motion.nav>

                        {/* Footer info - at bottom */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 * (APP_PAGES.length + 2) }}
                            className="absolute bottom-32 max-w-[300px] text-center"
                        >
                            {/* <Authors /> */}
                            <LinkWrapper href={AppUrls.CONTACT_US} className="cursor-alias underline-offset-2 hover:text-primary hover:underline">
                                Contact
                            </LinkWrapper>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
