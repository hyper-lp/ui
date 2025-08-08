import type { Address } from 'viem'
import type { DexProtocol } from '@/interfaces/dex.interface'

/**
 * V3 Contract addresses interface
 */
export interface V3ContractAddresses {
    factory: Address
    positionManager: Address
    swapRouter: Address
    swapRouter02?: Address
    quoter?: Address
    quoterV2?: Address
    tickLens?: Address
    v3Migrator?: Address
    mixedRouteQuoter?: Address
    positionModifier?: Address
    multicall?: Address
    multicall2?: Address
    nftDescriptor?: Address
    nftDescriptorLibrary?: Address
}

/**
 * Complete DEX configuration including V3 contracts
 */
export interface DexConfig {
    protocol: DexProtocol
    name: string
    // Legacy fields for backward compatibility
    factoryAddress?: Address
    positionManagerAddress?: Address
    routerAddress?: Address
    isUniswapV3Fork: boolean
    // Full V3 contract details
    contracts?: V3ContractAddresses
    audited?: boolean
    auditReports?: string[]
    subgraphUrl?: string
    docsUrl?: string
}

/**
 * Hyperswap V3 (Official Uniswap V3 fork on HyperEVM)
 * Source: https://docs.hyperswap.exchange/hyperswap/contracts/or-hyper-evm/v3
 */
const HYPERSWAP_V3_CONTRACTS: V3ContractAddresses = {
    // Core V3 Contracts
    factory: '0xB1c0fa0B789320044A6F623cFe5eBda9562602E3',
    positionManager: '0x6eDA206207c09e5428F281761DdC0D300851fBC8',
    swapRouter: '0x4E2960a8cd19B467b82d26D83fAcb0fAE26b094D',
    swapRouter02: '0x6D99e7f6747AF2cDbB5164b6DD50e40D4fDe1e77',

    // Quoters
    quoter: '0xF865716B90f09268fF12B6B620e14bEC390B8139',
    quoterV2: '0x03A918028f22D9E1473B7959C927AD7425A45C7C',
    mixedRouteQuoter: '0xEc8F3D08Dd762e935fb914bD2b2E788e5E423516',

    // Auxiliary Contracts
    tickLens: '0x8F1eA97FfDfEDA3bE7EabfED95eF49f909b2975A',
    v3Migrator: '0x820Ec81E0556f2f94f4725D358b399c11Cd78cf8',
    positionModifier: '0x19967B036bAEE9Ae0A71e9b8611Df8f1d23CCF6E',

    // Utils
    multicall: '0xE8571fd6629DA6E488f7BbD83e729c20Fa9B97B4',
    multicall2: '0xD86d0F9419FfE3c81dAa7621ec1809127e7Da315',
}

/**
 * Hybra Finance V3 Contracts
 * Audited by Peckshield
 * Source: https://docs.hyperswap.exchange/hyperswap/contracts/or-hyper-evm/v3#amm-v3
 */
const HYBRA_V3_CONTRACTS: V3ContractAddresses = {
    // Core Contracts
    factory: '0x2dC0Ec0F0db8bAF250eCccF268D7dFbF59346E5E', // CLFactory
    positionManager: '0x934C4f47B2D3FfcA0156A45DEb3A436202aF1efa', // NonfungiblePositionManager
    swapRouter: '0x7DB3D09fF3B398A771d0e2cdE8ac612941C9E801',

    // Router V2 (for compatibility)
    swapRouter02: '0x0d76Fcf33C6EDeD05696549757d136788C98CC9D', // RouterV2

    // Quoter
    quoterV2: '0x9AAa88ddd409C015F3ab3F557D3B138ec3cd66C0',

    // Additional factory for pairs: 0x9c7397c9C5ecC400992843408D3A283fE9108009
}

/**
 * Project X - Direct Uniswap V3 Fork with fee switch enabled
 * Audited by PeckShield and 0xQuit
 * Source: https://prjxdocs.notion.site/6-Tech-2291a8328ce880debb10e0d2a6b31931
 */
const PRJTX_V3_CONTRACTS: V3ContractAddresses = {
    // Core V3 Contracts
    factory: '0xFf7B3e8C00e57ea31477c32A5B52a58Eea47b072',
    positionManager: '0xeaD19AE861c29bBb2101E834922B2FEee69B9091', // NFT Position Manager
    swapRouter: '0x1EbDFC75FfE3ba3de61E7138a3E8706aC841Af9B',

    // Quoter
    quoter: '0x239F11a7A3E08f2B8110D4CA9F6B95d4c8865258',

    // NFT Descriptors
    nftDescriptor: '0x6Df4e13333f61cAe5E0547A23831d6D1dCF661C9', // NFT Position Descriptor
    nftDescriptorLibrary: '0x524D281A5C5c3b2660935d1ecC1cE2F91C73039C', // NFT Descriptor Library Module
}

/**
 * Main DEX configurations with all contract addresses
 */
export const HYPEREVM_DEXS: Record<DexProtocol, DexConfig> = {
    hyperswap: {
        protocol: 'hyperswap',
        name: 'Hyperswap V3',
        factoryAddress: HYPERSWAP_V3_CONTRACTS.factory,
        positionManagerAddress: HYPERSWAP_V3_CONTRACTS.positionManager,
        routerAddress: HYPERSWAP_V3_CONTRACTS.swapRouter02 || HYPERSWAP_V3_CONTRACTS.swapRouter,
        isUniswapV3Fork: true,
        contracts: HYPERSWAP_V3_CONTRACTS,
        audited: true,
        docsUrl: 'https://docs.hyperswap.exchange/hyperswap/contracts/or-hyper-evm/v3',
    },
    prjtx: {
        protocol: 'prjtx',
        name: 'Project X',
        factoryAddress: PRJTX_V3_CONTRACTS.factory,
        positionManagerAddress: PRJTX_V3_CONTRACTS.positionManager,
        routerAddress: PRJTX_V3_CONTRACTS.swapRouter,
        isUniswapV3Fork: true,
        contracts: PRJTX_V3_CONTRACTS,
        audited: true,
        auditReports: ['PeckShield-Audit-Report-PRJX', '0xQuit-Audit-Report-PRJX'],
        docsUrl: 'https://prjxdocs.notion.site/6-Tech-2291a8328ce880debb10e0d2a6b31931',
    },
    hybra: {
        protocol: 'hybra',
        name: 'Hybra Finance',
        factoryAddress: HYBRA_V3_CONTRACTS.factory,
        positionManagerAddress: HYBRA_V3_CONTRACTS.positionManager,
        routerAddress: HYBRA_V3_CONTRACTS.swapRouter,
        isUniswapV3Fork: true,
        contracts: HYBRA_V3_CONTRACTS,
        audited: true,
        auditReports: ['https://github.com/peckshield/publications/blob/master/audit_reports/PeckShield-Audit-Report-Hybra-v1.0.pdf'],
        docsUrl: 'https://docs.hyperswap.exchange/hyperswap/contracts/or-hyper-evm/v3#amm-v3',
    },
}

/**
 * Factory hash for CREATE2 deployments
 * Hyperswap uses this for deterministic pool addresses
 */
export const HYPERSWAP_FACTORY_HASH = '0xe3572921be1688dba92df30c6781b8770499ff274d20ae9b325f4242634774fb'

/**
 * Helper function to get DEX config by protocol name
 */
export const getDefaultDexConfig = (dex: DexProtocol): DexConfig => {
    return HYPEREVM_DEXS[dex]
}

/**
 * Helper function to get position manager address by protocol
 */
export function getPositionManagerAddress(protocol: string): Address | undefined {
    const config = HYPEREVM_DEXS[protocol as DexProtocol]
    return config?.positionManagerAddress
}

/**
 * Helper function to get all position manager addresses
 */
export function getAllPositionManagers(): { protocol: string; address: Address }[] {
    return Object.entries(HYPEREVM_DEXS)
        .map(([protocol, config]) => ({
            protocol,
            address: config.positionManagerAddress!,
        }))
        .filter((item) => item.address)
}

/**
 * Helper function to identify DEX by position manager address
 */
export function getDexByPositionManager(positionManagerAddress: string): string | undefined {
    const normalizedAddress = positionManagerAddress.toLowerCase()

    for (const [protocol, config] of Object.entries(HYPEREVM_DEXS)) {
        if (config.positionManagerAddress?.toLowerCase() === normalizedAddress) {
            return protocol
        }
    }

    return undefined
}
