import { TokenConfig } from '@/interfaces'
import type { Address } from 'viem'

// Native token address
export const NATIVE_HYPE_ADDRESS = '0x0000000000000000000000000000000000000000'
export const HYPEREVM_TOKENS: TokenConfig[] = [
    {
        name: 'Hype',
        decimals: 18,
        symbol: 'HYPE',
        address: NATIVE_HYPE_ADDRESS as Address,
        chainId: 999,
        logoURI: 'https://assets.coingecko.com/coins/images/50882/standard/hyperliquid.jpg?1729431300',
        tags: ['native', 'tokenv1'],
    },
    {
        name: 'Wrapped Hype',
        decimals: 18,
        symbol: 'WHYPE',
        address: '0x5555555555555555555555555555555555555555',
        chainId: 999,
        logoURI: 'https://assets.coingecko.com/coins/images/50882/standard/hyperliquid.jpg?1729431300',
        tags: ['tokenv1'],
    },
    {
        address: '0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb',
        name: 'USDT0',
        symbol: 'USD₮0',
        decimals: 6,
        chainId: 999,
        logoURI: 'https://raw.githubusercontent.com/HyperSwap-Labs/hyperswap-token-list/refs/heads/main/assets/USDT0.png',
        tags: ['tokenv1'],
    },
]

// Helper functions
export function getTokenBySymbol(symbol: string): TokenConfig | undefined {
    return HYPEREVM_TOKENS.find((token) => token.symbol.toLowerCase() === symbol.toLowerCase())
}

export function getTokenByAddress(address: string): TokenConfig | undefined {
    const normalizedAddress = address.toLowerCase()
    return HYPEREVM_TOKENS.find((token) => token.address.toLowerCase() === normalizedAddress)
}

export function getTokenDecimals(address: string): number {
    const token = getTokenByAddress(address)
    return token?.decimals ?? 18 // Default to 18 if not found
}
