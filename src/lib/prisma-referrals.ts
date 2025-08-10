import { PrismaClient } from '@/generated/prisma-referrals'

const globalForPrisma = globalThis as unknown as {
    prismaReferrals: PrismaClient | undefined
}

export const prismaReferrals = globalForPrisma.prismaReferrals ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prismaReferrals = prismaReferrals
}
