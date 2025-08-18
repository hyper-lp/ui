'use client'

import LinkWrapper from '../common/LinkWrapper'
import { AppUrls } from '@/enums'
import { FileIds } from '@/enums/files.enum'
import { ImageWrapper } from '../common/ImageWrapper'
import { useTheme } from 'next-themes'

export default function HeaderLogo() {
    const { resolvedTheme } = useTheme()
    const isDark = resolvedTheme === 'dark'

    return (
        <div>
            <LinkWrapper href={AppUrls.HOME} className="flex cursor-pointer items-center gap-1">
                <span className="relative inline-block">
                    {/* Lightning effect */}
                    {isDark && (
                        <span
                            className="via-bg-white pointer-events-none absolute left-1/2 top-2/3 -z-10 block h-[50px] w-[50px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-hl-light-green/10 to-hl-light-green/30 opacity-20 blur-[8px] transition-colors"
                            aria-hidden="true"
                        />
                    )}
                    <ImageWrapper src={FileIds.APP_LOGO} alt="Logo" width={60} height={60} />
                </span>
                <div className="group flex h-min flex-col">
                    <div className="flex items-baseline gap-2">
                        <p className="border-b-2 border-transparent text-2xl font-light transition-colors ease-in-out group-hover:border-hl-dark-green dark:group-hover:border-hl-light-green">
                            Hyper
                            <span className="-ml-0.5 italic text-hl-dark-green">LP</span>
                        </p>
                        <p className="text-xs text-default/40">Alpha</p>
                    </div>
                    <ImageWrapper
                        src={isDark ? FileIds.POWERED_BY_HYPERLIQUID_WHITE : FileIds.POWERED_BY_HYPERLIQUID_HL800}
                        alt="Logo"
                        width={140}
                        height={16}
                        className="rounded-none"
                    />
                </div>
            </LinkWrapper>
        </div>
    )
}
