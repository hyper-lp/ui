import { createPublicClient, http, type PublicClient, defineChain, fallback } from 'viem'

// HyperEVM public RPC endpoints with fallbacks
const HYPEREVM_RPC_URLS = [
    'https://api.hyperliquid.xyz/evm', // Primary official RPC
    'https://hyperliquid.drpc.org', // DRPC fallback
    'https://rpc.hyperliquid.xyz/evm', // Alternative official RPC
    'https://rpc.hyperlend.finance', // HyperLend RPC fallback
]

export const hyperEvm = defineChain({
    id: 998,
    name: 'HyperEVM',
    nativeCurrency: {
        decimals: 18,
        name: 'HYPE',
        symbol: 'HYPE',
    },
    rpcUrls: {
        default: {
            http: HYPEREVM_RPC_URLS,
        },
    },
    blockExplorers: {
        default: {
            name: 'HyperEVM Explorer',
            url: 'https://explorer.hyperliquid.xyz',
        },
    },
})

let client: PublicClient | null = null

export function getViemClient(chainId: number = 998): PublicClient {
    if (chainId !== 998) {
        throw new Error(`Only HyperEVM (chain ID 998) is supported`)
    }

    if (!client) {
        // Use fallback transport to automatically try multiple RPCs
        const transports = HYPEREVM_RPC_URLS.map((url) =>
            http(url, {
                batch: true,
                retryCount: 2,
                retryDelay: 1000,
                timeout: 10000,
                onFetchRequest: (request) => {
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`🌐 RPC Request to ${url}:`, request.method)
                    }
                },
                onFetchResponse: (response) => {
                    if (!response.ok && process.env.NODE_ENV === 'development') {
                        console.error(`❌ RPC Error from ${url}:`, response.status, response.statusText)
                    }
                },
            }),
        )

        client = createPublicClient({
            chain: hyperEvm,
            transport: fallback(transports, {
                retryCount: 1,
                rank: {
                    interval: 60_000, // Re-rank RPCs every minute
                    sampleCount: 5, // Sample 5 requests for ranking
                    timeout: 2_000, // 2 second timeout for ranking
                    weights: {
                        latency: 0.3, // 30% weight on latency
                        stability: 0.7, // 70% weight on stability
                    },
                },
            }),
        })

        // Log which RPC is being used
        if (process.env.NODE_ENV === 'development') {
            console.log('🔗 Initialized Viem client with RPC fallbacks:', HYPEREVM_RPC_URLS)
        }
    }

    return client
}

/**
 * Health check for RPC endpoints
 */
export async function checkRpcHealth(): Promise<{
    healthy: boolean
    latencies: Record<string, number | null>
    errors: Record<string, string>
}> {
    const results: Record<string, number | null> = {}
    const errors: Record<string, string> = {}

    for (const url of HYPEREVM_RPC_URLS) {
        const startTime = Date.now()
        try {
            const testClient = createPublicClient({
                chain: hyperEvm,
                transport: http(url, { timeout: 5000 }),
            })

            // Try to get the latest block number as a health check
            await testClient.getBlockNumber()

            results[url] = Date.now() - startTime
        } catch (error) {
            results[url] = null
            errors[url] = error instanceof Error ? error.message : 'Unknown error'
        }
    }

    const healthy = Object.values(results).some((latency) => latency !== null)

    if (process.env.NODE_ENV === 'development') {
        console.log('🏥 RPC Health Check Results:')
        for (const [url, latency] of Object.entries(results)) {
            if (latency !== null) {
                console.log(`  ✅ ${url}: ${latency}ms`)
            } else {
                console.log(`  ❌ ${url}: ${errors[url]}`)
            }
        }
    }

    return { healthy, latencies: results, errors }
}
