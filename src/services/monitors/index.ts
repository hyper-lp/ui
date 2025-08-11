/**
 * Monitor Services Index
 *
 * Centralized export for all monitor services following consistent architecture:
 * - Each monitor handles a specific data source (HyperEVM LP, HyperCore Perp, etc.)
 * - All monitors follow the same interface pattern for consistency
 * - Services are numbered by execution priority/dependency order
 */

export { hyperEvmBalanceMonitor } from './01-hyperevm-balance-monitor.service'
export { hyperCoreSpotMonitor } from './02-hypercore-spot-monitor.service'
export { lpMonitorService } from './03-hyperevm-lp-monitor.service'
export { perpMonitorService } from './04-hypercore-perp-monitor.service'

// Re-export types if needed
export type { HyperEvmBalanceMonitor } from './01-hyperevm-balance-monitor.service'
export type { HyperCoreSpotMonitor } from './02-hypercore-spot-monitor.service'
export type { LPMonitorService } from './03-hyperevm-lp-monitor.service'
export type { PerpMonitorService } from './04-hypercore-perp-monitor.service'
