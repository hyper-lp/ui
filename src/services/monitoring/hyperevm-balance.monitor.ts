import { prismaMonitoring } from '@/lib/prisma-monitoring'
import { getViemClient, HYPEREVM_CHAIN_ID } from '@/lib/viem'
import { encodeFunctionData, decodeFunctionResult, type Address } from 'viem'
import { MULTICALL3_ABI, MULTICALL3_ADDRESS } from '@/contracts/multicall-abi'
import type { MonitoredAccount } from '@/generated/prisma-monitoring'
import type { HyperEvmBalance } from '@/interfaces'
import { Prisma } from '@prisma/client-monitoring'

const { Decimal } = Prisma

// ERC20 ABI for balance queries
const ERC20_ABI = [
    {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
] as const

interface TokenConfig {
    address: string
    symbol: string
    decimals: number
    isNative?: boolean
}

export class HyperEvmBalanceMonitor {
    private readonly chainId = HYPEREVM_CHAIN_ID
    private tokenPriceCache = new Map<string, number>()
    private cacheTimestamp = 0
    private readonly CACHE_DURATION = 60000 // 60 seconds

    // Token configurations - Only track HYPE, USDT0, USDC
    private readonly tokens: TokenConfig[] = [
        { address: '0x0000000000000000000000000000000000000000', symbol: 'HYPE', decimals: 18, isNative: true },
        { address: '0x5555555555555555555555555555555555555555', symbol: 'WHYPE', decimals: 18 },
        { address: '0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb', symbol: 'USDT0', decimals: 6 },
        // { address: '0x02c6a2fa58cc01a18b8d9e00ea48d65e4df26c70', symbol: 'USDC', decimals: 18 },
    ]

    /**
     * Fetch HyperEVM balances for a single account
     */
    async fetchBalances(accountAddress: string): Promise<HyperEvmBalance[]> {
        try {
            const client = getViemClient(this.chainId)
            const balances: HyperEvmBalance[] = []

            if (process.env.NODE_ENV === 'development') {
                console.log(`  🔍 [HyperEVM Balance Monitor] Fetching balances for ${accountAddress.slice(0, 10)}...`)
            }

            // Get native HYPE balance
            const nativeBalance = await client.getBalance({ address: accountAddress as Address })

            // Get token prices
            await this.fetchTokenPrices()

            // Add native HYPE if balance > 0
            const hypePrice = this.tokenPriceCache.get('HYPE') || 0
            const nativeHypeAmount = Number(nativeBalance) / 10 ** 18

            if (nativeHypeAmount > 0.0001) {
                balances.push({
                    id: `${accountAddress}-hyperevm-HYPE`,
                    asset: 'HYPE',
                    symbol: 'HYPE',
                    address: '0x0000000000000000000000000000000000000000',
                    balance: nativeBalance.toString(),
                    decimals: 18,
                    valueUSD: nativeHypeAmount * hypePrice,
                })

                if (process.env.NODE_ENV === 'development') {
                    console.log(`    💰 Native HYPE: ${nativeHypeAmount.toFixed(4)} ($${(nativeHypeAmount * hypePrice).toFixed(2)})`)
                }
            }

            // Batch fetch ERC20 balances using multicall
            const erc20Tokens = this.tokens.filter((t) => !t.isNative)
            const balanceCalls = erc20Tokens.map((token) => ({
                target: token.address as Address,
                callData: encodeFunctionData({
                    abi: ERC20_ABI,
                    functionName: 'balanceOf',
                    args: [accountAddress as Address],
                }),
            }))

            const balanceResults = (await client.readContract({
                address: MULTICALL3_ADDRESS,
                abi: MULTICALL3_ABI,
                functionName: 'tryAggregate',
                args: [false, balanceCalls],
            })) as Array<{ success: boolean; returnData: `0x${string}` }>

            // Process ERC20 balances
            for (let i = 0; i < erc20Tokens.length; i++) {
                if (!balanceResults[i].success) continue

                const balance = decodeFunctionResult({
                    abi: ERC20_ABI,
                    functionName: 'balanceOf',
                    data: balanceResults[i].returnData,
                }) as bigint

                if (balance > 0n) {
                    const token = erc20Tokens[i]
                    const tokenAmount = Number(balance) / 10 ** token.decimals
                    const tokenPrice = this.tokenPriceCache.get(token.symbol) || 0

                    // Skip if balance is too small
                    if (tokenAmount > 0.0001) {
                        balances.push({
                            id: `${accountAddress}-hyperevm-${token.symbol}`,
                            asset: token.symbol,
                            symbol: token.symbol,
                            address: token.address,
                            balance: balance.toString(),
                            decimals: token.decimals,
                            valueUSD: tokenAmount * tokenPrice,
                        })

                        if (process.env.NODE_ENV === 'development') {
                            console.log(`    💰 ${token.symbol}: ${tokenAmount.toFixed(4)} ($${(tokenAmount * tokenPrice).toFixed(2)})`)
                        }
                    }
                }
            }

            if (process.env.NODE_ENV === 'development' && balances.length === 0) {
                console.log(`    ❌ No HyperEVM balances found`)
            }

            return balances
        } catch (error) {
            console.error(`Error fetching HyperEVM balances for ${accountAddress}:`, error)
            return []
        }
    }

    /**
     * Store HyperEVM balances in database
     */
    async storeBalances(account: MonitoredAccount, balances: HyperEvmBalance[]): Promise<void> {
        // First, mark all existing HyperEVM balances as zero
        await prismaMonitoring.hyperEvmBalance.updateMany({
            where: {
                accountId: account.id,
            },
            data: {
                balance: new Decimal(0),
                valueUSD: new Decimal(0),
                updatedAt: new Date(),
            },
        })

        // Upsert current balances
        for (const balance of balances) {
            await prismaMonitoring.hyperEvmBalance.upsert({
                where: {
                    accountId_asset_address: {
                        accountId: account.id,
                        asset: balance.asset,
                        address: balance.address,
                    },
                },
                create: {
                    accountId: account.id,
                    asset: balance.asset,
                    symbol: balance.symbol,
                    address: balance.address,
                    balance: new Decimal(balance.balance),
                    decimals: balance.decimals,
                    valueUSD: new Decimal(balance.valueUSD),
                },
                update: {
                    balance: new Decimal(balance.balance),
                    valueUSD: new Decimal(balance.valueUSD),
                    updatedAt: new Date(),
                },
            })
        }
    }

    /**
     * Fetch and store balances for a monitored account
     */
    async updateAccountBalances(account: MonitoredAccount): Promise<HyperEvmBalance[]> {
        const balances = await this.fetchBalances(account.address)
        if (balances.length > 0) {
            await this.storeBalances(account, balances)
        }
        return balances
    }

    /**
     * Monitor all active accounts
     */
    async monitorAllAccounts(): Promise<{
        accountsMonitored: number
        totalBalances: number
        totalValueUSD: number
        byAccount: Record<string, { balances: number; valueUSD: number }>
    }> {
        const accounts = await prismaMonitoring.monitoredAccount.findMany({
            where: { isActive: true },
        })

        const byAccount: Record<string, { balances: number; valueUSD: number }> = {}
        let totalBalances = 0
        let totalValueUSD = 0

        if (process.env.NODE_ENV === 'development') {
            console.log(`\n💎 [HyperEVM Balance Monitor] Monitoring ${accounts.length} account(s)...`)
        }

        for (const account of accounts) {
            const balances = await this.updateAccountBalances(account)
            const accountValue = balances.reduce((sum, b) => sum + b.valueUSD, 0)

            byAccount[account.address] = {
                balances: balances.length,
                valueUSD: accountValue,
            }

            totalBalances += balances.length
            totalValueUSD += accountValue

            if (process.env.NODE_ENV === 'development' && balances.length > 0) {
                console.log(`    💵 Total HyperEVM value for ${account.address.slice(0, 10)}...: $${accountValue.toFixed(2)}`)
            }
        }

        return {
            accountsMonitored: accounts.length,
            totalBalances,
            totalValueUSD,
            byAccount,
        }
    }

    /**
     * Fetch token prices from Hyperliquid API
     */
    private async fetchTokenPrices(): Promise<void> {
        // Skip if recently fetched
        if (this.tokenPriceCache.size > 0 && Date.now() - this.cacheTimestamp < this.CACHE_DURATION) {
            return
        }

        try {
            // Fetch spot prices from Hyperliquid
            const response = await fetch('https://api.hyperliquid.xyz/info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'spotMeta',
                }),
            })

            const data = await response.json()
            const tokens = data.tokens || []

            // Parse prices from API response
            for (const token of tokens) {
                const { name, markPx } = token
                if (name && markPx) {
                    const price = parseFloat(markPx)
                    this.tokenPriceCache.set(name, price)

                    // Special handling for HYPE/WHYPE
                    if (name === 'HYPE') {
                        this.tokenPriceCache.set('WHYPE', price) // WHYPE has same price as HYPE
                    }
                }
            }

            // Set stable coin prices
            this.tokenPriceCache.set('USDT0', 1)
            this.tokenPriceCache.set('USDC', 1)

            // Fallback prices if not found in API
            if (!this.tokenPriceCache.has('HYPE')) {
                this.tokenPriceCache.set('HYPE', 44.8)
                this.tokenPriceCache.set('WHYPE', 44.8)
            }

            this.cacheTimestamp = Date.now()
        } catch (error) {
            console.error('Error fetching token prices:', error)
            // Use fallback prices on error
            this.tokenPriceCache.set('HYPE', 44.8)
            this.tokenPriceCache.set('WHYPE', 44.8)
            this.tokenPriceCache.set('USDT0', 1)
            this.tokenPriceCache.set('USDC', 1)
        }
    }

    /**
     * Calculate HYPE delta exposure from HyperEVM balances
     */
    async calculateHyperEvmDelta(accountId: string): Promise<number> {
        const balances = await prismaMonitoring.hyperEvmBalance.findMany({
            where: {
                accountId,
                asset: { in: ['HYPE', 'WHYPE'] },
            },
        })

        return balances.reduce((sum, b) => sum + b.valueUSD.toNumber(), 0)
    }

    /**
     * Get or create monitored accounts from environment
     */
    async getMonitoredAccounts(): Promise<MonitoredAccount[]> {
        const accounts = await prismaMonitoring.monitoredAccount.findMany({
            where: { isActive: true },
        })

        // If no accounts in DB and env var exists, create them
        if (accounts.length === 0 && process.env.MONITORED_WALLETS) {
            const addresses = process.env.MONITORED_WALLETS.split(',').map((addr) => addr.trim())

            for (const address of addresses) {
                const account = await prismaMonitoring.monitoredAccount.upsert({
                    where: { address },
                    update: { isActive: true },
                    create: {
                        address,
                        name: `Account ${address.slice(0, 6)}...${address.slice(-4)}`,
                        isActive: true,
                    },
                })
                accounts.push(account)
            }
        }

        return accounts
    }
}

export const hyperEvmBalanceMonitor = new HyperEvmBalanceMonitor()
