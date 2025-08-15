/**
 * Application constants and default values
 */

// Transaction Configuration
export const DEFAULT_TRANSACTION_LIMIT = 10
export const TRANSACTION_PAGE_SIZE = 50

// Price Defaults
export const DEFAULT_HYPE_PRICE = 30

// Delta Thresholds
export const DELTA_THRESHOLDS = {
    NEUTRAL: 0.01,
    NEAR_NEUTRAL: 0.5,
    SLIGHTLY_EXPOSED: 2,
    EXPOSED: 5,
} as const

// Cache Configuration
export const CACHE_DURATION = {
    POOL_STATE: 60000, // 60 seconds
    TOKEN_PRICE: 60000, // 60 seconds
    ACCOUNT_DATA: 30000, // 30 seconds
    DEFAULT: 300000, // 5 minutes
} as const

// Refresh Intervals
export const REFRESH_INTERVALS = {
    DEV: 300000, // 5 minutes
    PROD: 30000, // 30 seconds
    ACCOUNT: 60000, // 1 minute
} as const

// Contract Addresses
export const MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11'

// API Configuration
export const API_TIMEOUT = 30000 // 30 seconds
export const API_RETRY_COUNT = 3
export const API_RETRY_DELAY = 1000 // 1 second

// Display Configuration
export const MAX_DECIMAL_PLACES = {
    USD: 2,
    TOKEN: 6,
    PERCENTAGE: 2,
    DELTA: 4,
} as const

// Token Lists
export const HYPE_TOKENS = ['HYPE', 'WHYPE'] as const
export const STABLE_TOKENS = ['USDT0', 'USD₮0', 'USDC'] as const

// Platform Names
export const PLATFORM_NAMES = {
    HYPER_EVM: 'HyperEVM',
    HYPER_CORE: 'HyperCore',
} as const
