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

// Time Intervals (in milliseconds)
export const TIME_INTERVALS = {
    SECONDS_10: 10000,
    SECONDS_30: 30000,
    MINUTE_1: 60000,
    MINUTES_5: 300000,
} as const

// Refresh Intervals
export const REFRESH_INTERVALS = {
    DEV: TIME_INTERVALS.MINUTES_5, // 5 minutes for development
    PROD: TIME_INTERVALS.SECONDS_10, // 10 seconds for production
    CACHE_GC: TIME_INTERVALS.MINUTES_5, // Query cache garbage collection
    RATE_LIMIT: TIME_INTERVALS.MINUTES_5, // Rate limit window
} as const

// Cache Configuration
export const CACHE_DURATION = {
    POOL_STATE: TIME_INTERVALS.MINUTE_1, // 1 minute
    TOKEN_PRICE: TIME_INTERVALS.MINUTE_1, // 1 minute
    ACCOUNT_DATA: TIME_INTERVALS.SECONDS_30, // 30 seconds
    DEFAULT: TIME_INTERVALS.MINUTES_5, // 5 minutes
} as const

// Contract Addresses
export const MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11'

// API Configuration
export const API_TIMEOUT = TIME_INTERVALS.SECONDS_30
export const API_RETRY_COUNT = 3
export const API_RETRY_DELAY = 1000 // 1 second base delay
export const API_RETRY_MAX_DELAY = TIME_INTERVALS.SECONDS_30

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
