import { PrismaClient as MonitoringClient } from './prisma-monitoring-client'

// Create separate Prisma client instance for monitoring
let monitoringClient: MonitoringClient | null = null

function getMonitoringClient() {
    if (!monitoringClient) {
        monitoringClient = new MonitoringClient()
    }
    return monitoringClient
}

export const prismaMonitoring = getMonitoringClient()
