/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */

let PrismaClient: any

try {
    // Use require to avoid build-time issues
    const prismaModule = require('@/generated/prisma-monitoring')
    PrismaClient = prismaModule.PrismaClient
} catch (error) {
    console.error('Failed to load Prisma monitoring client:', error)
    // Create a mock client for development
    PrismaClient = class {
        apiUser = {
            upsert: async () => ({}),
            create: async () => ({}),
            findMany: async () => [],
        }
        accountSnapshot = {
            create: async () => ({}),
            findMany: async () => [],
            findFirst: async () => null,
        }
        $disconnect = async () => {}
    }
}

const globalForPrisma = globalThis as unknown as {
    prismaMonitoring: any
}

export const prismaMonitoring =
    globalForPrisma.prismaMonitoring ??
    new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL_MONITORING,
    })

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prismaMonitoring = prismaMonitoring
}
