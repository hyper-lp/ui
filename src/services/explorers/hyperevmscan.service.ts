import type { ExplorerTransaction, HyperEVMScanResponse, TransactionFilter, ExplorerConfig } from '@/interfaces'
import { API_TIMEOUT } from '@/config/app.config'

/**
 * HyperEVMScan API client service
 * Interfaces with hyperevmscan.io API to fetch blockchain data
 */
export class HyperEVMScanService {
    private baseUrl: string
    private apiKey?: string
    private timeout: number

    constructor(config?: Partial<ExplorerConfig>) {
        this.baseUrl = config?.apiUrl || 'https://api.hyperevmscan.io/api'
        this.apiKey = config?.apiKey
        this.timeout = config?.timeout || API_TIMEOUT
    }

    /**
     * Fetch transactions for a specific address
     * Uses the standard Etherscan API format
     */
    async getTransactions(filter: TransactionFilter): Promise<ExplorerTransaction[]> {
        try {
            const params = new URLSearchParams({
                module: 'account',
                action: 'txlist',
                address: filter.address,
                startblock: (filter.startBlock || 0).toString(),
                endblock: (filter.endBlock || 99999999).toString(),
                page: '1', // Page number for pagination
                offset: (filter.limit || 1000).toString(), // Number of transactions per page
                sort: 'desc',
            })

            if (this.apiKey) params.append('apikey', this.apiKey)

            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), this.timeout)

            const url = `${this.baseUrl}?${params}`

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
                signal: controller.signal,
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                throw new Error(`HyperEVMScan API error: ${response.status} ${response.statusText}`)
            }

            const data: HyperEVMScanResponse = await response.json()

            // Check for specific error messages
            if (data.status === '0') {
                if (data.message === 'No transactions found') {
                    return []
                }
                if (data.message === 'NOTOK' && typeof data.result === 'string') {
                    console.error(`HyperEVMScan API Error: ${data.result}`)
                    // Could be invalid API key or rate limit
                    return []
                }
                console.warn(`HyperEVMScan API warning: ${data.message}`)
                return []
            }

            // Handle case where no transactions are found
            if (data.message === 'No transactions found' || !data.result) {
                return []
            }

            // Ensure result is an array
            if (typeof data.result === 'string') {
                return []
            }

            return data.result
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new Error('Request timeout while fetching transactions')
                }
                throw error
            }
            throw new Error('Unknown error while fetching transactions')
        }
    }

    /**
     * Fetch internal transactions for a specific address
     * Uses the standard Etherscan API format
     */
    async getInternalTransactions(filter: TransactionFilter): Promise<ExplorerTransaction[]> {
        try {
            const params = new URLSearchParams({
                module: 'account',
                action: 'txlistinternal',
                address: filter.address,
                startblock: (filter.startBlock || 0).toString(),
                endblock: (filter.endBlock || 99999999).toString(),
                page: '1',
                offset: (filter.limit || 1000).toString(),
                sort: 'desc',
            })

            if (this.apiKey) params.append('apikey', this.apiKey)

            const response = await fetch(`${this.baseUrl}?${params}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`HyperEVMScan API error: ${response.status} ${response.statusText}`)
            }

            const data: HyperEVMScanResponse = await response.json()

            if (data.status === '0' && data.message !== 'No transactions found') {
                console.warn(`HyperEVMScan API warning: ${data.message}`)
                // Return empty array instead of throwing error
                return []
            }

            if (data.message === 'No transactions found' || !data.result || typeof data.result === 'string') {
                return []
            }

            return data.result
        } catch (error) {
            console.error('Error fetching internal transactions:', error)
            return []
        }
    }

    /**
     * Fetch ERC20 token transfers for a specific address
     * Uses the standard Etherscan API format
     */
    async getTokenTransfers(filter: TransactionFilter): Promise<ExplorerTransaction[]> {
        try {
            const params = new URLSearchParams({
                module: 'account',
                action: 'tokentx',
                address: filter.address,
                startblock: (filter.startBlock || 0).toString(),
                endblock: (filter.endBlock || 99999999).toString(),
                page: '1',
                offset: (filter.limit || 1000).toString(),
                sort: 'desc',
            })

            if (this.apiKey) params.append('apikey', this.apiKey)

            const response = await fetch(`${this.baseUrl}?${params}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`HyperEVMScan API error: ${response.status} ${response.statusText}`)
            }

            const data: HyperEVMScanResponse = await response.json()

            if (data.status === '0' && data.message !== 'No transactions found') {
                console.warn(`HyperEVMScan API warning: ${data.message}`)
                // Return empty array instead of throwing error
                return []
            }

            if (data.message === 'No transactions found' || !data.result || typeof data.result === 'string') {
                return []
            }

            return data.result
        } catch (error) {
            console.error('Error fetching token transfers:', error)
            return []
        }
    }

    /**
     * Get transaction by hash
     */
    async getTransactionByHash(txHash: string): Promise<ExplorerTransaction | null> {
        try {
            const params = new URLSearchParams({
                module: 'proxy',
                action: 'eth_getTransactionByHash',
                txhash: txHash,
            })

            if (this.apiKey) params.append('apikey', this.apiKey)

            const response = await fetch(`${this.baseUrl}?${params}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`HyperEVMScan API error: ${response.status} ${response.statusText}`)
            }

            const data = await response.json()
            return data.result || null
        } catch (error) {
            console.error('Error fetching transaction by hash:', error)
            return null
        }
    }
}

// Class is already exported above, no need for additional export
// API key should be passed from the server-side environment when instantiating
