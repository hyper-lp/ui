import numeral from 'numeral'

export const shortenValue = (value: string, chars = 3) => {
    if (chars >= value.length) return value
    return `${value.slice(0, chars)}...${value.slice(-chars)}`
}

export const cleanOutput = (output: string | number, defaultOutput = '-'): string => {
    const strOutput = String(output).replaceAll('~', '').replaceAll(' ', '')
    if (strOutput === '0') return defaultOutput
    if (strOutput === '0%') return defaultOutput
    if (strOutput === '0$') return defaultOutput
    if (strOutput === '0k$') return defaultOutput
    if (strOutput === '0m$') return defaultOutput
    if (strOutput.includes('NaN')) return defaultOutput
    return String(output)
}

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
export const formatUSD = (amount: number | string) => {
    try {
        const isNegative = Number(amount) < 0
        if (isNegative) return 'n/a'
        const absAmount = Math.abs(Number(amount))
        if (absAmount < 1.15)
            return `${numeral(absAmount)
                .multiply(isNegative ? -1 : 1)
                .format('0,0.[0000]')}$`
        if (absAmount < 11)
            return `${numeral(absAmount)
                .multiply(isNegative ? -1 : 1)
                .format('0,0.[000]')}$`
        if (absAmount < 110)
            return `${numeral(absAmount)
                .multiply(isNegative ? -1 : 1)
                .format('0,0.[00]')}$`
        if (absAmount < 1100)
            return `${numeral(absAmount)
                .multiply(isNegative ? -1 : 1)
                .format('0,0.[0]')}$`
        if (absAmount < 11000)
            return `${numeral(absAmount)
                .divide(1000)
                .multiply(isNegative ? -1 : 1)
                .format('0,0.[0]')}k$`
        if (absAmount < 1100000)
            return `${numeral(absAmount)
                .divide(1000)
                .multiply(isNegative ? -1 : 1)
                .format('0,0')}k$`
        if (absAmount >= 1100000000)
            return `${numeral(absAmount)
                .multiply(isNegative ? -1 : 1)
                .format('0,0.[0]a')}$`
        return `${numeral(absAmount)
            .divide(1000000)
            .multiply(isNegative ? -1 : 1)
            .format('0,0')}m$`
    } catch (error) {
        console.error(error)
        return `error ${amount}`
    }
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

/**
 * Format delta value with +/- sign
 */
export function formatDelta(value: number, decimals = 1): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}`
}

/**
 * Get color class for delta value
 */
export function getDeltaColor(value: number): string {
    if (Math.abs(value) < 0.01) return 'text-default/50'
    return value >= 0 ? 'text-green-600' : 'text-red-600'
}

/**
 * Get delta status message
 */
export function getDeltaStatus(value: number): string {
    const absValue = Math.abs(value)
    if (absValue < 0.1) return 'Neutral'
    if (absValue < 1) return 'Near neutral'
    return 'Rebalance'
}
