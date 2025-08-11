# Hyperliquid Technical Identifiers Guide

## Overview

When building HyperCore interactions on HyperEVM, you'll work with three key identifiers that bridge the perpetual futures platform (HyperCore) with the EVM-compatible layer (HyperEVM). Understanding these identifiers is crucial for implementing cross-layer functionality.

## Token Index (Token ID)

A unique identifier for each spot token registered on HyperCore.

### Where It's Used
- Calculating system addresses for bridging tokens between EVM ↔ Core
- Querying read precompiles like `spotBalance` and `tokenInfo`
- Invoking the `spotSend` CoreWriter action
- Converting between token addresses and their Core representations

### How to Retrieve

**Offchain via API:**
```bash
curl -s -X POST https://api.hyperliquid.xyz/info \
  -H 'Content-Type: application/json' \
  -d '{"type":"spotMeta"}' | jq '.'
```

Returns a `tokens` array with each token's information:
```json
{
  "name": "USDC",
  "szDecimals": 8,
  "weiDecimals": 8,
  "index": 0,
  "tokenId": "0x6d1e7cde53ba9467b783cb7c530ce054",
  "isCanonical": true,
  "evmContract": null,
  "fullName": null,
  "deployerTradingFeeShare": "0.0"
}
```

**Onchain via Registry:**
- No native onchain mapping from token address to index exists
- Use deployed registry contracts or HyperEVM dev libraries for conversion
- Precompiles can return token contract for a given index, but not vice versa

### Important Token Indexes
```typescript
// Common token indexes for HyperLP
const TOKEN_INDEXES = {
  USDC: 0,
  HYPE: 150,
  USDT0: 1, // Bridged USDT
  // Add more as needed
}
```

## Spot Index (Spot ID)

A unique identifier for each spot market (trading pair).

### Where It's Used
- Calling precompiles like `spotPx` and `spotInfo`
- Calculating the asset ID for spot markets
- Identifying specific trading pairs programmatically

### How to Retrieve

**Offchain via API:**
Same API call as token metadata returns a `universe` array:
```json
{
  "universe": [
    {
      "tokens": [
        150, // HYPE token index (base)
        0    // USDC token index (quote)
      ],
      "name": "@107",
      "index": 107,
      "isCanonical": false
    }
  ]
}
```

**Onchain via Precompile:**
Call the `tokenInfo` precompile with the base token's index:
```solidity
struct TokenInfo {
    string name;
    uint64[] spots;    // All spot markets where tokenIndex is the base
    uint64 deployerTradingFeeShare;
    address deployer;
    address evmContract;
    uint8 szDecimals;
    uint8 weiDecimals;
    int8 evmExtraWeiDecimals;
}
```

### Notes
- Currently, each token has only one spot pair (base/USDC)
- Multiple quote tokens (USDT, etc.) are planned and in testnet
- Spot index for HYPE/USDC market is 107

## Asset Index (Asset ID)

The identifier used when placing trades via CoreWriter or the API. Essential for executing trades programmatically.

### Calculation Rules

**For Spot Markets:**
```typescript
assetId = spotIndex + 10000
```
This offset prevents collision with perp IDs below 10000.

**For Perp Markets:**
Query the `meta` endpoint from the API:
```bash
curl -s -X POST https://api.hyperliquid.xyz/info \
  -H 'Content-Type: application/json' \
  -d '{"type":"meta"}' | jq '.'
```

The perp asset ID is its index in the universe array:
```json
{
  "universe": [
    { "name": "BTC", "maxLeverage": 40, ... },  // ID: 0
    { "name": "ETH", "maxLeverage": 25, ... },  // ID: 1
    // ...
  ]
}
```

### Important Asset IDs for HyperLP
```typescript
// Common asset IDs
const ASSET_IDS = {
  // Spot markets (spotIndex + 10000)
  HYPE_USDC_SPOT: 10107,  // 107 + 10000
  
  // Perp markets (direct index)
  HYPE_PERP: 3,  // Check current index via API
  BTC_PERP: 0,
  ETH_PERP: 1,
}
```

## Decimal Precision

### Key Concepts
- **szDecimals**: Size decimals - precision for position sizes
- **weiDecimals**: Wei decimals - precision for token amounts
- **evmExtraWeiDecimals**: Additional decimals for EVM representation

### Example
```typescript
// USDC has 8 decimals on HyperCore
// 1 USDC = 100000000 (1e8) in raw units
const usdcAmount = 1_000_000; // $1 in 6 decimals
const hyperCoreAmount = usdcAmount * 100; // Convert to 8 decimals
```

## Integration Patterns

### Converting Token Address to Indexes
```typescript
// Using registry or library
async function getTokenIndex(tokenAddress: string): Promise<number> {
  // Query onchain registry or use cached mapping
  const index = await registry.getTokenIndex(tokenAddress);
  return index;
}
```

### Getting Spot Market for Token Pair
```typescript
async function getSpotMarket(baseTokenIndex: number): Promise<SpotMarket> {
  const tokenInfo = await precompile.tokenInfo(baseTokenIndex);
  const spotId = tokenInfo.spots[0]; // First (currently only) spot market
  const assetId = spotId + 10000;
  
  return { spotId, assetId };
}
```

### Placing a Perp Trade
```typescript
async function openPerpPosition(
  asset: string,
  size: number,
  isLong: boolean
) {
  // Get perp asset ID from API or cache
  const assetId = await getPerpAssetId(asset);
  
  // Execute trade via CoreWriter
  await coreWriter.placeOrder({
    asset: assetId,
    isBuy: isLong,
    limitPx: 0, // Market order
    sz: size,
    orderType: { limit: { tif: 'Ioc' } }
  });
}
```

## Common Pitfalls

1. **Confusing Token Index with Spot Index**
   - Token index identifies a single token
   - Spot index identifies a trading pair

2. **Using Wrong Asset ID for Trading**
   - Spot markets: Add 10000 to spot index
   - Perp markets: Use direct index from universe array

3. **Decimal Conversion Errors**
   - Always check szDecimals and weiDecimals
   - Convert properly between EVM and Core representations

4. **Assuming Static IDs**
   - Token and market indexes can change with new listings
   - Always query dynamically in production

## References

- [Hyperliquid API Documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api)
- [Asset IDs Documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/asset-ids)
- [HIP-3 Builder Perps](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/asset-ids#builder-perps)

## Related Documentation

- [TERMINOLOGY.md](./TERMINOLOGY.md) - Business and trading terminology
- [DATA_FLOW.md](./DATA_FLOW.md) - How data flows through the system
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture overview