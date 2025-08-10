# Architecture Changes - Multi-Database & Platform-Aware Monitoring

## Overview

This document explains the recent architectural changes made to the HyperLP application, specifically focusing on:
1. Multi-database architecture separating referrals from monitoring data
2. Platform-aware monitoring for HyperEVM and HyperCore
3. Internal API endpoints for synchronized data collection
4. Cron job orchestration for automated analytics

## 1. Multi-Database Architecture

### Background
Previously, all data (user referrals and monitoring) was stored in a single database. This created scalability and maintenance issues as the two domains have different access patterns and scaling requirements.

### Solution
Split into two separate Neon databases:

#### Referrals Database (`DATABASE_URL_REFERRALS`)
- **Purpose**: Store user and waitlist data
- **Tables**: 
  - `User` - Authentication and profile data
  - `Waitlist` - Early access with referral tracking
- **Client**: `prismaReferrals` from `@/lib/prisma-referrals`
- **Schema**: `prisma/referrals/schema.prisma`

#### Monitoring Database (`DATABASE_URL_MONITORING`)
- **Purpose**: Store LP/Perp/Spot positions and analytics
- **Tables**:
  - `MonitoredAccount` - Accounts being tracked with platform flags
  - `LpPosition` - LP positions on HyperEVM
  - `PerpPosition` - Perpetual positions on HyperCore
  - `SpotBalance` - Spot balances on HyperCore
  - `AccountSnapshot` - 5-minute interval snapshots for charting
- **Client**: `prismaMonitoring` from `@/lib/prisma-monitoring`
- **Schema**: `prisma/monitoring/schema.prisma`

### Benefits
- **Separation of Concerns**: User data isolated from financial monitoring
- **Independent Scaling**: Each database can scale based on its specific needs
- **Security**: User PII separated from trading data
- **Performance**: Optimized queries without cross-domain joins

## 2. Platform-Aware Monitoring

### MonitoredAccount Model Enhancements
```prisma
model MonitoredAccount {
  // Platform flags - track where account has activity
  hasHyperEvm   Boolean  @default(true)  // Has LP positions on HyperEVM
  hasHyperCore  Boolean  @default(true)  // Has perp/spot positions on HyperCore
  
  // Optional: Different addresses per platform
  hyperEvmAddress  String?  // Override address for HyperEVM if different
  hyperCoreAddress String?  // Override address for HyperCore if different
}
```

### Key Concepts
- **Platform Flags**: `hasHyperEvm` and `hasHyperCore` indicate where an account is active
- **Address Overrides**: Support for different addresses on each platform (future-proofing)
- **Selective Syncing**: Only sync data from platforms where account is active

## 3. Internal API Architecture

### API Authentication Middleware
- **Location**: `src/middleware/api-auth.ts`
- **Key**: `INTERNAL_API_KEY` environment variable
- **Header**: `X-API-Key` for authentication
- **Rate Limiting**: Built-in rate limiting per endpoint

### Core Internal Endpoints

#### Analytics Trigger (`/api/internal/analytics/trigger`)
- **Purpose**: Initialize analytics run and return account context
- **Returns**: Account list with platform information
- **Flow**:
  1. Get all active monitored accounts
  2. Determine which platforms each account uses
  3. Return structured data for sync operations

#### Platform Sync Endpoints
1. **HyperEVM LP Sync** (`/api/internal/sync/hyperevm/lp`)
   - Fetches LP positions from Uniswap V3-style DEXs
   - Stores in `LpPosition` table
   - Skips accounts without `hasHyperEvm` flag

2. **HyperCore Perp Sync** (`/api/internal/sync/hypercore/perp`)
   - Fetches perpetual positions from HyperCore API
   - Stores in `PerpPosition` table
   - Tracks HYPE shorts for delta hedging

3. **HyperCore Spot Sync** (`/api/internal/sync/hypercore/spot`)
   - Fetches spot balances from HyperCore
   - Stores in `SpotBalance` table
   - Calculates USD values using price feeds

#### Analytics Run (`/api/internal/analytics/run`)
- **Purpose**: Compute analytics and create snapshots
- **Process**:
  1. Aggregate all position data
  2. Calculate net delta exposure
  3. Compute APRs (LP fees + funding)
  4. Create 5-minute interval snapshots
  5. Clean up old snapshots (retention period)

## 4. Cron Job Orchestration

### API-Based Cron (`cron-pull-and-store-api.ts`)
```typescript
// Execution flow:
1. Trigger Analytics → Get account context
2. Sync Platforms (parallel):
   - HyperEVM LP positions
   - HyperCore Perp positions  
   - HyperCore Spot balances
3. Run Analytics → Create snapshots
```

### Benefits of API-Based Approach
- **Modularity**: Each sync operation is independent
- **Parallelization**: Platform syncs run concurrently
- **Error Isolation**: Failures in one platform don't affect others
- **Monitoring**: Each step can be monitored independently
- **Reusability**: APIs can be called manually for debugging

## 5. Data Flow

### Complete Analytics Pipeline
```
1. Cron Trigger (every 30 minutes)
   ↓
2. Analytics Trigger API
   → Returns accounts with platform flags
   ↓
3. Parallel Platform Syncs
   ├── HyperEVM: Fetch LP positions
   ├── HyperCore: Fetch Perp positions
   └── HyperCore: Fetch Spot balances
   ↓
4. Analytics Computation
   ├── Calculate total values
   ├── Compute net delta
   ├── Calculate APRs
   └── Create snapshots
   ↓
5. Store Results
   └── AccountSnapshot (5-min intervals)
```

### Key Optimizations
- **Selective Syncing**: Only sync active platforms per account
- **Batch Processing**: Process multiple accounts in single API call
- **Parallel Execution**: Platform syncs run concurrently
- **Smart Caching**: 5-minute snapshot intervals reduce storage

## 6. TypeScript & Type Safety

### Prisma Client Separation
- Separate generated clients: `@prisma/client-referrals` and `@prisma/client-monitoring`
- Type-safe imports: `import { Asset } from '@prisma/client-monitoring'`
- Decimal handling: `Prisma.Decimal` for financial precision

### Environment Variables
Updated `t3-env.ts` to validate all new environment variables:
- `DATABASE_URL_REFERRALS` - Referrals database connection
- `DATABASE_URL_MONITORING` - Monitoring database connection
- `INTERNAL_API_KEY` - Internal API authentication
- Inngest configuration variables

## 7. Migration Commands

### Database Operations
```bash
# Generate Prisma clients
pnpm prisma:generate

# Run migrations
pnpm prisma:referrals:migrate
pnpm prisma:monitoring:migrate

# Deploy to production
pnpm prisma:referrals:deploy
pnpm prisma:monitoring:deploy

# Open Prisma Studio
pnpm prisma:referrals:studio     # Port 5555
pnpm prisma:monitoring:studio    # Port 5556
```

## 8. Benefits of New Architecture

1. **Scalability**: Each database can scale independently
2. **Maintainability**: Clear separation of concerns
3. **Performance**: Optimized queries without cross-domain overhead
4. **Flexibility**: Easy to add new platforms or data sources
5. **Monitoring**: Granular tracking of each sync operation
6. **Error Handling**: Failures isolated to specific operations
7. **Development**: Easier to test individual components

## 9. Future Enhancements

1. **Multi-Chain Support**: Add more blockchain platforms
2. **Real-time Updates**: WebSocket connections for live data
3. **Advanced Analytics**: Machine learning for strategy optimization
4. **Automated Rebalancing**: Smart contract integration for auto-rebalancing
5. **User Vaults**: Multi-user vault management with individual tracking