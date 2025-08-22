import { type Address, formatEther } from 'viem'
import { AccountLensABI } from '@/contracts/account-lens-abi'
import { ACCOUNT_LENS_ADDRESS } from '@/config/constants.config'
import { getViemClient } from '@/lib/viem'

/**
 * HyperEVM RPC service for interacting with the blockchain
 */
class HyperEvmRpcService {
    private rpcUrl: string

    constructor() {
        // HyperEVM RPC endpoint
        this.rpcUrl = process.env.HYPEREVM_RPC_URL || 'https://api.hyperliquid.xyz/evm'
    }

    /**
     * Get the current nonce for an address on HyperEVM
     * @param address - The wallet address
     * @returns The current nonce
     */
    async getNonce(address: string): Promise<number> {
        try {
            const response = await fetch(this.rpcUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'eth_getTransactionCount',
                    params: [address, 'latest'],
                    id: 1,
                }),
            })

            if (!response.ok) {
                console.error(`RPC request failed: ${response.status}`)
                return 0
            }

            const data = await response.json()

            if (data.error) {
                console.error('RPC error:', data.error)
                return 0
            }

            // Convert hex nonce to number
            return parseInt(data.result, 16)
        } catch (error) {
            console.error('Failed to fetch nonce:', error)
            return 0
        }
    }

    /**
     * Get the current block number on HyperEVM
     * @returns The current block number
     */
    async getBlockNumber(): Promise<number> {
        try {
            const response = await fetch(this.rpcUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'eth_blockNumber',
                    params: [],
                    id: 1,
                }),
            })

            if (!response.ok) {
                console.error(`RPC request failed: ${response.status}`)
                return 0
            }

            const data = await response.json()

            if (data.error) {
                console.error('RPC error:', data.error)
                return 0
            }

            // Convert hex block number to number
            return parseInt(data.result, 16)
        } catch (error) {
            console.error('Failed to fetch block number:', error)
            return 0
        }
    }

    /**
     * Get HyperDrive market positions from AccountLens
     * NOTE: Currently not used as we check share token balances directly
     * @param account - User address
     * @param marketIds - Array of market IDs to query
     * @returns Formatted market positions data
     */
    async getAccountLensData(account: string, marketIds: bigint[] = [0n, 1n]) {
        try {
            const client = getViemClient()

            const result = await client.readContract({
                address: ACCOUNT_LENS_ADDRESS as Address,
                abi: AccountLensABI,
                functionName: 'getMarketsQuery',
                args: [account as Address, marketIds],
            })

            // Log raw result in development
            if (process.env.NODE_ENV === 'development') {
                console.log('[HyperDrive] AccountLens raw result:', {
                    account: result.account,
                    marketsCount: result.markets?.length || 0,
                    markets: result.markets?.map((m: unknown) => {
                        const market = m as { marketId?: bigint; shares?: bigint; assets?: bigint }
                        return {
                            marketId: market.marketId?.toString(),
                            shares: market.shares?.toString(),
                            assets: market.assets?.toString(),
                        }
                    }),
                })
            }

            // Transform the raw data into a more usable format
            type MarketData = {
                marketId: bigint
                shares: bigint
                assets: bigint
                liabilities: bigint
                borrowLimit: bigint
                liquidationLimit: bigint
                healthScore: number
                totalValue: bigint
                collateral: readonly {
                    token: Address
                    symbol: string
                    decimals: number
                    price: bigint
                    supplied: bigint
                    totalValue: bigint
                    maxLTV: bigint
                    liquidationLTV: bigint
                }[]
            }

            return {
                account: result.account,
                markets: (result.markets as readonly MarketData[]).map((market) => ({
                    marketId: market.marketId,
                    shares: Number(formatEther(market.shares)),
                    assets: Number(formatEther(market.assets)), // Underlying amount
                    liabilities: Number(formatEther(market.liabilities)),
                    borrowLimit: Number(formatEther(market.borrowLimit)),
                    liquidationLimit: Number(formatEther(market.liquidationLimit)),
                    healthScore: market.healthScore,
                    totalValue: Number(formatEther(market.totalValue)),
                    collateral: market.collateral.map((col) => ({
                        token: col.token,
                        symbol: col.symbol,
                        decimals: col.decimals,
                        price: Number(formatEther(col.price)),
                        supplied: Number(formatEther(col.supplied)),
                        totalValue: Number(formatEther(col.totalValue)),
                        maxLTV: Number(col.maxLTV) / 100, // Convert basis points to percentage
                        liquidationLTV: Number(col.liquidationLTV) / 100,
                    })),
                })),
            }
        } catch (error) {
            // Log more details about the error
            if (process.env.NODE_ENV === 'development') {
                console.log('[HyperDrive] AccountLens call failed')
                console.log('- Contract:', ACCOUNT_LENS_ADDRESS)
                console.log('- Account:', account)
                console.log('- Market IDs:', marketIds)
                console.log(
                    '- Market IDs as array:',
                    marketIds.map((id) => id.toString()),
                )

                // Check if it's a revert error
                const errorObj = error as { shortMessage?: string }
                if (errorObj?.shortMessage?.includes('reverted')) {
                    console.log('- Contract reverted, markets might not be initialized yet')
                } else {
                    console.log('- Error:', errorObj?.shortMessage || error)
                }
            }
            return { account, markets: [] }
        }
    }
}

export const hyperEvmRpcService = new HyperEvmRpcService()
