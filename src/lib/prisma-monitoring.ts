import { PrismaClient } from '@/lib/prisma-monitoring-client'

const globalForPrisma = global as unknown as {
    prismaMonitoring: PrismaClient | undefined
}

export const prismaMonitoring = globalForPrisma.prismaMonitoring ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prismaMonitoring = prismaMonitoring
}
