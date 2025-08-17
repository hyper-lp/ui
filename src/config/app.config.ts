import { AppUrls } from '@/enums'
import { env } from '@/env/t3-env'
import { InterfaceAppLink } from '@/interfaces'

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
