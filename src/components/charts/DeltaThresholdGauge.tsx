'use client'

import { useEffect, useState, useMemo, memo } from 'react'
import type { EChartsOption } from 'echarts'
import { useTheme } from 'next-themes'
import EchartWrapper from './EchartWrapperOptimized'
import { getThemeColors } from '@/config'
import { cn } from '@/utils'

interface DeltaThresholdGaugeProps {
    className?: string
    currentDelta: number
    threshold?: number // Default 100
    warningThreshold?: number // Default 200
}

function DeltaThresholdGauge({ className, currentDelta = 0, threshold = 100, warningThreshold = 200 }: DeltaThresholdGaugeProps) {
    const [options, setOptions] = useState<EChartsOption | null>(null)
    const { resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === 'dark'
    const colors = useMemo(() => getThemeColors(isDarkMode), [isDarkMode])

    const absDelta = Math.abs(currentDelta)
    const maxValue = warningThreshold * 1.5 // Show up to 150% of warning threshold

    useEffect(() => {
        const chartOptions: EChartsOption = {
            animation: true,
            animationDuration: 500,
            animationEasing: 'cubicInOut',
            tooltip: {
                formatter: '{b}: ${c}',
                backgroundColor: colors.tooltipBackground,
                borderColor: colors.primary,
                borderWidth: 1,
                borderRadius: 8,
                textStyle: {
                    color: isDarkMode ? '#f3f4f6' : '#1f2937',
                },
            },
            series: [
                {
                    name: 'Delta',
                    type: 'gauge',
                    center: ['50%', '60%'],
                    radius: '90%',
                    min: 0,
                    max: maxValue,
                    splitNumber: 5,
                    axisLine: {
                        lineStyle: {
                            width: 20,
                            color: [
                                [threshold / maxValue, '#10b981'], // Green zone
                                [warningThreshold / maxValue, '#f59e0b'], // Yellow zone
                                [1, '#ef4444'], // Red zone
                            ],
                        },
                    },
                    pointer: {
                        itemStyle: {
                            color: 'auto',
                        },
                        width: 5,
                    },
                    axisTick: {
                        distance: -20,
                        length: 8,
                        lineStyle: {
                            color: colors.border,
                            width: 1,
                        },
                    },
                    splitLine: {
                        distance: -25,
                        length: 25,
                        lineStyle: {
                            color: colors.border,
                            width: 2,
                        },
                    },
                    axisLabel: {
                        color: colors.muted,
                        distance: -35,
                        fontSize: 10,
                        formatter: function (value: number) {
                            return `$${value}`
                        },
                    },
                    detail: {
                        valueAnimation: true,
                        fontSize: 20,
                        fontWeight: 'bold',
                        offsetCenter: [0, '70%'],
                        formatter: function (value: number) {
                            const direction = currentDelta >= 0 ? 'Long' : 'Short'
                            return `${direction}: $${value.toFixed(0)}`
                        },
                        color: 'auto',
                    },
                    data: [
                        {
                            value: absDelta,
                            name: 'Net Delta',
                        },
                    ],
                },
                // Add threshold markers
                {
                    type: 'gauge',
                    center: ['50%', '60%'],
                    radius: '90%',
                    min: 0,
                    max: maxValue,
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                    },
                    axisLabel: {
                        show: false,
                    },
                    pointer: {
                        show: false,
                    },
                    detail: {
                        show: false,
                    },
                    markPoint: {
                        symbol: 'triangle',
                        symbolSize: 15,
                        data: [
                            {
                                name: 'Rebalance Threshold',
                                value: threshold,
                                x: '50%',
                                y: '15%',
                                itemStyle: {
                                    color: '#f59e0b',
                                },
                                label: {
                                    show: true,
                                    position: 'top',
                                    formatter: 'Rebalance\n$' + threshold,
                                    fontSize: 10,
                                    color: colors.muted,
                                },
                            },
                        ],
                    },
                },
            ],
            graphic: [
                {
                    type: 'text',
                    left: 'center',
                    bottom: 10,
                    style: {
                        text:
                            absDelta < threshold
                                ? '✓ Delta Neutral'
                                : absDelta < warningThreshold
                                  ? '⚠ Approaching Threshold'
                                  : '⚠ Rebalance Needed',
                        fill: absDelta < threshold ? '#10b981' : absDelta < warningThreshold ? '#f59e0b' : '#ef4444',
                        fontSize: 12,
                        fontWeight: 'bold',
                    },
                },
            ],
        }

        setOptions(chartOptions)
    }, [currentDelta, absDelta, threshold, warningThreshold, maxValue, colors, isDarkMode])

    if (!options) {
        return (
            <div className="flex h-[300px] w-full items-center justify-center rounded-lg bg-card">
                <div className="text-muted">Loading gauge...</div>
            </div>
        )
    }

    return (
        <div className={cn('relative flex flex-col', className)}>
            <h3 className="text-sm font-semibold mb-2">Delta Threshold</h3>
            <div className="flex-1 min-h-[250px]">
                <EchartWrapper options={options} className="size-full" />
            </div>
        </div>
    )
}

export default memo(DeltaThresholdGauge)
