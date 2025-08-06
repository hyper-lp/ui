/**
 * Utility functions for generating and formatting heatmap data
 * Separates business logic from UI components (SOC principle)
 */

import numeral from 'numeral'

interface HeatmapDataConfig {
    showNegativeFunding?: boolean
    lpStepSize?: number
    fundingStepSize?: number
}

interface HeatmapDataResult {
    data: number[][]
    lpSteps: number
    fundingSteps: number
    minFunding: number
    xAxisLabels: string[]
    yAxisLabels: string[]
}

/**
 * Generate heatmap data based on LP and funding APR parameters
 * @param config - Configuration for data generation
 * @returns Generated heatmap data and axis labels
 */
export function generateHeatmapData(config: HeatmapDataConfig = {}): HeatmapDataResult {
    const { showNegativeFunding = false, lpStepSize = 10, fundingStepSize = 5 } = config

    const data: number[][] = []
    const maxLpApr = 100
    const maxFundingApr = 50
    const minFunding = showNegativeFunding ? -20 : 0

    const lpSteps = Math.floor(maxLpApr / lpStepSize) + 1
    const fundingSteps = Math.floor((maxFundingApr - minFunding) / fundingStepSize) + 1

    // Generate data points
    for (let i = 0; i < lpSteps; i++) {
        for (let j = 0; j < fundingSteps; j++) {
            const lpApr = i * lpStepSize
            const fundingApr = minFunding + j * fundingStepSize
            const netApr = calculateNetApr(lpApr, fundingApr)
            data.push([i, j, Math.round(netApr)])
        }
    }

    // Generate axis labels
    const xAxisLabels = Array.from({ length: lpSteps }, (_, i) => `${i * lpStepSize}%`)
    const yAxisLabels = Array.from({ length: fundingSteps }, (_, i) => `${minFunding + i * fundingStepSize}%`)

    return {
        data,
        lpSteps,
        fundingSteps,
        minFunding,
        xAxisLabels,
        yAxisLabels,
    }
}

/**
 * Calculate net APR from LP and funding APR
 * Formula: (2/3) * LP APR + (1/3) * Funding APR
 */
export function calculateNetApr(lpApr: number, fundingApr: number): number {
    return (2 / 3) * lpApr + (1 / 3) * fundingApr
}

/**
 * Format tooltip data for display
 * @param lpApr - LP APR value
 * @param fundingApr - Funding APR value
 * @param netApr - Net APR value
 * @returns Formatted data for tooltip display
 */
export function formatTooltipData(lpApr: number, fundingApr: number, netApr: number) {
    const yearsTo2x = netApr > 0 ? numeral(100 / netApr).format('0.0.[0]') : null
    const yearsTo5x = netApr > 0 ? numeral(400 / netApr).format('0.0.[0]') : null
    const yearsTo10x = netApr > 0 ? numeral(900 / netApr).format('0.0.[0]') : null

    return {
        lpApr: `${lpApr}%`,
        fundingApr: `${fundingApr}%`,
        netApr: `${netApr}%`,
        yearsTo2x: yearsTo2x ? `${yearsTo2x} years` : 'NGMI',
        yearsTo5x: yearsTo5x ? `${yearsTo5x} years` : 'NGMI',
        yearsTo10x: yearsTo10x ? `${yearsTo10x} years` : 'NGMI',
    }
}
