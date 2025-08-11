// Shared token constants for monitor services

export const TOKEN_ADDRESSES = {
    HYPE: {
        native: '0x0000000000000000000000000000000000000000',
        wrapped: '0x5555555555555555555555555555555555555555',
    },
    USDT0: '0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb',
} as const

export const HYPE_ADDRESSES = [TOKEN_ADDRESSES.HYPE.native, TOKEN_ADDRESSES.HYPE.wrapped]

export const CACHE_DURATIONS = {
    POOL_INFO: 5 * 60 * 1000, // 5 minutes
    TOKEN_METADATA: 60 * 60 * 1000, // 1 hour
    PRICE_DATA: 30 * 1000, // 30 seconds
} as const
