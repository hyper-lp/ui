# Multiple Databases Setup with Next.js and Prisma

## Overview

This project uses multiple Prisma clients to connect to separate databases - one for referrals and one for monitoring data. This setup follows Prisma's recommended approach for multi-database architectures in Next.js applications.

## Key Configuration

### 1. Schema Files with Custom Output Paths

Each database has its own Prisma schema with a custom output directory inside the `src/generated` folder to ensure proper bundling on Vercel:

**prisma/monitoring/schema.prisma:**
```prisma
generator client {
  provider      = "prisma-client-js"
  output        = "../../src/generated/prisma-monitoring"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL_MONITORING")
}
```

**prisma/referrals/schema.prisma:**
```prisma
generator client {
  provider      = "prisma-client-js"
  output        = "../../src/generated/prisma-referrals"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL_REFERRALS")
}
```

### 2. Prisma Client Instances

Each database has a dedicated Prisma client instance with singleton pattern to prevent multiple connections:

**src/lib/prisma-monitoring.ts:**
```typescript
import { PrismaClient } from '@/generated/prisma-monitoring'

const globalForPrisma = globalThis as unknown as {
    prismaMonitoring: PrismaClient | undefined
}

export const prismaMonitoring = globalForPrisma.prismaMonitoring ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prismaMonitoring = prismaMonitoring
}
```

**src/lib/prisma-referrals.ts:**
```typescript
import { PrismaClient } from '@/generated/prisma-referrals'

const globalForPrisma = globalThis as unknown as {
    prismaReferrals: PrismaClient | undefined
}

export const prismaReferrals = globalForPrisma.prismaReferrals ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prismaReferrals = prismaReferrals
}
```

### 3. Environment Variables

Each database uses a separate connection string:

```env
DATABASE_URL_MONITORING="postgresql://..."
DATABASE_URL_REFERRALS="postgresql://..."
```

### 4. Package.json Scripts

Helper scripts for managing both databases:

```json
{
  "scripts": {
    "postinstall": "pnpm prisma:generate",
    "prisma:referrals:generate": "prisma generate --schema=./prisma/referrals/schema.prisma",
    "prisma:monitoring:generate": "prisma generate --schema=./prisma/monitoring/schema.prisma",
    "prisma:generate": "pnpm prisma:referrals:generate && pnpm prisma:monitoring:generate",
    "prisma:referrals:migrate": "prisma migrate dev --schema=./prisma/referrals/schema.prisma",
    "prisma:monitoring:migrate": "prisma migrate dev --schema=./prisma/monitoring/schema.prisma",
    "prisma:referrals:deploy": "prisma migrate deploy --schema=./prisma/referrals/schema.prisma",
    "prisma:monitoring:deploy": "prisma migrate deploy --schema=./prisma/monitoring/schema.prisma",
    "prisma:deploy": "pnpm prisma:referrals:deploy && pnpm prisma:monitoring:deploy",
    "vercel-build": "pnpm prisma:generate && pnpm prisma:deploy && export NEXT_PUBLIC_COMMIT_TIMESTAMP=$(git log -1 --format=%ct) && next build"
  }
}
```

## Important Considerations for Vercel Deployment

### Binary Targets
The `binaryTargets = ["native", "rhel-openssl-3.0.x"]` configuration is essential for Vercel deployment. The `rhel-openssl-3.0.x` target ensures the Prisma query engine works on Vercel's runtime environment.

### Output Directory Location
The generated Prisma clients MUST be placed inside the `src` directory (e.g., `src/generated/`) rather than `node_modules`. This ensures Next.js properly bundles the query engine files during the build process.

### Build Process
The `vercel-build` script ensures that:
1. Prisma clients are generated with the correct binary targets
2. Database migrations are deployed
3. The Next.js application is built with all necessary files

## Usage in Application Code

Import the appropriate Prisma client for each database:

```typescript
import { prismaMonitoring } from '@/lib/prisma-monitoring'
import { prismaReferrals } from '@/lib/prisma-referrals'

// Use monitoring database
const accounts = await prismaMonitoring.monitoredAccount.findMany()

// Use referrals database  
const waitlist = await prismaReferrals.waitlist.findMany()
```

Import types from the generated clients:

```typescript
import type { MonitoredAccount } from '@/generated/prisma-monitoring'
import type { Waitlist } from '@/generated/prisma-referrals'
```

## Troubleshooting

### Query Engine Not Found Error on Vercel

If you encounter "Prisma Client could not locate the Query Engine" errors:

1. Ensure output paths are inside `src/generated/` directory
2. Verify `binaryTargets` includes `"rhel-openssl-3.0.x"`
3. Check that `postinstall` script runs `prisma:generate`
4. Confirm all import paths use `@/generated/prisma-*` instead of `@prisma/client-*`

### Development Tips

- Use `pnpm prisma:referrals:studio` and `pnpm prisma:monitoring:studio` to open Prisma Studio for each database
- Run `pnpm prisma:generate` after any schema changes
- Use `pnpm prisma:migrate` to create and apply migrations in development
- Use `pnpm prisma:deploy` to apply migrations in production

## References

- [Prisma: Multiple databases in a single app](https://www.prisma.io/docs/guides/database/multi-database)
- [Next.js + Prisma deployment on Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)