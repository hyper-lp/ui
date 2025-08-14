'use client'

import { useEffect, useState, useMemo, memo } from 'react'
import type { EChartsOption } from 'echarts'
import { useTheme } from 'next-themes'
import EchartWrapper from '../shared/EchartWrapperOptimized'
import { getThemeColors } from '@/config'
import { cn } from '@/utils'

interface APRBreakdownChartProps {
    className?: string
    lpFeeAPR: number
    fundingAPR: number
    rebalancingCost?: number // As negative APR impact
}

function APRBreakdownChart({ className, lpFeeAPR = 0, fundingAPR = 0, rebalancingCost = 0 }: APRBreakdownChartProps) {
    const [options, setOptions] = useState<EChartsOption | null>(null)
    const { resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === 'dark'
    const colors = useMemo(() => getThemeColors(isDarkMode), [isDarkMode])

    const netAPR = useMemo(() => {
        return lpFeeAPR + fundingAPR - Math.abs(rebalancingCost)
    }, [lpFeeAPR, fundingAPR, rebalancingCost])

    useEffect(() => {
        // Prepare data for the donut chart
        const data = [
            {
                value: Math.max(0, lpFeeAPR),
                name: 'LP Fees',
                itemStyle: { color: '#10b981' }, // green
            },
            {
                value: Math.abs(fundingAPR),
                name: fundingAPR >= 0 ? 'Funding Income' : 'Funding Cost',
                itemStyle: { color: fundingAPR >= 0 ? '#3b82f6' : '#ef4444' }, // blue for positive, red for negative
            },
        ]

        // Only add rebalancing cost if it's non-zero
        if (rebalancingCost > 0) {
            data.push({
                value: rebalancingCost,
                name: 'Rebalancing Cost',
                itemStyle: { color: '#6b7280' }, // gray
            })
        }

        const chartOptions: EChartsOption = {
            animation: true,
            animationDuration: 500,
            animationEasing: 'cubicInOut',
            tooltip: {
                trigger: 'item',
                backgroundColor: colors.tooltipBackground,
                borderColor: colors.primary,
                borderWidth: 1,
                borderRadius: 8,
                textStyle: {
                    color: isDarkMode ? '#f3f4f6' : '#1f2937',
                },
                formatter: function (params) {
                    // Handle both single and array params
                    const param = Array.isArray(params) ? params[0] : params
                    if (!param) return ''

                    const value = typeof param.value === 'number' ? param.value.toFixed(2) : '0'
                    const percent = typeof param.percent === 'number' ? param.percent.toFixed(1) : '0'
                    const isNegative = param.name === 'Funding Cost' || param.name === 'Rebalancing Cost'

                    return `
                        <div style="padding: 4px;">
                            <strong>${param.name}</strong><br/>
                            <span style="color: ${param.color};">●</span>
                            ${isNegative ? '-' : ''}${value}% APR
                            <br/>
                            <span style="color: #999; font-size: 12px;">${percent}% of total</span>
                        </div>
                    `
                },
            },
            legend: {
                orient: 'vertical',
                right: 10,
                top: 'center',
                textStyle: {
                    color: colors.foreground,
                },
                formatter: function (name: string) {
                    const item = data.find((d) => d.name === name)
                    if (!item) return name

                    const value = item.value
                    const isNegative = name === 'Funding Cost' || name === 'Rebalancing Cost'
                    return `${name}: ${isNegative ? '-' : '+'}${value.toFixed(2)}%`
                },
            },
            series: [
                {
                    name: 'APR Breakdown',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['35%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: colors.background,
                        borderWidth: 2,
                    },
                    label: {
                        show: false,
                        position: 'center',
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 20,
                            fontWeight: 'bold',
                            formatter: function (params) {
                                const value = typeof params.value === 'number' ? params.value : 0
                                return `${value.toFixed(1)}%`
                            },
                        },
                        scaleSize: 5,
                    },
                    labelLine: {
                        show: false,
                    },
                    data: data,
                },
            ],
            graphic: [
                {
                    type: 'text',
                    left: 'center',
                    top: '45%',
                    style: {
                        text: `${netAPR >= 0 ? '+' : ''}${netAPR.toFixed(1)}%`,
                        fill: netAPR >= 0 ? '#10b981' : '#ef4444',
                        fontSize: 28,
                        fontWeight: 'bold',
                    },
                },
                {
                    type: 'text',
                    left: 'center',
                    top: '54%',
                    style: {
                        text: 'Net APR',
                        fill: colors.muted,
                        fontSize: 12,
                    },
                },
            ],
        }

        setOptions(chartOptions)
    }, [lpFeeAPR, fundingAPR, rebalancingCost, netAPR, colors, isDarkMode])

    if (!options) {
        return (
            <div className="bg-card flex h-[300px] w-full items-center justify-center rounded-lg">
                <div className="text-muted">Loading chart...</div>
            </div>
        )
    }

    return (
        <div className={cn('relative flex flex-col', className)}>
            <h3 className="mb-2 text-sm font-semibold">APR Breakdown</h3>
            <div className="min-h-[300px] flex-1">
                <EchartWrapper options={options} className="size-full" />
            </div>
        </div>
    )
}

export default memo(APRBreakdownChart)
