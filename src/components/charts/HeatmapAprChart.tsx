'use client'

import { useEffect, useState, useMemo, memo } from 'react'
import type { EChartsOption } from 'echarts'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense } from 'react'
import { useTheme } from 'next-themes'
import EchartWrapper, { CustomFallback } from './EchartWrapper'
import { ErrorBoundaryFallback } from '../common/ErrorBoundaryFallback'

// Use 'any' for ECharts callbacks to avoid complex type issues
// ECharts has very complex typing that doesn't match well with TypeScript
import { ChartColors } from '@/config/chart-colors.config'
import { cn } from '@/utils'
import { TEODOR_LIGHT_FONT } from '@/config'
import numeral from 'numeral'

interface HeatmapAprChartProps {
    className?: string
    highlightedCell?: {
        lpApr: number
        fundingApr: number
        label?: string
    }
    showNegativeFunding?: boolean
    lpStepSize?: number // Step size for LP APR axis (default: 10)
    fundingStepSize?: number // Step size for funding APR axis (default: 10)
    maxWidth?: string | number // Max width for the chart container (default: 1200px)
}

function HeatmapAprChart({ className, highlightedCell, showNegativeFunding = false, lpStepSize = 10, fundingStepSize = 5 }: HeatmapAprChartProps) {
    const [options, setOptions] = useState<EChartsOption | null>(null)
    const { resolvedTheme } = useTheme()
    const colors = useMemo(() => (resolvedTheme === 'dark' ? ChartColors.dark : ChartColors.light), [resolvedTheme])

    const stableHighlightedCell = useMemo(
        () => highlightedCell,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [highlightedCell?.lpApr, highlightedCell?.fundingApr, highlightedCell?.label],
    )

    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const isDarkMode = resolvedTheme === 'dark'

    const generateHeatmapData = useMemo(() => {
        const data: number[][] = []
        const maxLpApr = 100
        const maxFundingApr = 50
        const minFunding = showNegativeFunding ? -20 : 0

        const lpSteps = Math.floor(maxLpApr / lpStepSize) + 1 // Number of steps for LP APR
        const fundingSteps = Math.floor((maxFundingApr - minFunding) / fundingStepSize) + 1 // Number of steps for funding APR

        for (let i = 0; i < lpSteps; i++) {
            for (let j = 0; j < fundingSteps; j++) {
                const lpApr = i * lpStepSize
                const fundingApr = minFunding + j * fundingStepSize
                const netApr = (2 / 3) * lpApr + (1 / 3) * fundingApr

                data.push([i, j, Math.round(netApr)])
            }
        }

        return { data, lpSteps, fundingSteps, minFunding }
    }, [showNegativeFunding, lpStepSize, fundingStepSize])

    useEffect(() => {
        const { data, lpSteps, fundingSteps, minFunding } = generateHeatmapData

        if (!data || data.length === 0) {
            return
        }

        const xAxisData = Array.from({ length: lpSteps }, (_, i) => `${i * lpStepSize}%`)
        const yAxisData = Array.from({ length: fundingSteps }, (_, i) => `${minFunding + i * fundingStepSize}%`)

        const minApr = Math.min(...data.map((d) => d[2]))
        const maxApr = Math.max(...data.map((d) => d[2]))

        const markData = []
        if (stableHighlightedCell) {
            const xIndex = Math.round(stableHighlightedCell.lpApr / lpStepSize)
            const yIndex = Math.round((stableHighlightedCell.fundingApr - minFunding) / fundingStepSize)
            if (xIndex >= 0 && xIndex < lpSteps && yIndex >= 0 && yIndex < fundingSteps) {
                markData.push({
                    coord: [xIndex, yIndex],
                    value: stableHighlightedCell.label || 'Current',
                })
            }
        }

        const chartOptions: EChartsOption = {
            animation: true,
            animationDuration: 500, // Smooth transition duration
            animationEasing: 'cubicInOut', // Smooth easing function
            tooltip: {
                trigger: 'item',
                position: 'top',
                borderColor: colors.primary,
                borderWidth: 1,
                triggerOn: 'mousemove|click',
                backgroundColor: colors.tooltipBackground,
                borderRadius: 12,
                appendToBody: isMobile ? false : true,
                extraCssText: 'box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); backdrop-filter: blur(8px);',
                padding: [12, 16],
                // alwaysShowContent: false,
                transitionDuration: 0, // No fade animation
                textStyle: {
                    color: isDarkMode ? '#f3f4f6' : '#1f2937',
                    fontSize: 14,
                    fontFamily: TEODOR_LIGHT_FONT.style.fontFamily,
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter: function (params: any) {
                    if (!params || !params.value || !Array.isArray(params.value) || params.value.length < 3) {
                        return ''
                    }

                    const lpApr = params.value[0] * lpStepSize
                    const fundingApr = minFunding + params.value[1] * fundingStepSize
                    const netApr = params.value[2]

                    // Calculate time to multiple returns
                    const avgApr = netApr
                    const yearsTo2x = avgApr > 0 ? `${numeral(100 / avgApr).format('0.0.[0]')} years` : 'NGMI'
                    const yearsTo5x = avgApr > 0 ? `${numeral(400 / avgApr).format('0.0.[0]')} years` : 'NGMI'
                    const yearsTo10x = avgApr > 0 ? `${numeral(900 / avgApr).format('0.0.[0]')} years` : 'NGMI'

                    const primaryColor = isDarkMode ? '#f3f4f6' : '#111827'
                    const secondaryColor = isDarkMode ? '#9ca3af' : '#4b5563'
                    const tertiaryColor = isDarkMode ? '#6b7280' : '#6b7280'

                    return `
                        <div style="font-family: ${TEODOR_LIGHT_FONT.style.fontFamily}; min-width: ${isMobile ? '180' : '220'}px; padding: 4px; display: flex; flex-direction: column; gap: 4px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 13px; color: ${tertiaryColor}; font-weight: 500;">LP Fees</span>
                            <span style="font-size: 15px; color: ${secondaryColor}; font-weight: 600;">${lpApr}%</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <span style="font-size: 13px; color: ${tertiaryColor}; font-weight: 500;">Short Perp Funding</span>
                            <span style="font-size: 15px; color: ${secondaryColor}; font-weight: 600;">${fundingApr}%</span>
                            </div>
                            <div style="font-size: 28px; font-weight: 700; margin-bottom: 20px; color: ${primaryColor}; letter-spacing: -0.5px;">
                            = ${netApr}% APR
                        </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 13px; color: ${tertiaryColor}; font-weight: 500;">Time to 2x</span>
                            <span style="font-size: 13px; color: ${secondaryColor}; font-weight: 500;">${yearsTo2x}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 13px; color: ${tertiaryColor}; font-weight: 500;">Time to 5x</span>
                            <span style="font-size: 13px; color: ${secondaryColor}; font-weight: 500;">${yearsTo5x}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 13px; color: ${tertiaryColor}; font-weight: 500;">Time to 10x</span>
                            <span style="font-size: 13px; color: ${secondaryColor}; font-weight: 500;">${yearsTo10x}</span>
                            </div>
                        </div>
                    `
                },
            },
            grid: {
                top: 10,
                right: 20, // Reduced since no visual map
                bottom: 20,
                left: 60,
                containLabel: false, // Don't auto-adjust for labels, we'll control positioning
            },
            xAxis: {
                type: 'category',
                data: xAxisData,
                name: 'LP Fees APR',
                nameLocation: 'middle',
                nameGap: 40,
                axisLine: {
                    show: false,
                },
                nameTextStyle: {
                    fontSize: 18,
                    color: colors.default,
                    fontFamily: TEODOR_LIGHT_FONT.style.fontFamily,
                    fontWeight: 800,
                },
                splitArea: {
                    show: false, // Remove grid background
                },
                axisLabel: {
                    fontSize: isMobile ? 9 : 11,
                    color: colors.default,
                    interval: isMobile ? 1 : 0,
                    rotate: isMobile ? 45 : 0,
                },
                axisTick: {
                    show: false,
                },
            },
            yAxis: {
                type: 'category',
                data: yAxisData,
                name: 'Short Perp Funding APR',
                nameLocation: 'middle',
                nameGap: isMobile ? 40 : 55,
                nameRotate: 90, // Always vertical
                nameTextStyle: {
                    fontSize: 18,
                    color: colors.default,
                    fontFamily: TEODOR_LIGHT_FONT.style.fontFamily,
                    fontWeight: 800,
                },
                splitArea: {
                    show: false, // Remove grid background
                },
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    fontSize: isMobile ? 9 : 11,
                    color: colors.default,
                    interval: isMobile ? 1 : 0,
                },
                axisTick: {
                    show: false,
                },
            },
            visualMap: {
                show: false, // Hide the visual map
                min: minApr,
                max: maxApr,
                inRange: {
                    color: colors.heatmapGradient,
                },
            },
            series: [
                {
                    name: 'Net APR',
                    type: 'heatmap',
                    data: data.map((item) => {
                        return {
                            value: item,
                            label: {
                                show: true,
                                // Dynamic color based on background darkness and theme
                                color: isDarkMode
                                    ? item[2] > 40
                                        ? '#0f1a1f'
                                        : '#f6fefd' // In dark mode: dark text for bright bg, light text for dark bg
                                    : item[2] > 50
                                      ? '#f6fefd'
                                      : '#0f1a1f', // In light mode: white text for dark bg, dark text for light bg
                            },
                        }
                    }),
                    label: {
                        show: true,
                        fontSize: isMobile ? 8 : 10,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter: (params: any) => {
                            if (!params || !params.value || !Array.isArray(params.value) || params.value.length < 3) {
                                return ''
                            }
                            return `${params.value[2]}`
                        },
                    },
                    animation: true,
                    animationDuration: 300,
                    animationEasing: 'cubicOut',
                    emphasis: {
                        focus: 'self',
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: colors.primary,
                            borderColor: colors.primary,
                            borderWidth: 2,
                        },
                        label: {
                            fontSize: 12,
                            fontWeight: 'bold',
                        },
                    },
                    blur: {
                        itemStyle: {
                            opacity: isDarkMode ? 0.15 : 0.25,
                        },
                        label: {
                            opacity: 0.3,
                        },
                    },
                },
            ],
            textStyle: {
                color: colors.primary,
                fontFamily: TEODOR_LIGHT_FONT.style.fontFamily,
            },
        }

        setOptions(chartOptions)
    }, [generateHeatmapData, colors, isMobile, stableHighlightedCell, isDarkMode, lpStepSize, fundingStepSize])

    if (!options) {
        return <CustomFallback />
    }

    return (
        <Suspense fallback={<CustomFallback />}>
            <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
                <div className={cn('relative mx-auto w-full', className)}>
                    <EchartWrapper
                        options={options}
                        className={cn(
                            'min-w-[300px] w-full min-h-[450px] md:min-h-[550px] h-full max-h-[400px] md:max-h-[700px] max-w-[900px] mx-auto',
                        )}
                    />
                </div>
            </ErrorBoundary>
        </Suspense>
    )
}

export default memo(HeatmapAprChart)
