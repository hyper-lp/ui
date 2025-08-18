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
}

export const hyperEvmRpcService = new HyperEvmRpcService()