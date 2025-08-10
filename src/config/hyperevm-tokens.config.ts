import type { Address } from 'viem'

export interface TokenConfig {
    address: Address
    symbol: string
    decimals: number
}

export const HYPEREVM_TOKENS: TokenConfig[] = [
    {
        address: '0x0000000000000000000000000000000000000000',
        symbol: 'HYPE',
        decimals: 18,
    },
    {
        address: '0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb',
        symbol: 'USDT0',
        decimals: 18,
    },
    {
        address: '0x02c6a2fa58cc01a18b8d9e00ea48d65e4df26c70',
        symbol: 'USDC',
        decimals: 18,
    },
]
