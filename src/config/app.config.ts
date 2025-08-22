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
export const SITE_DOMAIN = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
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
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        price: '0',
        priceCurrency: 'USD',
        about: {
            name: 'HyperLP - Delta-Neutral Vault',
            description: 'LP fees, funding and points - all without the price swings',
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
 * DEMO ACCOUNTS
 */

export const DEMO_ACCOUNTS = [
    {
        address: '0x10B4F7e91f045363714015374D2d9Ff58Fda3186',
        name: 'Alpha',
        description: 'Demo - Delta neutral LP on Hyperswap (actively rebalanced)',
        hasLP: true,
        hasHyperDrive: false,
    },
    {
        address: '0x8466D5b78CaFc01fC1264D2D724751b70211D979',
        name: 'Bravo',
        description: 'Demo - Delta neutral LP on Hyperswap (actively rebalanced)',
        hasLP: true,
        hasHyperDrive: false,
    },
    {
        address: '0x3cEe139542222D0d15BdCB8fd519B2615662B1E3',
        name: 'Charlie',
        description: 'Demo - Delta neutral LP on Hyperswap (actively rebalanced)',
        hasLP: true,
        hasHyperDrive: false,
    },
    {
        address: '0x15bB17E4D2F7ACcca7c9610133c27e9eAB9EC815',
        name: 'Gamma',
        description: 'Demo - Delta neutral lending of HYPE on Hyperdrive',
        hasLP: false,
        hasHyperDrive: true,
    },
]
