// Account page constants
export const DELTA_THRESHOLDS = {
    NEUTRAL: 0.1,
    NEAR_NEUTRAL: 1,
} as const

export const POSITION_COLORS = {
    LONG: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        darkBg: 'dark:bg-green-900',
        darkText: 'dark:text-green-200',
    },
    SHORT: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        darkBg: 'dark:bg-red-900',
        darkText: 'dark:text-red-200',
    },
} as const

export const DELTA_STATUS = {
    NEUTRAL: '✓ Neutral',
    NEAR_NEUTRAL: '⚠ Near neutral',
    REBALANCE_NEEDED: '⚠ Rebalance needed',
} as const
