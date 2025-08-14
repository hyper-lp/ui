import { prismaMonitoring } from '@/lib/prisma-monitoring'
import type { MonitoredAccount, SpotBalance as DbSpotBalance } from '@/generated/prisma-monitoring'
import type { SpotBalance } from '@/interfaces'
import { Prisma } from '@prisma/client-monitoring'

const { Decimal } = Prisma

// HyperCore API types
interface HyperCoreSpotBalance {
    coin: string
    total: string
    hold: string
}

interface HyperCoreSpotState {
    balances: HyperCoreSpotBalance[]
}

export class HyperCoreSpotMonitor {
    private readonly hyperCoreUrl = 'https://api.hyperliquid.xyz'
    private tokenPriceCache = new Map<string, number>()
    private cacheTimestamp = 0
    private readonly CACHE_DURATION = 60000 // 60 seconds

    /**
     * Fetch spot balances from HyperCore for an account
     */
    async fetchSpotBalances(accountAddress: string): Promise<SpotBalance[]> {
        try {
            if (process.env.NODE_ENV === 'development') {
                console.log(`  🔍 [HyperCore Spot Monitor] Fetching spot balances for ${accountAddress.slice(0, 10)}...`)
            }

            const response = await fetch(`${this.hyperCoreUrl}/info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'spotClearinghouseState',
                    user: accountAddress,
                }),
            })

            const data: HyperCoreSpotState = await response.json()
            const balances = data.balances || []

            // Get token prices
            await this.fetchTokenPrices()

            const spotBalances: SpotBalance[] = balances
                .filter((b) => parseFloat(b.total) > 0)
                .filter((b) => ['HYPE', 'USDT0', 'USDC'].includes(b.coin)) // Only track HYPE, USDT0, USDC
                .map((balance) => {
                    const { coin, total } = balance
                    const totalBalance = parseFloat(total)

                    // Get price from cache or use defaults for stables
                    let price = this.tokenPriceCache.get(coin) || 0
                    if (coin === 'USDC' || coin === 'USDT0') {
                        price = 1
                    }

                    return {
                        id: `${accountAddress}-spot-${coin}`,
                        asset: coin,
                        balance: totalBalance,
                        valueUSD: totalBalance * price,
                    }
                })
                .filter((b) => b.balance > 0.0001) // Filter out dust

            if (process.env.NODE_ENV === 'development') {
                if (spotBalances.length > 0) {
                    console.log(`    ✅ Found ${spotBalances.length} spot balance(s)`)
                    spotBalances.forEach((b) => {
                        console.log(`    💰 ${b.asset}: ${b.balance} ($${b.valueUSD.toFixed(2)})`)
                    })
                } else {
                    console.log(`    ❌ No spot balances found`)
                }
            }

            return spotBalances
        } catch (error) {
            console.error(`Error fetching HyperCore spot balances for ${accountAddress}:`, error)
            return []
        }
    }

    /**
     * Store spot balances in database
     */
    async storeSpotBalances(account: MonitoredAccount, balances: SpotBalance[]): Promise<DbSpotBalance[]> {
        const storedBalances: DbSpotBalance[] = []

        // First, mark all existing spot balances as zero
        await prismaMonitoring.spotBalance.updateMany({
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
            // Map asset to enum value (use OTHER for unknown assets)
            const assetEnum = ['HYPE', 'USDT0', 'USDC'].includes(balance.asset) ? (balance.asset as 'HYPE' | 'USDT0' | 'USDC') : 'OTHER'

            const spotBalance = await prismaMonitoring.spotBalance.upsert({
                where: {
                    accountId_asset: {
                        accountId: account.id,
                        asset: assetEnum,
                    },
                },
                create: {
                    accountId: account.id,
                    asset: assetEnum,
                    balance: new Decimal(balance.balance),
                    valueUSD: new Decimal(balance.valueUSD),
                },
                update: {
                    balance: new Decimal(balance.balance),
                    valueUSD: new Decimal(balance.valueUSD),
                    updatedAt: new Date(),
                },
            })
            storedBalances.push(spotBalance)
        }

        return storedBalances
    }

    /**
     * Fetch and store spot balances for a monitored account
     */
    async updateAccountBalances(account: MonitoredAccount): Promise<SpotBalance[]> {
        const balances = await this.fetchSpotBalances(account.address)
        if (balances.length > 0) {
            await this.storeSpotBalances(account, balances)
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
            console.log(`\n🏦 [HyperCore Spot Monitor] Monitoring ${accounts.length} account(s)...`)
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
                console.log(`    💵 Total spot value for ${account.address.slice(0, 10)}...: $${accountValue.toFixed(2)}`)
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
            // Fetch spot prices
            const response = await fetch(`${this.hyperCoreUrl}/info`, {
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
                }
            }

            // Also fetch perp prices for assets not in spot
            const perpResponse = await fetch(`${this.hyperCoreUrl}/info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'allMids',
                }),
            })

            const perpData = await perpResponse.json()
            if (perpData) {
                for (const [coin, price] of Object.entries(perpData)) {
                    if (!this.tokenPriceCache.has(coin)) {
                        this.tokenPriceCache.set(coin, parseFloat(price as string))
                    }
                }
            }

            // Set stable coin prices
            this.tokenPriceCache.set('USDT0', 1)
            this.tokenPriceCache.set('USDC', 1)

            // Fallback prices if not found
            if (!this.tokenPriceCache.has('HYPE')) {
                this.tokenPriceCache.set('HYPE', 44.8)
            }

            this.cacheTimestamp = Date.now()
        } catch (error) {
            console.error('Error fetching token prices:', error)
            // Use fallback prices on error
            this.tokenPriceCache.set('HYPE', 44.8)
            this.tokenPriceCache.set('USDT0', 1)
            this.tokenPriceCache.set('USDC', 1)
        }
    }

    /**
     * Calculate HYPE delta exposure from spot balances
     */
    async calculateSpotDelta(accountId: string): Promise<number> {
        const balances = await prismaMonitoring.spotBalance.findMany({
            where: {
                accountId,
                asset: 'HYPE',
            },
        })

        return balances.reduce((sum, b) => sum + b.valueUSD.toNumber(), 0)
    }

    /**
     * Get total spot value for an account
     */
    async getTotalSpotValue(accountId: string): Promise<number> {
        const balances = await prismaMonitoring.spotBalance.findMany({
            where: { accountId },
        })

        return balances.reduce((sum, b) => sum + b.valueUSD.toNumber(), 0)
    }

    /**
     * Check if account has sufficient USDC for margin
     */
    async checkMarginAvailability(
        accountId: string,
        requiredMargin: number,
    ): Promise<{
        hasEnough: boolean
        availableUsdc: number
        shortfall: number
    }> {
        const usdcBalance = await prismaMonitoring.spotBalance.findFirst({
            where: {
                accountId,
                asset: 'USDC',
            },
        })

        const availableUsdc = usdcBalance?.balance.toNumber() || 0
        const hasEnough = availableUsdc >= requiredMargin
        const shortfall = hasEnough ? 0 : requiredMargin - availableUsdc

        return {
            hasEnough,
            availableUsdc,
            shortfall,
        }
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

export const hyperCoreSpotMonitor = new HyperCoreSpotMonitor()
