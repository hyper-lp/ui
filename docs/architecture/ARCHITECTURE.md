# HyperLP Architecture Overview

## Core Components

### 1. Position Fetching (`/src/utils/position-fetcher.util.ts`)
- **Purpose**: Optimized blockchain data fetching with multicall batching
- **Key Features**:
  - Reduces RPC calls from 100+ to ~5-10 using multicall3
  - Handles WHYPE/USDT0 positions across multiple DEXs
  - Proper decimal handling (USDT0 has 6 decimals, HYPE has 18)
  - Token price integration

### 2. Main User Interface

#### Account Page (`/src/app/account/[account]/page.tsx`)
- Displays LP positions, spot balances, and perp positions
- Shows token exposures in USD for each LP position
- Links to DEX frontends for position verification
- Works for both monitored and non-monitored accounts

#### Landing Page (`/src/app/page.tsx`)
- APR heatmap visualization
- Waitlist functionality with Twitter authentication

### 3. API Routes

#### Active Routes
- `/api/positions/[account]` - Fetches account positions (LP, spot, perp)
- `/api/waitlist/*` - Handles waitlist join and status
- `/api/users` - User management
- `/api/internal/*` - Internal sync and analytics (for cron jobs)

### 4. Services

#### Core Services
- `position-fetcher.util.ts` - Optimized blockchain data fetching
- `monitor.service.ts` - Account monitoring and position tracking
- `analytics.service.ts` - Metrics calculation and analytics

#### Database Services
- Two Prisma schemas:
  - `prisma/monitoring/` - Position tracking and analytics
  - `prisma/referrals/` - Waitlist and referral system

### 5. Configuration

#### DEX Configuration (`/src/config/hyperevm-dexs.config.ts`)
- Defines supported DEXs (Hyperswap, ProjectX, Hybra)
- Contract addresses and portfolio URLs
- Position manager addresses

#### Token Configuration
- WHYPE: `0x5555555555555555555555555555555555`
- USDT0: `0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb`
- Proper decimal handling (6 for USDT0, 18 for HYPE)

## Data Flow

1. **User requests account page** → 
2. **API checks if account is monitored** →
3. **If not monitored**: Fetch directly from blockchain using `position-fetcher`
4. **If monitored**: Fetch from database (populated by cron jobs)
5. **Return formatted data with USD values**

## Key Optimizations

1. **Multicall Batching**: Groups multiple blockchain calls into single requests
2. **60-second Caching**: Reduces repeated RPC calls
3. **Progressive Loading**: Shows data as it becomes available
4. **Parallel Fetching**: LP and spot balances fetched simultaneously

## Environment Variables Required

```env
# Database
DATABASE_URL_REFERRALS=
DATABASE_URL_MONITORING=

# Authentication
NEXT_PUBLIC_PRIVY_APP_ID=

# RPC (optional, has defaults)
HYPEREVM_RPC_URL=
```

## Common Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build           # Build for production
pnpm lint:fix        # Fix linting issues

# Database
pnpm prisma:studio   # Open Prisma Studio
pnpm db:reset        # Reset database
pnpm db:migrate:prod # Run production migrations

# Monitoring
pnpm monitor         # Run position monitoring
pnpm monitor:status  # Check monitoring status
```

## File Structure

```
src/
├── app/
│   ├── account/[account]/   # Account details page
│   ├── api/                  # API routes
│   └── page.tsx              # Landing page
├── utils/
│   ├── position-fetcher.util.ts  # Optimized blockchain fetching
│   └── uniswap-v3.util.ts       # Uniswap V3 calculations
├── services/
│   ├── monitor.service.ts        # Position monitoring
│   └── analytics.service.ts      # Analytics calculations
└── config/
    └── hyperevm-dexs.config.ts  # DEX configurations
```