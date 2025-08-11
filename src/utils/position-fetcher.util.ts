import { encodeFunctionData, decodeFunctionResult, type Address } from 'viem'
import { getViemClient, HYPEREVM_CHAIN_ID } from '@/lib/viem'
import { getAllPositionManagers, getDexByPositionManager, HYPEREVM_DEXS } from '@/config/hyperevm-dexs.config'
import { NONFUNGIBLE_POSITION_MANAGER_ABI, UNISWAP_V3_POOL_ABI, UNISWAP_V3_FACTORY_ABI } from '@/contracts/uniswap-v3-abis'
import { MULTICALL3_ABI, MULTICALL3_ADDRESS } from '@/contracts/multicall-abi'
import { calculateTokenAmounts } from '@/utils/uniswap-v3.util'
import { keccak256, encodePacked, getAddress } from 'viem'
import type { PoolState, LPPosition, SpotBalance, PerpPosition, HyperEvmBalance } from '@/interfaces'

export class PositionFetcher {
    private poolStateCache = new Map<string, PoolState>()
    private tokenPriceCache = new Map<string, number>()
    private cacheTimestamp = 0
    private readonly CACHE_DURATION = 60000 // 60 seconds

    // Token addresses - Updated to correct addresses
    private readonly HYPE_ADDRESSES = [
        '0x0000000000000000000000000000000000000000', // Native HYPE
        '0x5555555555555555555555555555555555555555', // WHYPE (Wrapped HYPE)
        '0x6871ee4e36ba76eb3990d4c33eec77cf308ec0ef', // Alternative WHYPE
        '0x20584eb8e2125c4cf568db5baf1646283b8eff02', // Alternative HYPE
    ]
    private readonly USDT0_ADDRESS = '0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb' // Correct USDT0 address

    // Token decimals
    private readonly TOKEN_DECIMALS: Record<string, number> = {
        HYPE: 18,
        WHYPE: 18,
        USDT0: 6, // USDT0 has 6 decimals
        USDC: 6,
    }

    /**
     * Fetch all positions for an account (LP, Spot, Perp, HyperEVM)
     */
    async fetchAllPositions(account: string) {
        // Clear cache if expired
        if (Date.now() - this.cacheTimestamp > this.CACHE_DURATION) {
            this.poolStateCache.clear()
            this.tokenPriceCache.clear()
            this.cacheTimestamp = Date.now()
        }

        // Fetch all data types in parallel
        const [lpData, spotData, perpData, hyperEvmData] = await Promise.all([
            this.fetchLPPositionsBatched(account),
            this.fetchSpotBalances(account),
            this.fetchPerpPositions(account),
            this.fetchHyperEvmBalances(account),
        ])

        return { lpData, spotData, perpData, hyperEvmData }
    }

    /**
     * Fetch LP positions using multicall batching
     */
    private async fetchLPPositionsBatched(account: string): Promise<LPPosition[]> {
        console.log('[PositionFetcher] Starting LP position fetch for account:', account)
        const client = getViemClient(HYPEREVM_CHAIN_ID)
        const positionManagers = getAllPositionManagers()
        console.log(
            '[PositionFetcher] Found',
            positionManagers.length,
            'position managers:',
            positionManagers.map((pm) => pm.protocol),
        )

        // Step 1: Batch all balanceOf calls
        const balanceCalls = positionManagers.map((pm) => ({
            target: pm.address as Address,
            callData: encodeFunctionData({
                abi: NONFUNGIBLE_POSITION_MANAGER_ABI,
                functionName: 'balanceOf',
                args: [account as Address],
            }),
        }))

        console.log('[PositionFetcher] Making', balanceCalls.length, 'balance calls via multicall')
        const balanceResults = (await client.readContract({
            address: MULTICALL3_ADDRESS,
            abi: MULTICALL3_ABI,
            functionName: 'tryAggregate',
            args: [false, balanceCalls],
        })) as Array<{ success: boolean; returnData: `0x${string}` }>
        console.log('[PositionFetcher] Balance results:', balanceResults.length, 'responses')

        // Step 2: Build tokenId fetch calls for positions with balance > 0
        const tokenIdCalls: Array<{
            pmAddress: string
            protocol: string
            index: number
            call: { target: Address; callData: `0x${string}` }
        }> = []

        for (let i = 0; i < positionManagers.length; i++) {
            if (!balanceResults[i].success) {
                console.log('[PositionFetcher] Balance call failed for', positionManagers[i].protocol)
                continue
            }

            const balance = decodeFunctionResult({
                abi: NONFUNGIBLE_POSITION_MANAGER_ABI,
                functionName: 'balanceOf',
                data: balanceResults[i].returnData,
            }) as bigint

            console.log('[PositionFetcher]', positionManagers[i].protocol, 'balance:', balance.toString())

            if (balance > 0n) {
                for (let j = 0; j < Number(balance); j++) {
                    tokenIdCalls.push({
                        pmAddress: positionManagers[i].address,
                        protocol: positionManagers[i].protocol,
                        index: j,
                        call: {
                            target: positionManagers[i].address as Address,
                            callData: encodeFunctionData({
                                abi: NONFUNGIBLE_POSITION_MANAGER_ABI,
                                functionName: 'tokenOfOwnerByIndex',
                                args: [account as Address, BigInt(j)],
                            }),
                        },
                    })
                }
            }
        }

        console.log('[PositionFetcher] Found', tokenIdCalls.length, 'positions to fetch')
        if (tokenIdCalls.length === 0) return []

        // Step 3: Batch fetch all tokenIds
        const tokenIdResults = (await client.readContract({
            address: MULTICALL3_ADDRESS,
            abi: MULTICALL3_ABI,
            functionName: 'tryAggregate',
            args: [false, tokenIdCalls.map((c) => c.call)],
        })) as Array<{ success: boolean; returnData: `0x${string}` }>

        // Step 4: Build position data calls
        const positionCalls: Array<{
            tokenId: bigint
            pmAddress: string
            protocol: string
            call: { target: Address; callData: `0x${string}` }
        }> = []

        for (let i = 0; i < tokenIdResults.length; i++) {
            if (!tokenIdResults[i].success) continue

            const tokenId = decodeFunctionResult({
                abi: NONFUNGIBLE_POSITION_MANAGER_ABI,
                functionName: 'tokenOfOwnerByIndex',
                data: tokenIdResults[i].returnData,
            }) as bigint

            positionCalls.push({
                tokenId,
                pmAddress: tokenIdCalls[i].pmAddress,
                protocol: tokenIdCalls[i].protocol,
                call: {
                    target: tokenIdCalls[i].pmAddress as Address,
                    callData: encodeFunctionData({
                        abi: NONFUNGIBLE_POSITION_MANAGER_ABI,
                        functionName: 'positions',
                        args: [tokenId],
                    }),
                },
            })
        }

        if (positionCalls.length === 0) return []

        // Step 5: Batch fetch all position data
        const positionResults = (await client.readContract({
            address: MULTICALL3_ADDRESS,
            abi: MULTICALL3_ABI,
            functionName: 'tryAggregate',
            args: [false, positionCalls.map((c) => c.call)],
        })) as Array<{ success: boolean; returnData: `0x${string}` }>

        // Step 6: Process positions and filter HYPE/USDT0
        const positions: Array<{
            tokenId: string
            pmAddress: string
            protocol: string
            token0: string
            token1: string
            fee: number
            tickLower: number
            tickUpper: number
            liquidity: bigint
            poolAddress: string
        }> = []

        const uniquePools = new Set<string>()

        for (let i = 0; i < positionResults.length; i++) {
            if (!positionResults[i].success) continue

            const positionData = decodeFunctionResult({
                abi: NONFUNGIBLE_POSITION_MANAGER_ABI,
                functionName: 'positions',
                data: positionResults[i].returnData,
            })

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [, , token0, token1, fee, tickLower, tickUpper, liquidity] = positionData as unknown as any[]

            console.log('[PositionFetcher] Position', i, '- Token0:', token0, 'Token1:', token1, 'Liquidity:', liquidity?.toString())

            // Skip if no liquidity
            if (liquidity === 0n) {
                console.log('[PositionFetcher] Skipping position - no liquidity')
                continue
            }

            // For now, show all positions - we can filter later
            // if (!this.isHypeUsdt0Pair(token0 as string, token1 as string)) {
            //     console.log('[PositionFetcher] Skipping position - not HYPE/USDT0 pair')
            //     continue
            // }

            // Get the correct factory for this DEX
            const dex = getDexByPositionManager(positionCalls[i].pmAddress) || positionCalls[i].protocol
            const dexConfig = HYPEREVM_DEXS[dex as keyof typeof HYPEREVM_DEXS]
            const factoryAddress = dexConfig?.factoryAddress || '0xB1c0fa0B789320044A6F623cFe5eBda9562602E3' // Default to Hyperswap

            // Try to get pool address from factory first
            let poolAddress: string
            try {
                const client = getViemClient(HYPEREVM_CHAIN_ID)
                poolAddress = (await client.readContract({
                    address: factoryAddress as Address,
                    abi: UNISWAP_V3_FACTORY_ABI,
                    functionName: 'getPool',
                    args: [token0 as Address, token1 as Address, Number(fee)],
                })) as string

                if (!poolAddress || poolAddress === '0x0000000000000000000000000000000000000000') {
                    console.log('[PositionFetcher] No pool found in factory for tokens', token0, token1, 'fee', fee)
                    continue
                }
                console.log('[PositionFetcher] Found pool address from factory:', poolAddress)
            } catch (error) {
                console.log('[PositionFetcher] Failed to get pool from factory, computing address', error)
                // Fallback to computing pool address
                poolAddress = this.computePoolAddress(token0 as string, token1 as string, Number(fee), factoryAddress as string)
            }
            uniquePools.add(poolAddress)

            positions.push({
                tokenId: positionCalls[i].tokenId.toString(),
                pmAddress: positionCalls[i].pmAddress,
                protocol: positionCalls[i].protocol,
                token0: token0 as string,
                token1: token1 as string,
                fee: Number(fee),
                tickLower: Number(tickLower),
                tickUpper: Number(tickUpper),
                liquidity,
                poolAddress,
            })
        }

        // Step 7: Batch fetch pool states
        console.log('[PositionFetcher] Fetching pool states for', uniquePools.size, 'pools')
        const poolStates = await this.fetchPoolStates(Array.from(uniquePools))
        console.log('[PositionFetcher] Got pool states for', poolStates.size, 'pools')

        // Step 8: Get token prices
        await this.fetchTokenPrices()

        // Step 9: Calculate values for each position
        return positions.map((pos) => {
            const poolState = poolStates.get(pos.poolAddress)
            const dex = getDexByPositionManager(pos.pmAddress) || pos.protocol

            if (!poolState) {
                console.log('[PositionFetcher] No pool state for position', pos.tokenId, 'at pool', pos.poolAddress)
            }

            // Determine if position is in range
            const inRange = poolState ? pos.tickLower <= poolState.tick && poolState.tick < pos.tickUpper : false

            // Determine token symbols first
            const token0Symbol = this.getTokenSymbol(pos.token0)
            const token1Symbol = this.getTokenSymbol(pos.token1)

            // Get correct decimals for each token
            const token0Decimals = this.TOKEN_DECIMALS[token0Symbol] || 18
            const token1Decimals = this.TOKEN_DECIMALS[token1Symbol] || 18

            // Calculate token amounts
            let token0Amount = 0
            let token1Amount = 0

            if (poolState) {
                const amounts = calculateTokenAmounts(pos.liquidity, poolState.sqrtPriceX96, pos.tickLower, pos.tickUpper, poolState.tick)
                // Apply correct decimals
                token0Amount = Number(amounts.amount0) / 10 ** token0Decimals
                token1Amount = Number(amounts.amount1) / 10 ** token1Decimals
            }

            // Get token prices
            const token0Price = this.getTokenPrice(token0Symbol)
            const token1Price = this.getTokenPrice(token1Symbol)

            // Calculate USD values
            const token0ValueUSD = token0Amount * token0Price
            const token1ValueUSD = token1Amount * token1Price
            const valueUSD = token0ValueUSD + token1ValueUSD

            return {
                id: pos.tokenId,
                tokenId: pos.tokenId,
                dex: dex.toUpperCase(),
                token0: pos.token0,
                token1: pos.token1,
                token0Symbol,
                token1Symbol,
                fee: pos.fee,
                tickLower: pos.tickLower,
                tickUpper: pos.tickUpper,
                liquidity: pos.liquidity.toString(),
                inRange,
                valueUSD,
                token0Amount,
                token1Amount,
                token0ValueUSD,
                token1ValueUSD,
            }
        })
    }

    /**
     * Fetch pool states using multicall
     */
    private async fetchPoolStates(poolAddresses: string[]): Promise<Map<string, PoolState>> {
        if (poolAddresses.length === 0) return new Map()

        const client = getViemClient(HYPEREVM_CHAIN_ID)
        const states = new Map<string, PoolState>()

        // Check cache first
        const uncachedPools = poolAddresses.filter((addr) => !this.poolStateCache.has(addr))

        if (uncachedPools.length > 0) {
            // Build multicall for slot0
            const slot0Calls = uncachedPools.map((poolAddress) => ({
                target: poolAddress as Address,
                callData: encodeFunctionData({
                    abi: UNISWAP_V3_POOL_ABI,
                    functionName: 'slot0',
                }),
            }))

            const slot0Results = (await client.readContract({
                address: MULTICALL3_ADDRESS,
                abi: MULTICALL3_ABI,
                functionName: 'tryAggregate',
                args: [false, slot0Calls],
            })) as Array<{ success: boolean; returnData: `0x${string}` }>

            // Build multicall for liquidity
            const liquidityCalls = uncachedPools.map((poolAddress) => ({
                target: poolAddress as Address,
                callData: encodeFunctionData({
                    abi: UNISWAP_V3_POOL_ABI,
                    functionName: 'liquidity',
                }),
            }))

            const liquidityResults = (await client.readContract({
                address: MULTICALL3_ADDRESS,
                abi: MULTICALL3_ABI,
                functionName: 'tryAggregate',
                args: [false, liquidityCalls],
            })) as Array<{ success: boolean; returnData: `0x${string}` }>

            // Process results
            for (let i = 0; i < uncachedPools.length; i++) {
                if (slot0Results[i].success && liquidityResults[i].success) {
                    // Check for empty data
                    if (
                        !slot0Results[i].returnData ||
                        slot0Results[i].returnData === '0x' ||
                        !liquidityResults[i].returnData ||
                        liquidityResults[i].returnData === '0x'
                    ) {
                        console.log('[PositionFetcher] Pool', uncachedPools[i], 'returned empty data - pool may not exist')
                        continue
                    }

                    try {
                        const slot0 = decodeFunctionResult({
                            abi: UNISWAP_V3_POOL_ABI,
                            functionName: 'slot0',
                            data: slot0Results[i].returnData,
                        }) as [bigint, number, number, number, number, number, boolean]

                        const liquidity = decodeFunctionResult({
                            abi: UNISWAP_V3_POOL_ABI,
                            functionName: 'liquidity',
                            data: liquidityResults[i].returnData,
                        }) as bigint

                        const state = {
                            sqrtPriceX96: slot0[0],
                            tick: slot0[1],
                            liquidity,
                        }

                        this.poolStateCache.set(uncachedPools[i], state)
                        states.set(uncachedPools[i], state)
                        console.log('[PositionFetcher] Pool state cached for', uncachedPools[i])
                    } catch (error) {
                        console.log('[PositionFetcher] Failed to decode pool state for', uncachedPools[i], error)
                    }
                } else {
                    console.log('[PositionFetcher] Pool calls failed for', uncachedPools[i])
                }
            }
        }

        // Add cached pools
        for (const poolAddress of poolAddresses) {
            const cached = this.poolStateCache.get(poolAddress)
            if (cached) {
                states.set(poolAddress, cached)
            }
        }

        return states
    }

    /**
     * Fetch spot balances from HyperCore
     */
    private async fetchSpotBalances(account: string): Promise<SpotBalance[]> {
        try {
            const response = await fetch(`https://api.hyperliquid.xyz/info`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'spotClearinghouseState',
                    user: account,
                }),
            })

            const data = await response.json()
            const balances = data.balances || []

            // Get token prices
            await this.fetchTokenPrices()

            return balances
                .filter((b: { total: string }) => parseFloat(b.total) > 0)
                .filter((b: { coin: string }) => ['HYPE', 'USDT0', 'USDC'].includes(b.coin)) // Only track HYPE, USDT0, USDC
                .map((balance: { coin: string; total: string }) => {
                    const { coin, total } = balance
                    const totalBalance = parseFloat(total)

                    // Get price from cache or use defaults for stables
                    let price = this.tokenPriceCache.get(coin) || 0
                    if (coin === 'USDC' || coin === 'USDT0') {
                        price = 1
                    }

                    return {
                        id: `${account}-${coin}`,
                        asset: coin,
                        balance: totalBalance,
                        valueUSD: totalBalance * price,
                    }
                })
        } catch (error) {
            console.error('Error fetching spot balances:', error)
            return []
        }
    }

    /**
     * Fetch perpetual positions from HyperCore
     */
    private async fetchPerpPositions(account: string): Promise<PerpPosition[]> {
        try {
            const response = await fetch('https://api.hyperliquid.xyz/info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'clearinghouseState',
                    user: account,
                }),
            })

            const data = await response.json()
            const assetPositions = data.assetPositions || []

            // Also fetch current mark prices for accurate calculations
            const markPricesResponse = await fetch('https://api.hyperliquid.xyz/info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'allMids',
                }),
            })

            const markPricesData = await markPricesResponse.json()
            const markPrices: Record<string, number> = {}

            // Build mark price map
            if (markPricesData) {
                for (const [coin, price] of Object.entries(markPricesData)) {
                    markPrices[coin] = parseFloat(price as string)
                }
            }

            return assetPositions
                .filter((pos: { position: { szi: string } }) => {
                    const szi = parseFloat(pos.position?.szi || '0')
                    return Math.abs(szi) > 0.00001
                })
                .map(
                    (pos: {
                        position: {
                            coin: string
                            szi: string
                            entryPx: string
                            markPx: string
                            cumFunding: { allTime: string; total: string }
                            marginUsed: string
                        }
                    }) => {
                        const { position } = pos
                        const coin = position.coin
                        const szi = parseFloat(position.szi)
                        const entryPx = parseFloat(position.entryPx || '0')

                        // Use mark price from allMids API or fallback to position data
                        const markPx = markPrices[coin] || parseFloat(position.markPx || '0')

                        // Calculate unrealized PnL manually if needed
                        const unrealizedPnl = szi * (markPx - entryPx)

                        const fundingPaid = parseFloat(position.cumFunding?.allTime || position.cumFunding?.total || '0')
                        const marginUsed = parseFloat(position.marginUsed || Math.abs((szi * entryPx) / 5).toString()) // Estimate 5x leverage if not provided
                        const notionalValue = Math.abs(szi * markPx)

                        return {
                            id: `${account}-perp-${coin}`,
                            asset: coin,
                            size: szi,
                            entryPrice: entryPx,
                            markPrice: markPx,
                            notionalValue,
                            unrealizedPnl,
                            fundingPaid,
                            marginUsed,
                        }
                    },
                )
        } catch (error) {
            console.error('Error fetching perp positions:', error)
            return []
        }
    }

    /**
     * Fetch token prices from Hyperliquid API
     */
    private async fetchTokenPrices(): Promise<void> {
        // Skip if recently fetched
        if (this.tokenPriceCache.size > 0 && Date.now() - this.cacheTimestamp < 60000) {
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
            if (!this.tokenPriceCache.has('BTC')) {
                this.tokenPriceCache.set('BTC', 100000)
            }
            if (!this.tokenPriceCache.has('ETH')) {
                this.tokenPriceCache.set('ETH', 3800)
            }

            console.log('[PositionFetcher] Token prices fetched:', Array.from(this.tokenPriceCache.entries()))
        } catch (error) {
            console.error('Error fetching token prices:', error)
            // Use fallback prices on error
            this.tokenPriceCache.set('HYPE', 44.8)
            this.tokenPriceCache.set('WHYPE', 44.8)
            this.tokenPriceCache.set('USDT0', 1)
            this.tokenPriceCache.set('USDC', 1)
            this.tokenPriceCache.set('BTC', 100000)
            this.tokenPriceCache.set('ETH', 3800)
        }
    }

    /**
     * Compute pool address deterministically
     */
    private computePoolAddress(token0: string, token1: string, fee: number, factory: string): string {
        // Sort tokens
        const [tokenA, tokenB] = token0.toLowerCase() < token1.toLowerCase() ? [token0, token1] : [token1, token0]

        // Pool init code hashes per DEX factory
        const INIT_CODE_HASHES: Record<string, string> = {
            '0xb1c0fa0b789320044a6f623cfe5ebda9562602e3': '0xe3572921be1688dba92df30c6781b8770499ff274d20ae9b325f4242634774fb', // Hyperswap (from config)
            '0xff7b3e8c00e57ea31477c32a5b52a58eea47b072': '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54', // ProjectX (standard Uniswap V3)
            '0x2dc0ec0f0db8baf250eccf268d7dfbf59346e5e': '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54', // Hybra
        }

        const factoryLower = factory.toLowerCase()
        const initCodeHash = INIT_CODE_HASHES[factoryLower] || '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54' // Default to standard Uniswap V3 hash
        console.log('[PositionFetcher] Using init code hash', initCodeHash, 'for factory', factory)

        const salt = keccak256(encodePacked(['address', 'address', 'uint24'], [getAddress(tokenA), getAddress(tokenB), fee]))

        const poolAddress = getAddress(
            `0x${keccak256(
                encodePacked(['bytes1', 'address', 'bytes32', 'bytes32'], ['0xff', getAddress(factory), salt, initCodeHash as `0x${string}`]),
            ).slice(26)}`,
        )

        console.log('[PositionFetcher] Computed pool address:', poolAddress, 'for factory:', factory)
        return poolAddress
    }

    /**
     * Get token symbol from address
     */
    private getTokenSymbol(address: string): string {
        const addr = address.toLowerCase()
        // Check USDT0 first
        if (addr === this.USDT0_ADDRESS.toLowerCase()) return 'USDT0'
        // Check HYPE addresses
        if (addr === '0x5555555555555555555555555555555555555555') return 'WHYPE'
        if (this.HYPE_ADDRESSES.map((a) => a.toLowerCase()).includes(addr)) return 'HYPE'
        // Fallback
        return addr.slice(0, 6).toUpperCase()
    }

    /**
     * Get token price in USD
     */
    private getTokenPrice(symbol: string): number {
        // Use cached prices if available
        const cached = this.tokenPriceCache.get(symbol)
        if (cached !== undefined) return cached

        // Default prices for stablecoins
        if (symbol === 'USDT0' || symbol === 'USDC') {
            return 1.0
        }

        // If no price found, return 0
        console.warn(`[PositionFetcher] No price found for token: ${symbol}`)
        return 0
    }

    /**
     * Fetch HyperEVM wallet balances
     */
    private async fetchHyperEvmBalances(account: string): Promise<HyperEvmBalance[]> {
        try {
            const client = getViemClient(HYPEREVM_CHAIN_ID)

            // Get native HYPE balance
            const nativeBalance = await client.getBalance({ address: account as Address })

            // Common token addresses on HyperEVM - Only track HYPE, USDT0, USDC
            const tokens = [
                { address: '0x5555555555555555555555555555555555555555', symbol: 'WHYPE', decimals: 18 },
                { address: '0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb', symbol: 'USDT0', decimals: 6 },
                // { address: '0x02c6a2fa58cc01a18b8d9e00ea48d65e4df26c70', symbol: 'USDC', decimals: 18 },
            ]

            // Fetch token balances using multicall
            const balanceCalls = tokens.map((token) => ({
                target: token.address as Address,
                callData: encodeFunctionData({
                    abi: [
                        {
                            inputs: [{ name: 'account', type: 'address' }],
                            name: 'balanceOf',
                            outputs: [{ name: '', type: 'uint256' }],
                            stateMutability: 'view',
                            type: 'function',
                        },
                    ],
                    functionName: 'balanceOf',
                    args: [account as Address],
                }),
            }))

            const balanceResults = (await client.readContract({
                address: MULTICALL3_ADDRESS,
                abi: MULTICALL3_ABI,
                functionName: 'tryAggregate',
                args: [false, balanceCalls],
            })) as Array<{ success: boolean; returnData: `0x${string}` }>

            // Get token prices
            await this.fetchTokenPrices()

            const balances: HyperEvmBalance[] = []

            // Add native HYPE balance
            const hypePrice = this.tokenPriceCache.get('HYPE') || 44.8
            const nativeHypeAmount = Number(nativeBalance) / 10 ** 18
            if (nativeHypeAmount > 0.0001) {
                balances.push({
                    id: `${account}-hyperevm-HYPE`,
                    asset: 'HYPE',
                    symbol: 'HYPE',
                    address: '0x0000000000000000000000000000000000000000',
                    balance: nativeBalance.toString(),
                    decimals: 18,
                    valueUSD: nativeHypeAmount * hypePrice,
                })
            }

            // Process token balances
            for (let i = 0; i < tokens.length; i++) {
                if (!balanceResults[i].success) continue

                const balance = decodeFunctionResult({
                    abi: [
                        {
                            inputs: [{ name: 'account', type: 'address' }],
                            name: 'balanceOf',
                            outputs: [{ name: '', type: 'uint256' }],
                            stateMutability: 'view',
                            type: 'function',
                        },
                    ],
                    functionName: 'balanceOf',
                    data: balanceResults[i].returnData,
                }) as bigint

                if (balance > 0n) {
                    const token = tokens[i]
                    const tokenAmount = Number(balance) / 10 ** token.decimals
                    const tokenPrice = this.tokenPriceCache.get(token.symbol) || 0

                    // Skip if balance is too small
                    if (tokenAmount > 0.0001) {
                        balances.push({
                            id: `${account}-hyperevm-${token.symbol}`,
                            asset: token.symbol,
                            symbol: token.symbol,
                            address: token.address,
                            balance: balance.toString(),
                            decimals: token.decimals,
                            valueUSD: tokenAmount * tokenPrice,
                        })
                    }
                }
            }

            return balances
        } catch (error) {
            console.error('Error fetching HyperEVM balances:', error)
            return []
        }
    }

    // Removed unused isHypeUsdt0Pair function - we're now showing all positions
}

// Export singleton instance
export const positionFetcher = new PositionFetcher()
