# Delta Neutral LP Strategy - PNL Calculation Constants & Logic

## Token Configuration

### HYPE Token
```json
{
  "name": "HYPE",
  "fullName": "Hyperliquid",
  "index": 150,
  "tokenId": "0x0d01dc56dcaaca66ad901c959b4011ec",
  "weiDecimals": 8,
  "szDecimals": 2,
  "deployerTradingFeeShare": "0.0"
}
```

### USDT0 Token
```json
{
  "name": "USDT0",
  "fullName": "USDT0",
  "index": 268,
  "tokenId": "0x25faedc3f054130dbb4e4203aca63567",
  "weiDecimals": 8,
  "szDecimals": 2,
  "evmContract": "0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb",
  "deployerTradingFeeShare": "1.0"
}
```

## LP Position Parameters

### Range Configuration
- **Target Range**: ±5% from spot price (500 basis points each direction)
- **Wide Range Alternative**: ±10% for lower maintenance frequency
- **Narrow Range Alternative**: ±2% for higher fee concentration

### Capital Allocation
- **LP Position**: 66.67% of total capital (2/3)
- **Perp Hedge Margin**: 33.33% of total capital (1/3)
- **Initial Token Split**: 50/50 value split when creating position

### Rebalancing Thresholds
- **Price Drift Trigger**: >3% from position center
- **Range Coverage Trigger**: <50% of range is active
- **Delta Drift Trigger**: >5% deviation from target delta
- **Time-based**: Consider rebalancing after significant fee accumulation

## Pool Fee Tiers (HyperSwap)

| Tier | Fee (bps) | Fee (%) | Typical Use Case |
|------|-----------|---------|------------------|
| 500  | 50        | 0.05%   | Stable pairs, high volume |
| 3000 | 300       | 0.30%   | Standard volatile pairs |
| 10000| 1000      | 1.00%   | Exotic or low liquidity pairs |

## Delta Calculation Formulas

### Uniswap V3 Position Delta

```python
def calculate_v3_delta(L, p, p_a, p_b):
    """
    L: Liquidity amount
    p: Current price
    p_a: Lower tick price
    p_b: Upper tick price
    """
    if p < p_a:
        # Below range: 100% token0 (HYPE)
        delta = L / sqrt(p_a)
    elif p > p_b:
        # Above range: 100% token1 (USDT0)
        delta = 0
    else:
        # In range: Mixed position
        delta = L * (1/sqrt(p) - 1/sqrt(p_b))
    
    return delta
```

### Hedge Position Size
```python
hedge_notional = -delta * current_price  # Negative for short position
```

## Impermanent Loss Formulas

### Standard IL Formula (50/50 Pool)
```python
def impermanent_loss(price_ratio):
    """
    price_ratio (r) = new_price / initial_price
    """
    return 2 * sqrt(price_ratio) / (1 + price_ratio) - 1
```

### IL Reference Table
| Price Change | Ratio (r) | IL (%) |
|--------------|-----------|--------|
| -50%         | 0.50      | -5.72  |
| -25%         | 0.75      | -1.85  |
| -10%         | 0.90      | -0.47  |
| +10%         | 1.10      | -0.47  |
| +20%         | 1.20      | -0.87  |
| +50%         | 1.50      | -2.02  |
| +100%        | 2.00      | -5.72  |
| +200%        | 3.00      | -10.03 |

## Cost Structure

### Gas Costs (Ethereum Mainnet Equivalent)
```
Operation                  Gas Units    @ 10 gwei    @ 30 gwei
----------------------------------------------------------
Remove Liquidity          150,000      $4.50        $13.50
Token Swap                120,000      $3.60        $10.80
Create Position           400,000      $12.00       $36.00
----------------------------------------------------------
Total Rebalance          670,000      $20.10       $60.30
```

### Swap Costs
- **DEX Swap Fee**: 0.05% - 0.3% depending on pool tier
- **Price Impact**: Variable based on liquidity and size
- **Slippage Tolerance**: Typically set to 0.5% - 1%

### Funding Rate Costs (Perpetuals)
- **Average Funding Rate**: 10-20% APY on majors
- **Calculation**: `funding_cost = perp_position * funding_rate * time_period`
- **Payment Frequency**: Every 8 hours on most platforms

## PNL Calculation Formula

### Daily PNL Components
```python
def calculate_daily_pnl(position):
    lp_fees = position.accumulated_fees
    il_realized = position.il_on_rebalance if position.rebalanced else 0
    funding_costs = position.perp_notional * daily_funding_rate
    gas_costs = position.gas_spent_today
    swap_fees = position.swap_volume * pool_fee_rate
    
    daily_pnl = lp_fees - il_realized - funding_costs - gas_costs - swap_fees
    return daily_pnl
```

### Net APY Formula
```python
def calculate_net_apy(position):
    lp_apy = base_pool_apy * concentration_factor
    funding_apy = funding_rate * 365 * hedge_ratio
    
    net_apy = lp_apy - abs(funding_apy)
    return net_apy
```

## Rebalancing Decision Logic

### Rebalance Evaluation
```python
def should_rebalance(position, current_price):
    # Check price drift
    price_drift = abs(current_price - position.center_price) / position.center_price
    if price_drift > 0.03:  # 3%
        return True, "PRICE_DRIFT"
    
    # Check range coverage
    in_range_portion = calculate_in_range_portion(position, current_price)
    if in_range_portion < 0.5:  # 50%
        return True, "RANGE_COVERAGE"
    
    # Check delta drift
    current_delta = calculate_v3_delta(position.L, current_price, position.p_a, position.p_b)
    target_delta = position.initial_delta
    delta_drift = abs(current_delta - target_delta) / abs(target_delta) if target_delta != 0 else 0
    if delta_drift > 0.05:  # 5%
        return True, "DELTA_DRIFT"
    
    # Check if out of range
    if current_price < position.p_a or current_price > position.p_b:
        return True, "OUT_OF_RANGE"
    
    return False, None
```

### Rebalancing Cost-Benefit Analysis
```python
def is_rebalance_profitable(position, days_to_hold=30):
    # Estimate fee improvement
    current_fee_rate = estimate_fee_rate(position, "current")
    optimal_fee_rate = estimate_fee_rate(position, "optimal")
    daily_fee_gain = position.value * (optimal_fee_rate - current_fee_rate) / 365
    
    # Calculate costs
    il_to_realize = calculate_il(position)
    gas_cost = 670000 * gas_price * eth_price / 1e9
    swap_cost = position.rebalance_volume * 0.003  # 0.3% swap fee
    
    total_cost = il_to_realize + gas_cost + swap_cost
    breakeven_days = total_cost / daily_fee_gain if daily_fee_gain > 0 else float('inf')
    
    return breakeven_days < days_to_hold
```

## Yield Targets & Expectations

### Target Returns
- **LP Fee Income**: 15-25% APY (depends on volume/TVL ratio)
- **Funding Rate Cost**: -10% to -20% APY (cost of hedging)
- **Net Target Return**: 15-30% APY without directional risk

### Risk Factors
- **Impermanent Loss**: -2% to -10% depending on volatility
- **Execution Risk**: Slippage and delayed rebalancing
- **Funding Rate Risk**: Can spike during market extremes
- **Gas Cost Risk**: Network congestion can make rebalancing expensive

## Operational Flow

### Position Lifecycle
1. **Initialization**
   - Deploy 2/3 capital to LP (50% HYPE, 50% USDT0)
   - Calculate initial delta
   - Open short perp position with 1/3 capital as margin

2. **Monitoring**
   - Track price movements every 5 seconds
   - Calculate current delta and P&L
   - Check rebalancing triggers

3. **Rebalancing**
   - Burn LP NFT position
   - Collect accumulated fees
   - Swap tokens to achieve 50/50 split at new price
   - Mint new LP position with updated range
   - Adjust perp hedge to match new delta

4. **Exit**
   - Remove liquidity from LP
   - Close perp position
   - Convert all assets to desired token
   - Calculate final P&L

## CoreWriter Integration

### Actions Required
- **Action 7 (UsdClassTransfer)**: Transfer USDC between spot and perp
- **Action 8 (Spot Transfer)**: Transfer spot assets
- **Action 0 (UpdateLeverage)**: Adjust perp position leverage
- **Action 3 (Order)**: Place perp orders for hedging

### Execution Delays
- **CoreWriter Latency**: ~4 seconds from EVM to Core
- **Adjustment Factor**: Add 1-2% buffer to hedge size for volatility during delay

## Monitoring Metrics

### Key Performance Indicators
- **Daily Fee Yield**: LP fees / TVL * 365
- **Funding Rate**: 8-hour funding * 3 * 365
- **Delta Accuracy**: |actual_delta - target_delta| / target_delta
- **IL Realized**: Cumulative IL from all rebalances
- **Net APY**: (Total Returns - All Costs) / Capital * 365

### Alert Thresholds
- **Critical**: Position out of range for >1 hour
- **Warning**: Delta drift >10%
- **Info**: Rebalancing opportunity detected

## Implementation Notes

### Data Sources
- **Price Feed**: HyperSwap pool price or oracle
- **Funding Rate**: HyperCore API or on-chain reader
- **Gas Price**: Network gas oracle
- **Volume Data**: HyperSwap subgraph or API

### Calculation Frequency
- **Delta**: Every block or 5 seconds
- **P&L**: Every minute
- **Rebalance Check**: Every 5 minutes
- **Full Audit**: Daily

This document serves as the complete reference for implementing and operating the delta neutral LP strategy on HYPE/USDT0 pairs.