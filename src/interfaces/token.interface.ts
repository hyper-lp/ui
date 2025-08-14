import type { Address } from 'viem'

export interface TokenConfig {
    name: string
    address: Address
    symbol: string
    decimals: number
    chainId: number
    logoURI: string
    tags: string[]
}
