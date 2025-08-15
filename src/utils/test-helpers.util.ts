import type { DexLPPosition } from '@/interfaces/dex.interface'
import { DexProtocol } from '@/enums'
import { NATIVE_HYPE_ADDRESS, WRAPPED_HYPE_ADDRESS, USDT0_ADDRESS } from '@/config/hyperevm-tokens.config'

/**
 * Mock HYPE/USDT0 positions for testing
 */
export const MOCK_POSITIONS: DexLPPosition[] = [
    {
        id: 'test-hyperswap-hype-usdt-1',
        dex: DexProtocol.HYPERSWAP,
        poolAddress: '0x56aBfaf40F5B7464e9cC8cFF1af13863D6914508',
        tokenId: '1',
        positionManagerAddress: '0x6eDA206207c09e5428F281761DdC0D300851fBC8',
    },
    {
        id: 'test-prjtx-hype-usdc-1',
        dex: DexProtocol.PRJTX,
        poolAddress: '0x161fB7d6c764f81DAE581E8a4981772750416727',
        tokenId: '2',
        positionManagerAddress: '0xeaD19AE861c29bBb2101E834922B2FEee69B9091',
    },
    {
        id: 'test-hybra-usdc-usdt-1',
        dex: DexProtocol.HYBRA,
        poolAddress: '0x3603ffEbB994CC110b4186040CaC3005B2cf4465',
        tokenId: '3',
        positionManagerAddress: '0x934C4f47B2D3FfcA0156A45DEb3A436202aF1efa',
    },
]

/**
 * Test wallet addresses
 */
export const TEST_WALLETS = {
    PRIMARY: '0xB0Aa56926bE166Bcc5FB6Cf1169f56d9Fd7A25d7',
    SECONDARY: '0x1234567890123456789012345678901234567890',
}

/**
 * Token addresses on HyperEVM
 */
export const TOKEN_ADDRESSES = {
    HYPE_NATIVE: NATIVE_HYPE_ADDRESS,
    HYPE_WRAPPED: WRAPPED_HYPE_ADDRESS,
    USDT0: USDT0_ADDRESS,
}

/**
 * Common fee tiers
 */
export const FEE_TIERS = {
    LOWEST: { fee: 100, label: '0.01%' },
    LOW: { fee: 500, label: '0.05%' },
    MEDIUM: { fee: 3000, label: '0.30%' },
    HIGH: { fee: 10000, label: '1.00%' },
}

/**
 * Format console output with colors
 */
export const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
}

/**
 * Print section header
 */
export function printSectionHeader(title: string, emoji = '📊') {
    console.log(`\n${colors.cyan}${emoji} ${title}${colors.reset}`)
    console.log('='.repeat(50))
}

/**
 * Print success message
 */
export function printSuccess(message: string) {
    console.log(`${colors.green}✅ ${message}${colors.reset}`)
}

/**
 * Print error message
 */
export function printError(message: string) {
    console.log(`${colors.red}❌ ${message}${colors.reset}`)
}

/**
 * Print warning message
 */
export function printWarning(message: string) {
    console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`)
}

/**
 * Print info message
 */
export function printInfo(message: string) {
    console.log(`${colors.cyan}ℹ️  ${message}${colors.reset}`)
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals = 2): string {
    return `${value.toFixed(decimals)}%`
}

/**
 * Format address (short)
 */
export function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Check if quiet mode is enabled
 */
export function isQuietMode(): boolean {
    return process.argv.includes('--quiet') || process.argv.includes('-q')
}

/**
 * Check if verbose mode is enabled
 */
export function isVerboseMode(): boolean {
    return process.argv.includes('--verbose') || process.argv.includes('-v')
}

/**
 * Parse wallet address from command line
 */
export function parseWalletFromArgs(): string | undefined {
    const walletIndex = process.argv.findIndex((arg) => arg.startsWith('0x') && arg.length === 42)
    return walletIndex >= 0 ? process.argv[walletIndex] : undefined
}

/**
 * Parse command flag
 */
export function hasFlag(flag: string): boolean {
    return process.argv.includes(flag)
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Batch array into chunks
 */
export function chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size))
    }
    return chunks
}

/**
 * Calculate time to 2x based on APR
 */
export function calculateTimeTo2x(apr: number): string {
    if (apr <= 0) return 'Never'
    const daysTo2x = (100 / apr) * 365
    if (daysTo2x > 365) {
        return `${(daysTo2x / 365).toFixed(1)} years`
    } else if (daysTo2x > 30) {
        return `${(daysTo2x / 30).toFixed(1)} months`
    } else {
        return `${daysTo2x.toFixed(0)} days`
    }
}

/**
 * Print pool summary
 */
export function printPoolSummary(pools: { dex: string; fee: number; liquidity: bigint }[]) {
    const byDex: Record<string, number> = {}

    for (const pool of pools) {
        byDex[pool.dex] = (byDex[pool.dex] || 0) + 1
    }

    console.log('\n📊 Pool Summary:')
    for (const [dex, count] of Object.entries(byDex)) {
        console.log(`  ${dex}: ${count} pools`)
    }
    console.log(`  Total: ${pools.length} pools`)
}

/**
 * Print position summary
 */
export function printPositionSummary(positions: DexLPPosition[]) {
    const byDex: Record<string, number> = {}

    for (const position of positions) {
        byDex[position.dex] = (byDex[position.dex] || 0) + 1
    }

    console.log('\n📍 Position Summary:')
    for (const [dex, count] of Object.entries(byDex)) {
        console.log(`  ${dex}: ${count} positions`)
    }
    console.log(`  Total: ${positions.length} positions`)
}
