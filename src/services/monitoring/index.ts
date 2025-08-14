/**
 * Monitor Services Index
 *
 * Centralized export for all monitor services following consistent architecture:
 * - Each monitor handles a specific data source (HyperEVM LP, HyperCore Perp, etc.)
 * - All monitors follow the same interface pattern for consistency
 * - Services are numbered by execution priority/dependency order
 */

export { hyperEvmBalanceMonitor } from './hyperevm-balance.monitor'
export { hyperCoreSpotMonitor } from './hypercore-spot.monitor'
export { lpMonitorService } from './hyperevm-lp.monitor'
export { perpMonitorService } from './hypercore-perp.monitor'

// Re-export types if needed
export type { HyperEvmBalanceMonitor } from './hyperevm-balance.monitor'
export type { HyperCoreSpotMonitor } from './hypercore-spot.monitor'
export type { LPMonitorService } from './hyperevm-lp.monitor'
export type { PerpMonitorService } from './hypercore-perp.monitor'
