/**
 * Number formatting utilities
 */

/**
 * Format number with commas and decimal places
 */
export function formatNumber(value: number, decimals = 2): string {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value)
}

/**
 * Format value as USD currency
 */
export function formatUSD(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)
}

/**
 * Format value as percentage
 */
export function formatPercentage(value: number, decimals = 2): string {
    return `${formatNumber(value, decimals)}%`
}

/**
 * Convert wei/smallest unit to token amount
 */
export function formatTokenAmount(amount: bigint | string | number, decimals: number): number {
    const amountBigInt = typeof amount === 'bigint' ? amount : BigInt(amount)
    return Number(amountBigInt) / Math.pow(10, decimals)
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatCompactNumber(value: number): string {
    const formatter = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 2,
    })
    return formatter.format(value)
}

/**
 * Format token amount with symbol
 */
export function formatTokenWithSymbol(amount: number, symbol: string, decimals = 4): string {
    return `${formatNumber(amount, decimals)} ${symbol}`
}

/**
 * Format APR/APY as percentage
 */
export function formatAPR(value: number): string {
    if (value === 0) return '0%'
    if (value < 0.01) return '<0.01%'
    return formatPercentage(value, value < 1 ? 2 : 0)
}
