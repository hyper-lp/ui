# LP Position Indexing & P&L History Implementation Guide

## Overview
This document outlines the implementation strategy for indexing ALL LP positions across HyperEVM DEXs to provide historical P&L tracking as a paid service.

## 1. Indexing Solutions Comparison

### Option A: Goldsky
- **Pros:**
  - Native HyperEVM support (chain slug: "hyperevm")
  - GraphQL subgraph deployment
  - Free tier: 1M events/month, 730 worker hours
  - Well-documented, mature platform
- **Cons:**
  - Costs ~$1 per million events after free tier
  - Worker hour costs accumulate ($0.10/hour per subgraph)
- **Best for:** Small-scale MVPs, <1M events/month

### Option B: Envio HyperIndex
- **Pros:**
  - 100x faster sync (5,000+ events/second)
  - Free development tier with generous limits
  - Self-hosting option available
  - 20% discount for annual commitments
- **Cons:**
  - Newer platform, less documentation
  - Production pricing less transparent
- **Best for:** Large-scale production, historical backfills

**Recommendation:** Start with Envio for cost-effectiveness and speed.

## 2. Storage Cost Analysis

### Data Volume Estimates
```
Per LP Event: ~400 bytes
Events per active user: 50-200/month
10,000 users: 1-2M events/month
Monthly storage: ~800MB raw data
Annual storage: ~10GB + indexes
```

### AWS RDS PostgreSQL Costs
```
Storage (gp3 SSD): $0.115/GB/month
100GB database: ~$11.50/month
db.t3.micro instance: ~$15/month
Backup storage: $0.095/GB/month
Total: ~$30-50/month for small deployment
```

### Alternative: Aurora Serverless
- Pay-per-request: $0.12 per million requests
- Storage: $0.10/GB/month
- Better for variable/unpredictable load

## 3. User Payment System

### Smart Contract Design
```solidity
// Subscription tiers (in HYPE)
BASIC: 1 HYPE/month (30-day history)
PRO: 3 HYPE/month (full history + analytics)
ENTERPRISE: 10 HYPE/month (API access + priority)

// 20% discount for annual subscriptions
```

### Revenue Model
```
Target: 1,000 basic + 200 pro + 10 enterprise users
Monthly revenue: ~1,700 HYPE ($76,500 at $45/HYPE)
Operating costs: ~$150/month
Profit margin: 99.8%
```

## 4. Technical Architecture

### Database Schema
```sql
-- Core event storage
CREATE TABLE lp_events (
    id SERIAL PRIMARY KEY,
    user_address VARCHAR(42) INDEXED,
    dex VARCHAR(50),
    pool_address VARCHAR(42),
    token_id BIGINT,
    event_type VARCHAR(20), -- mint, burn, collect, swap
    token0_amount DECIMAL(36,18),
    token1_amount DECIMAL(36,18),
    token0_symbol VARCHAR(20),
    token1_symbol VARCHAR(20),
    tick_lower INT,
    tick_upper INT,
    liquidity DECIMAL(36,0),
    fee_tier INT,
    timestamp TIMESTAMP,
    block_number BIGINT,
    tx_hash VARCHAR(66),
    gas_used BIGINT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- P&L snapshots (daily aggregates)
CREATE TABLE pnl_snapshots (
    user_address VARCHAR(42),
    date DATE,
    total_value_usd DECIMAL(20,2),
    fees_earned_usd DECIMAL(20,2),
    il_usd DECIMAL(20,2), -- impermanent loss
    gas_spent_usd DECIMAL(20,2),
    net_pnl_usd DECIMAL(20,2),
    position_count INT,
    PRIMARY KEY(user_address, date)
);

-- User subscriptions (cached from blockchain)
CREATE TABLE user_subscriptions (
    address VARCHAR(42) PRIMARY KEY,
    tier VARCHAR(20),
    expiry TIMESTAMP,
    last_checked TIMESTAMP,
    total_paid_hype DECIMAL(20,2)
);

-- Position performance metrics
CREATE TABLE position_metrics (
    position_id VARCHAR(100) PRIMARY KEY, -- dex_tokenId
    user_address VARCHAR(42),
    total_fees_earned_usd DECIMAL(20,2),
    total_il_usd DECIMAL(20,2),
    apr_7d DECIMAL(10,2),
    apr_30d DECIMAL(10,2),
    last_updated TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_lp_events_user_timestamp ON lp_events(user_address, timestamp DESC);
CREATE INDEX idx_lp_events_pool ON lp_events(pool_address, timestamp DESC);
CREATE INDEX idx_pnl_user_date ON pnl_snapshots(user_address, date DESC);
```

### API Endpoints
```typescript
// Check subscription status
GET /api/subscription/:address
Response: { tier, expiry, isActive }

// Get P&L history (requires active subscription)
GET /api/pnl/:address?from=2024-01-01&to=2024-12-31
Response: { daily: [...], summary: { totalPnL, totalFees, totalIL } }

// Get position details
GET /api/positions/:address/:tokenId
Response: { events: [...], performance: { ... } }

// Export data
GET /api/export/:address?format=csv
Response: CSV file download
```

## 5. Indexer Configuration

### Envio Setup
```yaml
# envio.yaml
name: hyperevm-lp-indexer
version: 1.0.0

networks:
  - id: hyperevm
    rpc_url: https://api.hyperevm.com/rpc
    start_block: 0
    
contracts:
  # Hyperswap V3
  - name: HyperswapV3Pool
    address: "*" # Index all pools
    abi: ./abis/UniswapV3Pool.json
    events:
      - Mint
      - Burn
      - Swap
      - Collect
      
  # ProjectX V3  
  - name: ProjectXV3Pool
    address: "*"
    abi: ./abis/UniswapV3Pool.json
    events:
      - Mint
      - Burn
      - Swap
      - Collect

handlers:
  - event: Mint
    handler: handleMint
  - event: Burn  
    handler: handleBurn
  - event: Swap
    handler: handleSwap
  - event: Collect
    handler: handleCollect
```

### Event Processing
```typescript
// Process mint event
async function handleMint(event: MintEvent) {
  await db.insert('lp_events', {
    user_address: event.owner,
    dex: getDexFromPool(event.address),
    pool_address: event.address,
    event_type: 'mint',
    token0_amount: event.amount0,
    token1_amount: event.amount1,
    tick_lower: event.tickLower,
    tick_upper: event.tickUpper,
    liquidity: event.liquidity,
    timestamp: event.timestamp,
    block_number: event.blockNumber,
    tx_hash: event.transactionHash
  });
  
  // Update P&L snapshot
  await updatePnLSnapshot(event.owner, event.timestamp);
}
```

## 6. Implementation Phases

### Phase 1: MVP (Week 1-2)
- [ ] Deploy subscription smart contract
- [ ] Set up Envio indexer for top 3 DEXs
- [ ] Create PostgreSQL schema
- [ ] Basic API with subscription check
- [ ] Simple P&L calculation

### Phase 2: Full Indexing (Week 3-4)
- [ ] Index all HyperEVM DEXs
- [ ] Historical backfill of all events
- [ ] Impermanent loss calculation
- [ ] Fee tracking and APR metrics
- [ ] CSV export functionality

### Phase 3: Analytics Dashboard (Month 2)
- [ ] React dashboard for P&L visualization
- [ ] Real-time position tracking
- [ ] Performance vs HODL comparison
- [ ] Tax reporting features
- [ ] Multi-wallet portfolio view

### Phase 4: Advanced Features (Month 3)
- [ ] Strategy backtesting
- [ ] Automated rebalancing alerts
- [ ] Integration with tax software
- [ ] API for third-party apps
- [ ] Mobile app

## 7. Cost-Benefit Analysis

### Monthly Costs
```
Indexing (Envio): $50-100
Database (AWS RDS): $50
API hosting (Vercel): $20
Total: ~$120-170/month
```

### Break-even Analysis
```
At $120/month costs:
Need 3 HYPE/month revenue
= 3 basic users or 1 pro user
Very achievable with 10,000+ LP users on HyperEVM
```

### Competitive Advantages
1. **First-mover:** No existing P&L tracker for HyperEVM
2. **Network effects:** Historical data becomes more valuable over time
3. **Low costs:** Efficient indexing keeps margins high
4. **Sticky product:** Users need continuous access for tax reporting

## 8. Security Considerations

### Smart Contract
- Audit subscription contract before mainnet
- Use OpenZeppelin libraries for standard functions
- Implement emergency pause mechanism
- Multi-sig treasury for fee collection

### Backend
- Rate limiting on API endpoints
- Subscription verification caching (5 min TTL)
- Database encryption at rest
- Regular backups to S3
- GDPR compliance for EU users

## 9. Marketing Strategy

### Launch Plan
1. **Beta (Month 1):** Free access for first 100 users
2. **Soft Launch (Month 2):** 50% discount for early adopters
3. **Full Launch (Month 3):** Standard pricing

### User Acquisition
- Partner with HyperEVM DEXs for integration
- Twitter threads about LP strategies with P&L data
- Discord bots for position tracking
- Referral program (1 month free per referral)

## 10. Future Expansions

### Additional Chains
- Arbitrum ($5 HYPE/month add-on)
- Base ($5 HYPE/month add-on)
- Ethereum mainnet ($10 HYPE/month add-on)

### Advanced Features
- AI-powered strategy recommendations
- Automated position management
- Cross-chain portfolio tracking
- DeFi insurance integration

## Contact & Resources

- Goldsky Docs: https://docs.goldsky.com/chains/hyperevm
- Envio Docs: https://docs.envio.dev/
- HyperEVM RPC: https://api.hyperevm.com/rpc
- AWS Calculator: https://calculator.aws/

## Notes

- Start with Envio for cost-effectiveness
- Focus on UX - make it dead simple to subscribe
- Build moat with historical data accumulation
- Consider open-sourcing indexer code for transparency