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
import { WaitlistButton } from '../app/WaitlistButton'
import { WaitlistForm } from '../app/WaitlistForm'
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
        <header className="flex justify-center z-50 w-full">
            <div className="w-full md:hidden flex justify-between px-5 py-4 ">
                {/* left */}
                <div className="flex gap-4 items-center z-30 grow">
                    {/* logo */}
                    <LinkWrapper href={AppUrls.HOME} className="cursor-pointer flex items-center gap-2">
                        <Image src={FileIds.APP_LOGO} alt="Logo" width={40} height={40} priority />
                        {/* <p className="text-2xl font-bold">{SITE_NAME}</p> */}
                        <p className="text-2xl font-light">
                            Hyper
                            <span className="italic -ml-0.5">LP</span>
                        </p>
                    </LinkWrapper>
                </div>

                {/* right */}
                <div className={cn('flex gap-2', showMobileMenu ? 'z-40' : 'z-30')}>
                    {/* menu */}
                    <button
                        ref={menuDropdown}
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="flex items-center gap-1 transition-colors duration-300 rounded-xl h-9 px-2.5"
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
                        className="fixed md:hidden z-20 inset-0 flex w-full items-center justify-center px-4 backdrop-blur-xl bg-background/40 h-[calc(100vh-0px)]"
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
                            className="absolute inset-2 z-30 flex items-center justify-center h-fit flex-col gap-4 pt-28"
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
                                    <p className="text-lg truncate hover:underline hover:text-primary cursor-alias">
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
                                        <div className="h-10 w-40 skeleton-loading" />
                                    ) : authenticated ? (
                                        <WaitlistForm />
                                    ) : (
                                        <div className="flex flex-col gap-1 items-center">
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
                            className="absolute bottom-32 text-center max-w-[300px]"
                        >
                            {/* <Authors /> */}
                            <LinkWrapper href={AppUrls.CONTACT_US} className="underline-offset-2 cursor-alias hover:underline hover:text-primary">
                                Contact
                            </LinkWrapper>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
