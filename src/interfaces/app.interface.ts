import { AppSupportedChainIds, AppUrls } from '../enums'

export interface InterfaceAppLink {
    name: string
    path: AppUrls
}

export interface StructuredOutput<Data> {
    success: boolean
    data?: Data
    error: string
}

export interface ChainConfig {
    id: AppSupportedChainIds
    name: string
    oneInchId: string
    supported: boolean
    explorerRoot: string
    nativeToken?: {
        symbol: string
        decimals: number
    }
    debankId: string // https://docs.cloud.debank.com/en/readme/api-pro-reference/chain
    chainlinkFeeds?: Record<string, string> // Price feed addresses for this chain
}

export interface TokenConfig {
    address: string
    decimals: number
    symbol: string
}
