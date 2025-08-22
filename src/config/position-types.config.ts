/**
 * Configuration for different position types
 * Controls which position types are enabled and their weights
 */

import type { PositionTypeConfig } from '@/interfaces/position-leg.interface'

/**
 * Position type configurations
 * Add new position types here as they are implemented
 */
export const POSITION_CONFIGS: PositionTypeConfig[] = [
    {
        type: 'lp',
        enabled: true,
        weight: 1 / 3, // 1/3 of deployed capital for LP positions
        displayName: 'Liquidity Pools',
        icon: '💧',
    },
    {
        type: 'hyperdrive',
        enabled: true,
        weight: 1 / 3, // 1/3 of deployed capital for HyperDrive positions
        displayName: 'HyperDrive',
        icon: '🏦',
    },
    // Future position types can be added here:
    // {
    //     type: 'staking',
    //     enabled: false,
    //     weight: 0.5, // Example: 50% allocation when enabled
    //     displayName: 'Staking',
    //     icon: '🔒',
    // },
]

/**
 * Get enabled position types
 */
export function getEnabledPositionTypes(): PositionTypeConfig[] {
    return POSITION_CONFIGS.filter((config) => config.enabled)
}

/**
 * Get total weight of enabled position types
 */
export function getTotalWeight(): number {
    return getEnabledPositionTypes().reduce((sum, config) => sum + config.weight, 0)
}

/**
 * Funding weight (for perps/short leg)
 * This is the complement of the long leg weights
 */
export const FUNDING_WEIGHT = 1 / 3 // 1/3 of deployed capital for perps
