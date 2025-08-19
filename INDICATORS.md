# HyperLP Indicators Documentation

## Overview

HyperLP implements a delta-neutral liquidity provision strategy on Hyperliquid that aims to earn yield from LP fees and funding rates while minimizing directional exposure to volatile assets (HYPE). The strategy provides liquidity on HyperEVM DEXs (50% HYPE / 50% USDT0) while maintaining a short perpetual position on HyperCore to hedge the HYPE exposure.

## Core Indicators

### 1. Capital Metrics

#### Deployed AUM (Assets Under Management)
- **Definition**: Total capital actively deployed in the delta-neutral strategy
- **Calculation**: `LP value (including unclaimed fees) + Perp positions value`
- **Location**: `src/app/api/snapshot/[account]/route.ts:510-511`
- **Excludes**: Idle capital in wallets and spot balances

#### Capital Breakdown
- **HyperEVM**: 
  - HYPE percentage vs Stablecoins percentage in LPs and wallet
  - Calculated in `src/utils/token.util.ts`
- **HyperCore**:
  - Margin (collateral for perps)
  - Notional (total position size)
  - Leverage ratio (`notional / margin`)

### 2. Delta (Exposure) Metrics

#### Understanding Delta in Context
Delta represents the portfolio's sensitivity to HYPE price movements. A delta of +100 HYPE means the portfolio gains $100 for every $1 increase in HYPE price. The goal of delta-neutral strategy is to maintain delta close to zero.

#### Net Delta
- **Definition**: Total portfolio exposure to HYPE price movements across all positions
- **Unit**: HYPE tokens (converted to USD for display)
- **Calculation**: `LP delta + Perp delta + Spot delta + Wallet delta`
- **Target**: As close to 0 as possible
- **Location**: `src/app/api/snapshot/[account]/route.ts:307`

#### Strategy Delta (Key Risk Metric)
- **Definition**: Net exposure from active strategy positions only
- **Calculation**: `LP delta + Perp delta` (excludes idle capital)
- **Purpose**: Primary measure of hedge effectiveness
- **Ideal Range**: -1% to +1% of deployed AUM
- **Location**: `src/app/api/snapshot/[account]/route.ts:308`

#### Delta Components
- **LP Delta**: HYPE exposure from liquidity positions (always positive)
  - In a 50/50 pool, LP holds 50% HYPE, creating long exposure
- **Perp Delta**: Negative exposure from short perpetuals (the hedge)
  - Short position offsets LP's HYPE exposure
  - Size should roughly match LP delta
- **Wallet Delta**: Exposure from idle HYPE in wallet (not hedged)
- **Spot Delta**: Exposure from spot balances on HyperCore (not hedged)

### 3. APR (Annual Percentage Rate) Metrics

#### LP APR
- **Periods**: 24h, 7d, 30d
- **Calculation**: Weighted average of individual pool APRs
- **Weight**: Position value in USD
- **Location**: `src/app/api/snapshot/[account]/route.ts:119-151`

#### Funding APR
- **Current**: Live 8-hour funding rate (annualized)
- **Historical**: 24h, 7d, 30d averages
- **Weight**: Position notional value
- **Location**: `src/app/api/snapshot/[account]/route.ts:163-194`

#### Combined Delta-Neutral APR
- **Formula**: `(LP_APR × LP_value + Funding_APR × margin_value) / total_deployed_value`
- **Approximation**: `2/3 × LP_APR + 1/3 × Funding_APR`
- **Location**: `src/app/api/snapshot/[account]/route.ts:196-243`
- **Note**: Returns are shown "before IL" (impermanent loss not included)

### 4. Risk Management Indicators

#### Delta Risk Levels
Based on Strategy Delta as percentage of Deployed AUM:
- **HEDGED** (< 10%): 
  - Well-balanced positions
  - Hedge is effectively neutralizing LP exposure
  - No immediate action required
  
- **DRIFT** (10-20%): 
  - Moderate imbalance developing
  - Could be from price movement or LP composition change
  - Monitor closely, prepare for rebalancing
  
- **REBALANCE** (> 20%): 
  - Significant exposure to HYPE price risk
  - Immediate rebalancing required
  - May need to adjust perp size or LP positions

Location: `src/components/charts/account/DeltaTrackingChart.tsx:656-666`

#### Leverage Metrics
- **Average Leverage**: Total notional / total margin for perp positions
  - Higher leverage = higher capital efficiency but more liquidation risk
  - Typical range: 2-5x for conservative strategy
- **Individual Position Leverage**: Shown per perpetual position
  - Monitor for positions approaching liquidation thresholds

#### Rebalancing Triggers
1. **Delta Drift**: When Strategy Delta exceeds threshold
2. **LP Composition Change**: When pool ratio deviates from 50/50
3. **Funding Rate Inversion**: When funding becomes significantly negative
4. **Liquidation Risk**: When leverage approaches dangerous levels

## Data Flow

### 1. Data Collection (`src/app/api/snapshot/[account]/route.ts`)
```
1. Fetch positions from HyperEVM and HyperCore
2. Calculate USD values using current prices
3. Calculate HYPE deltas for each position type
4. Fetch and calculate weighted APRs
5. Aggregate into AccountSnapshot structure
```

### 2. Data Storage (`src/stores/app.store.ts`)
- Snapshots stored in Zustand store
- Historical data maintained for charting
- 5-second cache on API level

### 3. Data Visualization

#### Delta Tracking Chart (`src/components/charts/account/DeltaTrackingChart.tsx`)
Displays time series of:
- Deployed AUM (dotted line)
- LP Delta (green line)
- Perp Delta (orange line)
- Strategy Delta (dashed line with area fill)
- Optional: Wallet and Spot deltas

#### Account Page (`src/app/account/[account]/page.tsx`)
Shows:
- Current metrics in header
- Gross Delta-Neutral APR range
- Position tables with individual APRs
- Capital breakdowns with tooltips

## Strategy Mechanics & Examples

### How Delta-Neutral Works
```
Initial Setup ($10,000 capital):
1. Allocate ~$6,666 to LP (creates ~$3,333 HYPE exposure)
2. Allocate ~$3,334 as margin for short perp
3. Open short perp with ~$3,333 notional (hedges LP exposure)
4. Result: Near-zero net exposure to HYPE price

As HYPE price changes:
- LP composition shifts (more HYPE if price falls, less if rises)
- Perp P&L moves opposite direction
- Net portfolio value remains stable
```

### Example 1: Perfect Hedge
```typescript
// Initial state at HYPE = $30:
// - LP: 111.11 HYPE + 3,333 USDT0 (total $6,666)
// - Short perp: -111.11 HYPE notional

// LP Delta = 111.11 HYPE
// Perp Delta = -111.11 HYPE
Strategy Delta = 111.11 + (-111.11) = 0 HYPE
Delta % = 0% (PERFECTLY HEDGED)
```

### Example 2: Delta Drift After Price Move
```typescript
// After HYPE rises to $40:
// - LP rebalances to 83.33 HYPE + 3,333 USDT0
// - Short perp still -111.11 HYPE

// LP Delta = 83.33 HYPE
// Perp Delta = -111.11 HYPE
Strategy Delta = 83.33 + (-111.11) = -27.78 HYPE
Delta % = (27.78 × $40) / $10,000 = 11.1% (DRIFT - needs monitoring)
```

### Example 3: Combined APR Calculation
```typescript
// Scenario: Bull market with positive funding
// - LP: $6,666 earning 60% APR from fees
// - Perp: $3,334 margin, paying -30% funding (shorts pay longs)

Combined APR = (60% × 6,666 + (-30%) × 3,334) / 10,000
            = (4,000 - 1,000) / 10,000
            = 30% gross APR (before costs & IL)

// Note: In bear markets, funding often flips positive for shorts
// This can significantly boost returns when shorts receive funding
```

## Important Risk Considerations

### Risks Managed by the Strategy
1. **Directional Risk**: Minimized through delta-neutral hedging
2. **Rebalancing Costs**: Monitored via drift thresholds
3. **Liquidation Risk**: Controlled through leverage limits

### Risks NOT Fully Mitigated
1. **Impermanent Loss (IL)**: Not included in APR calculations
   - Can be significant in volatile markets
   - Partially offset by LP fees and funding income
2. **Funding Rate Risk**: Can turn negative for shorts in bear markets
3. **Smart Contract Risk**: Exposure to protocol vulnerabilities
4. **Basis Risk**: Perp and spot prices may diverge temporarily

## Key Operational Notes

1. **All deltas are calculated in HYPE units** then converted to USD for display
2. **APRs are annualized** from shorter period returns (24h, 7d, 30d)
3. **Impermanent loss is NOT included** in displayed APRs
4. **Strategy metrics exclude idle capital** to focus on active positions
5. **Rebalancing thresholds** are configurable but default to 10%/20%
6. **Capital allocation** roughly follows 2/3 LP, 1/3 perp margin ratio

## API Endpoints

- **GET** `/api/snapshot/[account]` - Fetch current account metrics
- **GET** `/api/pools/tvl` - Pool TVL and APR data
- **POST** `/api/analytics/store-snapshot` - Store historical snapshot

## Update Frequency

- **Development**: 30 seconds
- **Production**: 60 seconds
- **Cache TTL**: 5 seconds (API level)