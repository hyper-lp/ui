'use client'

import { useEffect, useState, useMemo, memo } from 'react'
import type { EChartsOption } from 'echarts'
import { useTheme } from 'next-themes'
import EchartWrapper from './EchartWrapperOptimized'
import { getThemeColors } from '@/config'
import { cn } from '@/utils'

interface PositionCompositionBarProps {
    className?: string
    lpValue: number
    perpMargin: number
    spotValue: number
    hyperEvmValue?: number
    totalValue: number
}

function PositionCompositionBar({
    className,
    lpValue = 0,
    perpMargin = 0,
    spotValue = 0,
    hyperEvmValue = 0,
    totalValue = 0,
}: PositionCompositionBarProps) {
    const [options, setOptions] = useState<EChartsOption | null>(null)
    const { resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === 'dark'
    const colors = useMemo(() => getThemeColors(isDarkMode), [isDarkMode])

    useEffect(() => {
        // Calculate percentages
        const total = totalValue || lpValue + perpMargin + spotValue + hyperEvmValue
        const lpPercent = total > 0 ? ((lpValue / total) * 100).toFixed(1) : '0'
        const perpPercent = total > 0 ? ((perpMargin / total) * 100).toFixed(1) : '0'
        const spotPercent = total > 0 ? ((spotValue / total) * 100).toFixed(1) : '0'
        const evmPercent = total > 0 ? ((hyperEvmValue / total) * 100).toFixed(1) : '0'

        const chartOptions: EChartsOption = {
            animation: true,
            animationDuration: 500,
            animationEasing: 'cubicInOut',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
                backgroundColor: colors.tooltipBackground,
                borderColor: colors.primary,
                borderWidth: 1,
                borderRadius: 8,
                textStyle: {
                    color: isDarkMode ? '#f3f4f6' : '#1f2937',
                },
                formatter: function (params) {
                    if (!Array.isArray(params)) return ''

                    let html = '<div style="padding: 4px;">'
                    html += `<strong>Total: $${total.toFixed(2)}</strong><br/>`

                    params.forEach((param) => {
                        const value = typeof param.value === 'number' ? param.value : 0
                        const percent = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
                        html += `
                            <div style="display: flex; justify-content: space-between; align-items: center; margin: 4px 0;">
                                <span>
                                    <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; border-radius: 2px; margin-right: 6px;"></span>
                                    ${param.seriesName}
                                </span>
                                <strong style="margin-left: 20px;">$${value.toFixed(2)} (${percent}%)</strong>
                            </div>
                        `
                    })

                    html += '</div>'
                    return html
                },
            },
            legend: {
                data: ['LP Positions', 'Perp Margin', 'Spot Balance', 'HyperEVM'],
                bottom: 0,
                textStyle: {
                    color: colors.foreground,
                    fontSize: 11,
                },
            },
            grid: {
                top: 20,
                right: 20,
                bottom: 40,
                left: 20,
                containLabel: true,
            },
            xAxis: {
                type: 'value',
                max: total,
                show: false,
            },
            yAxis: {
                type: 'category',
                data: ['Capital'],
                show: false,
            },
            series: [
                {
                    name: 'LP Positions',
                    type: 'bar',
                    stack: 'total',
                    barWidth: 40,
                    itemStyle: {
                        color: '#10b981', // green
                        borderRadius: [4, 0, 0, 4],
                    },
                    label: {
                        show: lpValue > 0,
                        position: 'inside',
                        formatter: `LP\n${lpPercent}%`,
                        fontSize: 11,
                        fontWeight: 'bold',
                        color: '#fff',
                    },
                    data: [lpValue],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0,0,0,0.3)',
                        },
                    },
                },
                {
                    name: 'Perp Margin',
                    type: 'bar',
                    stack: 'total',
                    itemStyle: {
                        color: '#ef4444', // red
                    },
                    label: {
                        show: perpMargin > 0,
                        position: 'inside',
                        formatter: `Perp\n${perpPercent}%`,
                        fontSize: 11,
                        fontWeight: 'bold',
                        color: '#fff',
                    },
                    data: [perpMargin],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0,0,0,0.3)',
                        },
                    },
                },
                {
                    name: 'Spot Balance',
                    type: 'bar',
                    stack: 'total',
                    itemStyle: {
                        color: '#3b82f6', // blue
                    },
                    label: {
                        show: spotValue > 0,
                        position: 'inside',
                        formatter: `Spot\n${spotPercent}%`,
                        fontSize: 11,
                        fontWeight: 'bold',
                        color: '#fff',
                    },
                    data: [spotValue],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0,0,0,0.3)',
                        },
                    },
                },
                {
                    name: 'HyperEVM',
                    type: 'bar',
                    stack: 'total',
                    itemStyle: {
                        color: '#a855f7', // purple
                        borderRadius: [0, 4, 4, 0],
                    },
                    label: {
                        show: hyperEvmValue > 0,
                        position: 'inside',
                        formatter: `EVM\n${evmPercent}%`,
                        fontSize: 11,
                        fontWeight: 'bold',
                        color: '#fff',
                    },
                    data: [hyperEvmValue],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0,0,0,0.3)',
                        },
                    },
                },
            ],
            // Add reference lines for ideal allocation
            graphic: [
                {
                    type: 'line',
                    shape: {
                        x1: '33.33%',
                        y1: '35%',
                        x2: '33.33%',
                        y2: '65%',
                    },
                    style: {
                        stroke: colors.muted,
                        lineDash: [5, 5],
                        lineWidth: 1,
                    },
                },
                {
                    type: 'line',
                    shape: {
                        x1: '66.66%',
                        y1: '35%',
                        x2: '66.66%',
                        y2: '65%',
                    },
                    style: {
                        stroke: colors.muted,
                        lineDash: [5, 5],
                        lineWidth: 1,
                    },
                },
                {
                    type: 'text',
                    left: 'center',
                    top: 5,
                    style: {
                        text: 'Target: ⅓ LP | ⅓ Perp | ⅓ Buffer',
                        fill: colors.muted,
                        fontSize: 10,
                    },
                },
            ],
        }

        setOptions(chartOptions)
    }, [lpValue, perpMargin, spotValue, hyperEvmValue, totalValue, colors, isDarkMode])

    if (!options) {
        return (
            <div className="flex h-[400px] w-full items-center justify-center rounded-lg bg-card">
                <div className="text-muted">Loading chart...</div>
            </div>
        )
    }

    return (
        <div className={cn('relative flex flex-col', className)}>
            <h3 className="text-sm font-semibold mb-2">Capital Allocation</h3>
            <div className="flex-1 min-h-[250px]">
                <EchartWrapper options={options} className="size-full" />
            </div>
        </div>
    )
}

export default memo(PositionCompositionBar)
