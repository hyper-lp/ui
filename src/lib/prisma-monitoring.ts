import { PrismaClient } from '@/generated/prisma-monitoring'

const globalForPrisma = globalThis as unknown as {
    prismaMonitoring: PrismaClient | undefined
}

export const prismaMonitoring = globalForPrisma.prismaMonitoring ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prismaMonitoring = prismaMonitoring
}
