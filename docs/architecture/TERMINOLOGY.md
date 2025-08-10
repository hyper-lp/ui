# HyperLP Terminology Guide

## Core Concepts & Proper Vocabulary

### Platform Components
- **HyperCore**: The perpetual futures trading platform on Hyperliquid L1
- **HyperEVM**: The EVM-compatible layer where DEXs operate
- **CoreWriter**: The mechanism for opening/managing perpetual positions on HyperCore
- **Hyperswap**: The primary DEX on HyperEVM where we provide liquidity

### Account & Position Terminology

#### Accounts
- **MonitoredAccount** (not ~~MonitoredWallet~~): An address being tracked by the vault
- **accountAddress**: The blockchain address of a monitored account
- **accountsMonitored**: Count of tracked accounts

#### Position Types
- **LpPosition**: Liquidity provider position on HyperEVM DEXs
  - `LpPositionSnapshot`: Historical state of LP positions
  - `lpPositionsUpdated`: Count of LP positions modified
  - `lpValue`: Value locked in LP positions
  
- **PerpPosition** (not ~~HedgePosition~~): Perpetual futures position on HyperCore
  - `PerpPositionSnapshot`: Historical state of perp positions
  - `perpPositions`: Array/count of perpetual positions
  - `perpDelta`: Delta exposure from perpetual positions
  - `perpValue`: Value/margin in perpetual positions
  - `perpEffectiveness`: How well the perp offsets LP exposure

- **SpotPosition**: Spot holdings (HYPE, USDT0, USDC)
  - `SpotPositionSnapshot`: Historical state of spot holdings
  - `spotPositions`: Array/count of spot positions
  - `spotValue`: Value of spot holdings

### Delta & Exposure Management
- **netDelta** (not ~~deltaDrift~~): Combined delta exposure from LP and perp positions
- **grossExposure**: Total absolute exposure across all positions
- **netExposure**: Net directional exposure after hedging
- **targetDelta**: Desired delta exposure (typically 0 for delta-neutral)
- **deltaThreshold**: Acceptable deviation from target before rebalancing

### Capital Allocation
- **vaultCapital**: Total capital managed by the vault
- **lpAllocation**: Portion allocated to liquidity provision (~⅔)
- **perpMargin**: USDC allocated as margin for perps (~⅓)
- **rebalanceBuffer**: Reserved capital for rebalancing operations

### Yield Components
- **lpFeeAPR**: Annual percentage rate from LP trading fees
- **fundingAPR**: Annual percentage rate from perp funding payments
- **incentiveAPR**: APR from protocol incentives/points
- **netAPR**: Combined yield after costs
- **realizedAPR**: Actual historical APR achieved

### Rebalancing Operations
- **rebalance**: Adjust perp positions to maintain delta neutrality
- **rebalanceFrequency**: How often positions are adjusted
- **rebalanceCost**: Transaction fees from rebalancing
- **passiveRebalance**: Using limit orders (no fees)
- **activeRebalance**: Using market orders (incurs taker fees)
- **rebalanceThreshold**: Trigger point for rebalancing

### Pool & Market Data
- **poolAddress**: Smart contract address of LP pool
- **poolReserves**: Token amounts in the pool
- **poolComposition**: Current token ratio in pool
- **tickRange**: Price range for concentrated liquidity
- **poolFee**: Trading fee tier of the pool
- **poolVolume24h**: 24-hour trading volume
- **poolTVL**: Total value locked in pool

### Asset Terminology
- **HYPE**: The volatile/risk asset being hedged
- **USDT0**: Bridged USDT on Hyperliquid (stable asset)
- **USDC**: Native stablecoin used for perp margin
- **baseAsset**: The primary asset in a pair (e.g., HYPE)
- **quoteAsset**: The quote/stable asset (e.g., USDT0)

### Performance Metrics
- **sharpeRatio**: Risk-adjusted return metric
- **maxDrawdown**: Largest peak-to-trough decline
- **dailyVolatility**: Standard deviation of daily returns
- **trackingError**: Deviation from perfect delta neutrality
- **slippage**: Price impact from trades
- **impermanentLoss**: IL from providing liquidity

### Smart Contract & Technical
- **ERC4626**: Tokenized vault standard for the MVP
- **vaultShares**: Tokens representing vault ownership
- **sharePrice**: NAV per vault share
- **deposit**: Add capital to vault
- **withdraw**: Remove capital from vault
- **harvest**: Collect and reinvest earned fees

### Database Models (Prisma Schema)
```typescript
// Current models after refactoring:
- MonitoredAccount (not MonitoredWallet)
- LpPosition
- PerpPosition (not HedgePosition)
- SpotPosition
- LpPositionSnapshot (not PositionSnapshot)
- PerpPositionSnapshot
- SpotPositionSnapshot
- AnalyticsRun
- Pool
- PoolSnapshot
```

## Usage Examples

### ❌ Incorrect (Old Terminology)
```typescript
const wallet = await getMonitoredWallet(address);
const hedgePosition = await createHedgePosition(wallet);
const deltaDrift = calculateDeltaDrift(positions);
```

### ✅ Correct (New Terminology)
```typescript
const account = await getMonitoredAccount(address);
const perpPosition = await createPerpPosition(account);
const netDelta = calculateNetDelta(positions);
```

## Key Principles
1. **Account** not Wallet - We track accounts that hold positions
2. **Perp** not Hedge - Perpetual futures are used to offset LP exposure
3. **Net Delta** not Delta Drift - Represents combined exposure
4. **LP/Perp/Spot** - Three distinct position types
5. **HyperCore/HyperEVM** - Two layers of the Hyperliquid ecosystem

## Notes for Implementation
- Always use "account" when referring to addresses being monitored
- Use "perp" for perpetual futures positions, not "hedge"
- Clearly distinguish between LP positions (on HyperEVM) and perp positions (on HyperCore)
- Use "netDelta" to represent the combined delta exposure
- Maintain consistency with these terms across code, comments, and documentation