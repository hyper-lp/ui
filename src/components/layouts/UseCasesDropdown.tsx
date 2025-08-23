'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppUrls, FileIds, IconIds } from '@/enums'
import IconWrapper from '../icons/IconWrapper'
import { cn } from '@/utils'
import LinkWrapper from '../common/LinkWrapper'
import { DEMO_ACCOUNTS, SITE_DOMAIN } from '@/config'
import FileMapper from '../common/FileMapper'

interface UseCase {
    title: string
    description: string
    banner: FileIds
    url: string
}

export default function UseCasesDropdown() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Hardcoded use cases - you can modify these as needed
    const useCases: UseCase[] = [
        {
            title: 'Delta-neutral LP on HyperSwap',
            description: 'Earn LP fees + short funding',
            banner: FileIds.BANNER_HYPERSWAP,
            url: `${SITE_DOMAIN}/${AppUrls.ACCOUNT}/${DEMO_ACCOUNTS[0].address}`,
        },
        {
            title: 'Delta-neutral LP on Project X',
            description: 'Earn LP fees + short funding',
            banner: FileIds.BANNER_PROJETX,
            url: `${SITE_DOMAIN}/${AppUrls.ACCOUNT}/${DEMO_ACCOUNTS[2].address}`,
        },
        {
            title: 'Delta-neutral Lending on HyperDrive',
            description: 'Earn interests + short funding',
            banner: FileIds.BANNER_HYPERDRIVE,
            url: `${SITE_DOMAIN}/${AppUrls.ACCOUNT}/${DEMO_ACCOUNTS[3].address}`,
        },
    ]

    const handleMouseEnter = () => {
        // Clear any existing timeout when entering
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current)
            closeTimeoutRef.current = null
        }
        setIsDropdownOpen(true)
    }

    const handleMouseLeave = () => {
        // Add a 300ms delay before closing
        closeTimeoutRef.current = setTimeout(() => {
            setIsDropdownOpen(false) // Keep commented for debug
        }, 200)
    }

    return (
        <div className="relative z-50" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <button
                className={cn(
                    'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors hover:bg-default/10',
                    isDropdownOpen && 'bg-default/10',
                )}
            >
                <span className="cursor-help text-lg">Explore use cases</span>
                <motion.div animate={{ rotate: isDropdownOpen ? 180 : 0 }} transition={{ duration: 0.15, ease: 'easeInOut' }}>
                    <IconWrapper id={IconIds.CHEVRON_DOWN} className="size-4" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isDropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 top-full z-[100] mt-2 w-[400px] overflow-hidden rounded-xl border border-default/10 bg-background/95 shadow-xl"
                        style={{
                            zIndex: 100,
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                        }}
                    >
                        <div className="flex flex-col gap-2 overflow-hidden rounded-xl p-2">
                            {useCases.map((useCase) => (
                                <LinkWrapper key={useCase.title} href={useCase.url} target="_blank">
                                    <div
                                        className="group relative h-40 w-full overflow-hidden rounded-xl py-1 transition-all hover:shadow-md"
                                        style={{
                                            backgroundImage: `url(${useCase.banner})`,
                                            backgroundSize: 'cover',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'center',
                                        }}
                                    >
                                        {/* Overlay with forced GPU acceleration */}
                                        <div
                                            className="absolute inset-0 overflow-hidden rounded-xl bg-gradient-to-b from-background/50 to-background/40 dark:from-background/20 dark:to-background/30"
                                            style={{
                                                backdropFilter: 'blur(1px) saturate(200%)',
                                                WebkitBackdropFilter: 'blur(1px) saturate(200%)',
                                                transform: 'translateZ(0)',
                                                willChange: 'transform',
                                            }}
                                        />
                                        <div className="relative z-10 flex h-full w-full flex-col items-start gap-1 p-3">
                                            <div className="flex items-center gap-2 rounded bg-background/90 pl-1.5 pr-1 backdrop-blur-sm">
                                                <h3 className="text-xl font-medium text-primary drop-shadow-sm transition-colors">{useCase.title}</h3>
                                                <FileMapper
                                                    id={
                                                        useCase.banner === FileIds.BANNER_HYPERSWAP
                                                            ? FileIds.DEX_HYPERSWAP
                                                            : useCase.banner === FileIds.BANNER_PROJETX
                                                              ? FileIds.DEX_PROJETX
                                                              : FileIds.LENDING_HYPERDRIVE
                                                    }
                                                    className="size-4 rounded"
                                                />
                                            </div>
                                            <p className={cn('mt-0.5 rounded bg-background/90 px-1.5 text-base drop-shadow-sm backdrop-blur-sm')}>
                                                {useCase.description}
                                            </p>
                                        </div>
                                        <div className="absolute bottom-3 right-3 rounded-lg bg-background p-1.5 transition-transform duration-200 group-hover:scale-110">
                                            <IconWrapper id={IconIds.ARROW_UP_RIGHT} className="size-5 rounded-lg text-primary" />
                                        </div>
                                    </div>
                                </LinkWrapper>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
