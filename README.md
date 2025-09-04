# HyperLP - Delta-Neutral LP Vault on Hyperliquid

A Next.js application for managing delta-neutral liquidity positions on Hyperliquid's HyperEVM ecosystem.

## Overview

HyperLP is a delta-neutral LP vault that allows users to deposit assets (HYPE or USDT0) and earn yield from:
- LP fees on HyperEVM DEXs (e.g., Hyperswap)
- Perpetual funding rates (when positive)
- Protocol incentives and points

The vault maintains delta neutrality by hedging volatile positions with short perpetuals on HyperCore.

## Features

- 📊 **APR Heatmap**: Interactive visualization of potential yields
- 📈 **Performance Tracking**: Real-time delta tracking and rebalance monitoring
- 💼 **Portfolio Dashboard**: Comprehensive view of LP positions, perps, and wallet balances
- 🔐 **Secure Authentication**: Twitter-based waitlist via Privy
- 🌙 **Dark Mode**: Full theme support with system preference detection
- 📱 **Responsive Design**: Optimized for desktop and mobile

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Charts**: ECharts
- **Authentication**: Privy
- **Web3**: Viem

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL databases (3 instances for referrals, monitoring, and keeper)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hyper-lp/ui
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
- Database URLs for referrals, monitoring, and keeper databases
- Privy app credentials
- Explorer API keys
- Other service credentials

4. Generate Prisma clients:
```bash
pnpm prisma:generate
```

5. Run database migrations:
```bash
pnpm prisma:deploy
```

6. Start the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/              # Next.js App Router pages and API routes
├── components/       # React components
│   ├── app/         # Application-specific components
│   ├── charts/      # Chart components
│   ├── common/      # Shared UI components
│   └── modals/      # Modal components
├── config/          # Configuration files
├── contracts/       # Smart contract ABIs
├── crons/          # Scheduled tasks (Inngest)
├── enums/          # TypeScript enums
├── hooks/          # Custom React hooks
├── interfaces/     # TypeScript interfaces
├── lib/            # External library configurations
├── middleware/     # API middleware
├── providers/      # React context providers
├── services/       # Business logic and API services
├── stores/         # Zustand state stores
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Available Scripts

```bash
pnpm dev              # Start development server
pnpm build           # Build for production
pnpm start           # Start production server
pnpm lint            # Run ESLint
pnpm lint:fix        # Fix linting issues
pnpm prisma:generate # Generate Prisma clients
pnpm prisma:studio   # Open Prisma Studio
pnpm db:setup        # Initial database setup
```

## Environment Variables

Key environment variables required:

- `DATABASE_URL_REFERRALS`: PostgreSQL URL for waitlist/users
- `DATABASE_URL_MONITORING`: PostgreSQL URL for position tracking
- `DATABASE_URL_KEEPER`: PostgreSQL URL for keeper operations
- `NEXT_PUBLIC_PRIVY_APP_ID`: Privy application ID
- `PRIVY_APP_SECRET`: Privy secret key
- `HYPEREVM_SCAN_API_KEY`: HyperEVM explorer API key

See `.env.example` for the complete list.

## Development

### Code Quality

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks (if configured)

Run `pnpm lint:fix` to automatically fix formatting issues.

### Database Management

The project uses three separate Prisma schemas:
- `prisma/referrals`: User and waitlist management
- `prisma/monitoring`: Position and snapshot tracking
- `prisma/keeper`: Automated keeper operations

Use `pnpm prisma:studio` to browse database contents.

## Production Deployment

1. Build the application:
```bash
pnpm build
```

2. The build output will be optimized and ready for deployment
3. Deploy to Vercel, Railway, or any Node.js hosting platform
4. Ensure all environment variables are properly configured

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[License Type] - See LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub or contact the team.