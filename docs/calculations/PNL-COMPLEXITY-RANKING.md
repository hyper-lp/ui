# PnL Components Ranked by Implementation Complexity

## Ranking from Easiest to Most Difficult

### 🟢 EASY - Direct API/Contract Reads

#### 1. **Perp Funding Received/Paid** ⭐
- **Source**: Hyperliquid API direct endpoint
- **Method**: Simple API call to `/info` endpoint
- **Complexity**: Trivial - direct value from API response
- **Formula**: None needed, already calculated by exchange
- **Data**: `fundingHistory` endpoint provides historical data

#### 2. **LP Swap Fees Earned (Claimed)** ⭐
- **Source**: DEX subgraph or contract events
- **Method**: Query `Collect` events from pool contract
- **Complexity**: Easy - sum of collected fee events
- **Formula**: Simple addition of event amounts
- **Data**: Historical on-chain events

#### 3. **Perp Maker/Taker Fees** ⭐⭐
- **Source**: Hyperliquid API trade history
- **Method**: Query trade history, identify maker vs taker orders
- **Complexity**: Easy - multiply volume by fee rates
- **Formula**: `volume * fee_rate` (maker: -0.02%, taker: 0.025%)
- **Data**: Trade history with fee tier identification

### 🟡 MODERATE - Simple Calculations

#### 4. **LP Rebalancing Gas Costs** ⭐⭐
- **Source**: Transaction receipts
- **Method**: Track gas used in rebalance transactions
- **Complexity**: Moderate - need to identify rebalance txs
- **Formula**: `gasUsed * gasPrice * ETH_price`
- **Data**: On-chain transaction data + ETH price feed

#### 5. **LP Unclaimed Fees** ⭐⭐⭐
- **Source**: Pool contract state
- **Method**: Calculate fees accrued since last collection
- **Formula**: Based on position's share of pool fees
- **Calculation**:
  ```
  unclaimed = (feeGrowthGlobal - feeGrowthPosition) * liquidity
  ```
- **Data**: Current pool state + position checkpoint

#### 6. **Perp Unrealized PnL** ⭐⭐⭐
- **Source**: Current position + mark price
- **Method**: Compare entry price to current mark price
- **Complexity**: Moderate - need position tracking
- **Formula**: `(markPrice - avgEntryPrice) * position_size`
- **Data**: Position data + real-time price feed

### 🟠 COMPLEX - Multi-step Calculations

#### 7. **LP Rebalancing Swap Costs** ⭐⭐⭐⭐
- **Source**: DEX swap events during rebalances
- **Method**: Track slippage and fees on rebalance swaps
- **Complexity**: Complex - identify rebalance swaps vs normal swaps
- **Formula**: `(executionPrice - spotPrice) * volume + swap_fees`
- **Challenges**:
  - Distinguish rebalance swaps from position changes
  - Calculate actual vs expected execution price
  - Account for multi-hop swaps

#### 8. **Net Delta Calculation** ⭐⭐⭐⭐
- **Source**: Combined LP + Perp positions
- **Method**: Calculate LP delta, add perp delta
- **Complexity**: Complex - requires accurate LP position modeling
- **Formula**: 
  ```
  LP_delta = token0_amount + token1_amount * (price < priceLower ? 0 : price > priceUpper ? 1 : delta_ratio)
  Net_delta = LP_delta + Perp_position
  ```
- **Challenges**:
  - Accurate V3 position delta calculation
  - Price range considerations
  - Real-time price updates

### 🔴 DIFFICULT - Complex State-Dependent Calculations

#### 9. **Impermanent Loss (IL)** ⭐⭐⭐⭐⭐
- **Source**: Multiple data points over time
- **Method**: Compare current value vs HODL value
- **Complexity**: Very complex - requires historical tracking
- **Formula**: 
  ```
  IL = current_position_value - (initial_token0 * current_price0 + initial_token1 * current_price1)
  ```
- **Challenges**:
  - Track initial deposit amounts and prices
  - Handle multiple deposits/withdrawals
  - Account for fee earnings offsetting IL
  - Concentrated liquidity makes IL calculation non-standard
  - Need to track position through range changes

## Implementation Strategy by Difficulty

### Phase 1: Quick Wins (1-2 days)
✅ Implement items 1-3 (direct API reads)
- Set up Hyperliquid API client
- Query funding and trade history
- Parse DEX events for collected fees

### Phase 2: Foundation (3-5 days)
✅ Implement items 4-6 (simple calculations)
- Track gas costs with transaction monitoring
- Calculate unclaimed fees from pool state
- Add unrealized PnL tracking

### Phase 3: Advanced (1-2 weeks)
⚠️ Implement items 7-8 (complex calculations)
- Build rebalance detection system
- Implement accurate delta calculations
- Create swap cost analysis

### Phase 4: Sophisticated (2-3 weeks)
🔴 Implement item 9 (IL calculation)
- Design position history tracking
- Build IL calculation engine for concentrated liquidity
- Create backtesting framework for validation

## Data Requirements Summary

### Easy to Obtain
- Hyperliquid API data (funding, trades, positions)
- On-chain events (fee collections, transfers)
- Current pool state (via RPC calls)

### Moderate Difficulty
- Historical price data with high granularity
- Gas price history
- Transaction classification (rebalance vs normal)

### Difficult to Obtain/Maintain
- Complete position history through all changes
- Accurate initial deposit tracking
- Historical pool state at specific blocks
- Correlation between LP and perp actions

## Recommended MVP Approach

**Start with these components for MVP:**
1. Perp funding (easy, high impact)
2. LP collected fees (easy, visible)
3. Perp fees (easy, predictable)
4. Gas costs (moderate, necessary)
5. Unrealized PnL (moderate, expected feature)

**Defer these for v2:**
- Impermanent loss (complex, can estimate initially)
- Precise rebalancing swap costs (can use estimates)
- Historical position reconstruction (can start tracking forward)

## Validation Methods

### Easy Components
- Cross-reference with exchange UI/API
- Compare with on-chain data

### Complex Components  
- Build test cases with known outcomes
- Compare with manual calculations
- Use simplified scenarios for validation
- Implement sanity checks and bounds

## Notes on Impermanent Loss Complexity

IL is particularly complex for concentrated liquidity because:

1. **Non-linear**: IL changes dramatically as price moves through the range
2. **Path-dependent**: Final IL depends on price path, not just endpoints
3. **Range-dependent**: Tighter ranges amplify IL effects
4. **Fee-offset**: High fee earnings can turn IL positive
5. **Rebalance-affected**: Each rebalance "realizes" some IL

Consider using simplified IL estimates initially:
- Track "realized IL" only at rebalances
- Use average range position for estimates
- Provide IL ranges rather than exact values
- Show IL trend rather than absolute numbers