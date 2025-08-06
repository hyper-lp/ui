# Next.js 15 Boilerplate with Privy Twitter Waitlist

A modern, production-ready boilerplate for building web applications with Next.js 15, TypeScript, Tailwind CSS, and Prisma. Includes Twitter authentication via Privy for waitlist functionality.

## Features

- ⚡️ **Next.js 15** with App Router
- 🎨 **Tailwind CSS** for styling
- 📝 **TypeScript** for type safety
- 🗄️ **Prisma** ORM with PostgreSQL
- 🔄 **TanStack Query** for data fetching
- 🐻 **Zustand** for state management
- 🔐 **Privy** authentication with Twitter
- 📋 **Waitlist** system with Twitter verification
- 🌙 **Dark mode** support
- 📱 **Responsive** design
- 🚀 **Production ready**

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
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

Update the `.env` file with your database URL and other configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_PRIVY_APP_ID="your-privy-app-id"
```

**Note**: For testing, you can use Privy's test App ID: `clpispdty00ycl80fpueukbhl`

4. Set up the database:
```bash
pnpm prisma generate
pnpm prisma migrate dev
```

5. Start the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## Project Structure

```
src/
├── app/              # Next.js App Router pages and API routes
├── components/       # React components
├── config/          # Configuration files
├── enums/           # TypeScript enums
├── hooks/           # Custom React hooks
├── interfaces/      # TypeScript interfaces
├── lib/             # External library configurations
├── providers/       # React context providers
├── queries/         # Data fetching functions
├── services/        # Business logic
├── stores/          # State management
├── types/           # TypeScript types
└── utils/           # Utility functions
```

## Available Scripts

```bash
pnpm dev              # Start development server
pnpm build           # Build for production
pnpm start           # Start production server
pnpm lint            # Run ESLint
pnpm format          # Format code with Prettier
pnpm prisma generate # Generate Prisma client
pnpm prisma migrate  # Run database migrations
pnpm prisma studio   # Open Prisma Studio
```

## Technologies

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Prisma](https://www.prisma.io/) - Database ORM
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [nuqs](https://nuqs.47ng.com/) - URL state management
- [Privy](https://www.privy.io/) - Web3 and social authentication

## Customization

### Colors

Edit the color palette in `tailwind.config.ts` and `src/app/globals.css`:

- `primary` - Main brand color
- `accent` - Secondary color
- `milk` - Neutral colors
- `background` - Background color

### Database Schema

Modify the Prisma schema in `prisma/schema.prisma` to add your own models.

### Components

The boilerplate includes basic components:
- `Header` - Navigation header
- `Footer` - Page footer
- `Dashboard` - Example dashboard component
- `WaitlistButton` - Twitter authentication button
- `WaitlistForm` - Waitlist submission form

### Privy Configuration

To set up your own Privy app:

1. Create an account at [privy.io](https://privy.io)
2. Create a new app in the Privy dashboard
3. Enable Twitter as a login method
4. Copy your App ID and add it to `.env`
5. Configure allowed redirect URLs for your domain

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.