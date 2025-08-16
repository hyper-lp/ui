import { AppUrls } from '@/enums'
import { env } from '@/env/t3-env'
import { InterfaceAppLink } from '@/interfaces'
import { AppFontFamilies } from '@/enums/app.enum'
import localFont from 'next/font/local'
import { Lato } from 'next/font/google'

// Re-export from constants for backward compatibility
export {
    DEFAULT_TRANSACTION_LIMIT,
    DELTA_THRESHOLDS,
    CACHE_DURATION,
    REFRESH_INTERVALS,
    TIME_INTERVALS,
    MULTICALL3_ADDRESS,
    API_TIMEOUT,
    API_RETRY_MAX_DELAY,
} from './constants.config'

/**
 * meta
 * https://github.com/propeller-heads/tycho-x/blob/main/TAP-5.md
 */

export const SITE_NAME = 'HyperLP'
export const IS_DEV = process.env.NODE_ENV === 'development'
export const SITE_DOMAIN = env.NEXT_PUBLIC_APP_URL
export const SITE_URL = SITE_DOMAIN.replace('www.', '')
export const APP_METADATA = {
    SITE_NAME,
    SHORT_NAME: 'HyperLP',
    SITE_DOMAIN,
    SITE_DESCRIPTION: 'LP fees, funding and points - all without the price swings',
    SITE_URL: SITE_URL,
    AUTHOR: {
        name: 'HyperLP',
        twitter: '@hyperlp',
        url: 'https://twitter.com/hyperlp',
    },
    STRUCTURED_DATA: {
        applicationCategory: 'WebApplication',
        operatingSystem: 'Any',
        price: '0',
        priceCurrency: 'USD',
        about: {
            name: 'Web Application',
            description: 'A modern web application built with Next.js',
        },
    },
}
export const SHOW_WAITLIST = false

/**
 * pages
 */

export const APP_PAGES: InterfaceAppLink[] = [
    {
        name: 'Home',
        path: AppUrls.HOME,
    },
] as const

/**
 * fonts
 */

// export const INTER_FONT = Inter({
//     weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
//     subsets: ['latin'],
//     variable: '--font-inter',
//     display: 'swap',
//     preload: true,
// })

// export const INTER_TIGHT_FONT = Inter_Tight({
//     weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
//     subsets: ['latin'],
//     variable: '--font-inter-tight',
// })

export const LATO_FONT = Lato({ weight: ['100', '300', '400', '700', '900'], subsets: ['latin'] })
export const TEODOR_LIGHT_FONT = localFont({
    src: [
        {
            path: '../../public/fonts/Teodor-Light.woff2',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../../public/fonts/Teodor-Light.woff',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../../public/fonts/Teodor-Light.ttf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../../public/fonts/Teodor-LightItalic.woff2',
            weight: '300',
            style: 'italic',
        },
        {
            path: '../../public/fonts/Teodor-LightItalic.woff',
            weight: '300',
            style: 'italic',
        },
        {
            path: '../../public/fonts/Teodor-LightItalic.ttf',
            weight: '300',
            style: 'italic',
        },
    ],
    variable: '--font-teodor-light',
    display: 'swap',
    preload: true,
})
export const PVP_TRADE_FONT = localFont({
    src: [
        {
            path: '../../public/fonts/Pvp-Trade.ttf',
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--font-pvp-trade',
    display: 'swap',
    preload: true,
})

export const APP_FONT_FAMILIES: Record<AppFontFamilies, string> = {
    [AppFontFamilies.TEODOR_LIGHT]: TEODOR_LIGHT_FONT.variable,
    [AppFontFamilies.LATO]: LATO_FONT.className,
    [AppFontFamilies.PVP_TRADE]: PVP_TRADE_FONT.className,
}

// Constants moved to constants.config.ts
