# PnL Implementation Plan

## Overview
This document outlines the implementation plan for comprehensive PnL tracking with separated LP and Perp components for the HyperLP delta-neutral strategy. The implementation will provide clear insights into which parts of the strategy are performing and help optimize the delta-neutral approach.

## Architecture Components

### 1. Data Types & Interfaces (`src/interfaces/pnl.interface.ts`)

**Core Interfaces:**
- `PnlSnapshot`: Main PnL tracking with LP/Perp separation
  - LP components: swap fees earned, unclaimed fees, impermanent loss, rebalancing costs
  - Perp components: funding received/paid, maker/taker fees, unrealized PnL
  - Combined metrics: net PnL, net APR, position values
  
- `RebalanceEvent`: Track individual rebalancing events
  - Trigger reason (price drift, out of range, delta drift, etc.)
  - Before/after position states
  - Costs incurred and expected benefits
  
- `RealtimePnl`: Real-time PnL calculation response
- `PnlHistorical`: Historical PnL data with time series
- `PnlBreakdown`: Detailed component analysis

### 2. PnL Calculation Utilities (`src/utils/pnl-calculator.util.ts`)

**Core Functions (based on PNL-CALCULATIONS.md formulas):**

```typescript
// V3 Position Delta Calculation (lines 62-81)
calculateV3PositionDelta(position: V3Position): PositionDelta

// Impermanent Loss Calculation (lines 91-110)
calculateImpermanentLoss(position: LpPosition, currentPrice: number): number

// Daily/Cumulative PnL (lines 136-157)
calculateDailyPnl(snapshots: PnlSnapshot[]): DailyPnl
calculateCumulativePnl(snapshots: PnlSnapshot[]): CumulativePnl

// Rebalancing Cost-Benefit Analysis (lines 189-205)
calculateRebalanceMetrics(
  currentPosition: Position,
  targetPosition: Position,
  gasCost: number,
  swapFees: number
): RebalanceMetrics

// Complete PnL Calculation
calculateCompletePnl(
  lpPosition: LpPosition,
  perpPosition: PerpPosition,
  priceData: PriceData
): CompletePnl
```

### 3. Database Schema Extensions

**New Tables in `prisma/monitoring/schema.prisma`:**

```prisma
model PnlSnapshot {
  id         String   @id @default(cuid())
  accountId  String
  timestamp  DateTime
  
  // LP PnL Components (USD)
  lpSwapFeesEarned      Decimal
  lpUnclaimedFees       Decimal
  lpImpermanentLoss     Decimal
  lpRebalancingGasCost  Decimal
  lpRebalancingSwapCost Decimal
  lpTotalPnl            Decimal
  
  // Perp PnL Components (USD)
  perpFundingReceived   Decimal
  perpFundingPaid       Decimal
  perpNetFunding        Decimal
  perpMakerFeesEarned   Decimal
  perpTakerFeesPaid     Decimal
  perpUnrealizedPnl     Decimal
  perpTotalPnl          Decimal
  
  // Combined Metrics
  netPnl                Decimal
  netApr                Decimal
  
  // Position Values
  lpPositionValue       Decimal
  perpPositionValue     Decimal
  totalPositionValue    Decimal
}

model RebalanceEvent {
  id                    String   @id @default(cuid())
  accountId             String
  timestamp             DateTime
  triggerReason         String
  
  // Before/After position states
  beforePrice           Decimal
  beforePriceLower      Decimal
  beforePriceUpper      Decimal
  beforeToken0Amount    Decimal
  beforeToken1Amount    Decimal
  beforeDelta           Decimal
  beforeInRange         Boolean
  
  afterPrice            Decimal
  afterPriceLower       Decimal
  afterPriceUpper       Decimal
  afterToken0Amount     Decimal
  afterToken1Amount     Decimal
  afterDelta            Decimal
  afterInRange          Boolean
  
  // Costs & Benefits
  gasCost               Decimal
  swapFees              Decimal
  impermanentLossRealized Decimal
  totalCost             Decimal
  expectedDailyFeeGain  Decimal
  breakEvenDays         Decimal
}
```

### 4. API Endpoints

**Endpoints to implement:**

- **`/api/pnl/realtime`** (GET)
  - Real-time PnL calculation for active positions
  - Parameters: `accountId`
  - Returns: Current PnL with LP/Perp breakdown
  
- **`/api/pnl/historical`** (GET)
  - Historical PnL data with time series
  - Parameters: `accountId`, `period` (1h, 24h, 7d, 30d, all)
  - Returns: Array of PnL snapshots over time
  
- **`/api/pnl/breakdown`** (GET)
  - Detailed component analysis at specific timestamp
  - Parameters: `accountId`, `timestamp`
  - Returns: Complete breakdown of all PnL components

- **`/api/pnl/rebalance-history`** (GET)
  - Rebalancing event history
  - Parameters: `accountId`, `limit`, `offset`
  - Returns: Array of rebalance events with costs/benefits

### 5. React Components

**Chart Components:**

- **`PnLBreakdownChart`** (`src/components/charts/PnLBreakdownChart.tsx`)
  - Stacked bar chart showing LP vs Perp PnL over time
  - Color coding: green for positive, red for negative components
  - Interactive tooltips with detailed breakdown
  - Time period selector (1D, 1W, 1M, 3M, ALL)

- **`CumulativePnLChart`** (`src/components/charts/CumulativePnLChart.tsx`)
  - Line chart with separate LP and Perp lines
  - Shows cumulative PnL over time
  - Shaded area between lines
  - Annotations for major rebalancing events

- **`PnLMetricsCard`** (`src/components/pnl/PnLMetricsCard.tsx`)
  - Real-time PnL display card
  - Green/red indicators for profit/loss
  - Breakdown percentages for each component
  - Sparkline for recent trend

**Additional Components:**

- **`RebalanceHistoryTable`** (`src/components/tables/RebalanceHistoryTable.tsx`)
  - Table showing rebalancing events
  - Columns: timestamp, trigger, cost, expected benefit, break-even
  - Sortable and filterable

- **`PnLSummaryPanel`** (`src/components/pnl/PnLSummaryPanel.tsx`)
  - Summary statistics panel
  - Shows: total PnL, best day, worst day, average daily
  - LP vs Perp contribution percentages

### 6. Integration Points

**Account Page Integration (`src/app/account/[address]/page.tsx`):**

1. Add PnL tracking section below existing metrics
2. Include tabs for different views:
   - Overview: PnLMetricsCard + summary stats
   - Breakdown: PnLBreakdownChart
   - Cumulative: CumulativePnLChart
   - Rebalance History: RebalanceHistoryTable

3. Real-time updates using WebSocket or polling
4. Export functionality for PnL data (CSV/JSON)

**Dashboard Integration:**
- Add PnL widget to main dashboard
- Show aggregate PnL across all monitored accounts
- Top performers/underperformers by PnL

### 7. Data Flow

```
1. Data Collection:
   - Cron job fetches LP position data from DEX
   - Cron job fetches perp position data from Hyperliquid
   - Calculate PnL components using utility functions
   - Store snapshot in database

2. Real-time Calculation:
   - API endpoint fetches latest position data
   - Calculate current PnL using utility functions
   - Return real-time PnL without storing

3. Historical Analysis:
   - Query stored snapshots from database
   - Aggregate and transform data as needed
   - Return formatted historical data

4. Visualization:
   - Components fetch data from API endpoints
   - Process data for chart formatting
   - Render interactive visualizations
```

### 8. Implementation Phases

**Phase 1: Foundation (Priority 1)**
- Create interfaces and types
- Implement PnL calculation utilities
- Extend database schema
- Create migration scripts

**Phase 2: Data Collection (Priority 2)**
- Implement data collection cron jobs
- Create PnL snapshot storage logic
- Test calculation accuracy

**Phase 3: API Layer (Priority 3)**
- Implement all API endpoints
- Add authentication and rate limiting
- Create API documentation

**Phase 4: Visualization (Priority 4)**
- Build chart components
- Create PnL metrics cards
- Implement rebalance history table

**Phase 5: Integration (Priority 5)**
- Integrate into account page
- Add to dashboard
- Implement real-time updates

**Phase 6: Polish (Priority 6)**
- Add export functionality
- Optimize performance
- Add comprehensive tooltips
- Mobile responsiveness

### 9. Testing Strategy

**Unit Tests:**
- PnL calculation functions
- Data transformation utilities
- API endpoint logic

**Integration Tests:**
- Database operations
- API endpoint responses
- Component data fetching

**E2E Tests:**
- Complete PnL tracking flow
- Chart interactions
- Data export functionality

### 10. Performance Considerations

- Index database queries on accountId + timestamp
- Implement data aggregation for long time periods
- Cache frequently accessed calculations
- Use React Query for client-side caching
- Lazy load chart components
- Optimize bundle size for chart libraries

### 11. Future Enhancements

- Machine learning for PnL prediction
- Automated rebalancing recommendations
- Risk-adjusted PnL metrics (Sharpe ratio, etc.)
- Comparative analysis between accounts
- Alert system for PnL thresholds
- Integration with tax reporting tools