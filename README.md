# P2P Hedge Lending

> **⚠️ VISION DOCUMENT** - Iterating since HyperLiquid Community Hackathon (Aug 2024)

## Problem

7 manual steps to hedge HyperEVM yields. Gas costs eat profits.

## Solution

1-click deposit → instant hedge

## How

- HyperLP lends USDC at rate + 2-5% spread
- Smart contract opens/manages shorts automatically
- ERC7540 standard

## Use Cases

- Delta-neutral HYPE/BTC/ETH
- Cross-hedge (BTC vs NASDAQ)
- Institutional event hedging

## Stack

Next.js 15 / TypeScript / PostgreSQL / Prisma / ERC7540 / Viem

## Setup

```bash
pnpm install
cp .env.example .env
pnpm prisma:generate
pnpm prisma:deploy
pnpm dev
```

Required: PostgreSQL, Node 18+

## Features

- APR heatmap
- Auto-rebalancing
- P&L breakdown (funding, fees, IL)
- Multi-DEX (Hyperswap, ProjectX, Hybra)
