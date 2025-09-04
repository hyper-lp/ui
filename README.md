# HyperLP - Delta-Neutral LP Vault on Hyperliquid

> **⚠️ VISION DOCUMENT**  
> Iterating since HyperLiquid Hackathon (Aug 2024)

## The Problem

Managing yield strategies on HyperEVM requires 7+ manual steps:

1. Monitor multiple LP pool APRs across DEXs
2. Calculate position sizes considering gas costs
3. Bridge assets between chains/venues
4. Deploy liquidity manually on each DEX
5. Open corresponding short positions for hedging
6. Monitor delta drift and funding rates
7. Rebalance positions when markets move

**Result**: Gas costs and operational overhead eat into profits. Small positions become unviable.

## The Solution

**1-click deposit → Automated hedging → Higher yield**

HyperLP handles:

- Automated LP deployment across multiple HyperEVM DEXs
- Real-time delta-neutral hedging via HyperCore perps
- Dynamic rebalancing based on market conditions
- Gas optimization through batched operations
- Position monitoring

## How It Works

### Core Mechanism

1. **Users deposit** HYPE or USDT0 into the vault
2. **Smart contracts automatically**:
    - Deploy liquidity to high-yield pools (Hyperswap, ProjectX)
    - Open corresponding short perpetuals on HyperCore for delta neutrality
    - Maintain 2-5% spread over base lending rates
3. **Yield sources**:
    - LP trading fees (0.05-0.3% per trade)
    - Positive funding rates from shorts
    - DEX incentive programs and points
    - Protocol revenue sharing

### Technical Architecture

- **ERC-7540 Standard**: Tokenized vault interface
- **Multi-DEX Integration**: Routes across HyperEVM DEXs
- **Automated Keeper Network**: 24/7 position monitoring and rebalancing
- **Risk Management**: Limits on leverage, slippage, and position concentration

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS
- **Backend**: PostgreSQL, Prisma ORM, Inngest (cron jobs)
- **Blockchain**: Viem, ERC-7540 vaults, HyperEVM
- **Analytics**: ECharts, TanStack Query

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL (3 instances for different services)
- pnpm package manager

### Quick Start

```bash
# Clone and install
git clone <repository-url>
cd hyper-lp/ui
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Setup database
pnpm prisma:generate
pnpm prisma:deploy

# Start development
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Environment Variables

- See `.env.example` for complete list

## Community

- Twitter: [@HyperLP](https://x.com/HyperLPxyz)
- Documentation: [docs.hyperlp.xyz](https://www.notion.so/HyperLP-Docs-254bbbfcdd3780fb9d0cd5bfbab131f2)

---

Built with ❤️ for the Hyperliquid ecosystem
