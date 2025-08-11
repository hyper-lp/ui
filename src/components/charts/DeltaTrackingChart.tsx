'use client'

import { useEffect, useState, useMemo, memo } from 'react'
import type { EChartsOption } from 'echarts'
import { useTheme } from 'next-themes'
import EchartWrapper from './EchartWrapper'
import { getThemeColors } from '@/config'
import { cn } from '@/utils'
import type { DeltaHistory } from '@/stores/delta-history.store'

interface DeltaTrackingChartProps {
    className?: string
    history: DeltaHistory
    showSpotDelta?: boolean
    showHyperEvmDelta?: boolean
}

function DeltaTrackingChart({ className, history, showSpotDelta = false, showHyperEvmDelta = false }: DeltaTrackingChartProps) {
    const [options, setOptions] = useState<EChartsOption | null>(null)
    const { resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === 'dark'
    const colors = useMemo(() => getThemeColors(isDarkMode), [isDarkMode])

    useEffect(() => {
        if (!history || history.timestamps.length === 0) {
            // Show empty state
            const emptyOptions: EChartsOption = {
                title: {
                    text: 'Waiting for data...',
                    left: 'center',
                    top: 'center',
                    textStyle: {
                        color: colors.muted,
                        fontSize: 14,
                    },
                },
                grid: {
                    top: 60,
                    right: 80,
                    bottom: 60,
                    left: 80,
                },
            }
            setOptions(emptyOptions)
            return
        }

        // Format timestamps for display
        const formattedTimestamps = history.timestamps.map((ts) => {
            const date = new Date(ts)
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            })
        })

        // Prepare series data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const series: any[] = [
            {
                name: 'LP Delta',
                type: 'line',
                data: history.lpDeltas,
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    color: '#10b981', // green
                    width: 2,
                },
                emphasis: {
                    focus: 'series',
                },
            },
            {
                name: 'Perp Delta',
                type: 'line',
                data: history.perpDeltas,
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    color: '#ef4444', // red
                    width: 2,
                },
                emphasis: {
                    focus: 'series',
                },
            },
            {
                name: 'Net Delta',
                type: 'line',
                data: history.netDeltas,
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    color: isDarkMode ? '#e5e7eb' : '#374151', // gray
                    width: 3,
                    type: 'solid',
                },
                emphasis: {
                    focus: 'series',
                },
                z: 10, // Bring to front
            },
        ]

        // Add optional series
        if (showSpotDelta && history.spotDeltas.length > 0) {
            series.push({
                name: 'Spot Delta',
                type: 'line',
                data: history.spotDeltas,
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    color: '#3b82f6', // blue
                    width: 2,
                    type: 'dashed',
                },
                emphasis: {
                    focus: 'series',
                },
            })
        }

        if (showHyperEvmDelta && history.hyperEvmDeltas.length > 0) {
            series.push({
                name: 'HyperEVM Delta',
                type: 'line',
                data: history.hyperEvmDeltas,
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    color: '#a855f7', // purple
                    width: 2,
                    type: 'dashed',
                },
                emphasis: {
                    focus: 'series',
                },
            })
        }

        // Add rebalance event markers
        const markLine =
            history.rebalanceEvents.length > 0
                ? {
                      data: history.rebalanceEvents.map((event) => ({
                          xAxis: history.timestamps.findIndex((ts) => ts >= event.timestamp),
                          label: {
                              formatter: `${event.method} rebalance`,
                              position: 'end',
                              fontSize: 10,
                          },
                          lineStyle: {
                              color: '#f59e0b', // amber
                              type: 'dashed',
                              width: 1,
                          },
                      })),
                  }
                : undefined

        const chartOptions: EChartsOption = {
            animation: true,
            animationDuration: 300,
            animationEasing: 'cubicInOut',
            tooltip: {
                trigger: 'axis',
                backgroundColor: colors.tooltipBackground,
                borderColor: colors.primary,
                borderWidth: 1,
                borderRadius: 8,
                textStyle: {
                    color: isDarkMode ? '#f3f4f6' : '#1f2937',
                },
                formatter: function (params) {
                    if (!Array.isArray(params) || params.length === 0) return ''

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const firstParam = params[0] as any
                    const timestamp = firstParam.axisValue || ''
                    let html = `<div style="padding: 4px;"><strong>${timestamp}</strong><br/>`

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    params.forEach((param: any) => {
                        const value = typeof param.value === 'number' ? param.value.toFixed(2) : '0'
                        const color = param.color || '#666'
                        html += `
                            <div style="display: flex; justify-content: space-between; align-items: center; margin: 2px 0;">
                                <span style="display: flex; align-items: center;">
                                    <span style="display: inline-block; width: 10px; height: 10px; background: ${color}; border-radius: 50%; margin-right: 6px;"></span>
                                    ${param.seriesName}
                                </span>
                                <strong style="margin-left: 20px;">$${value}</strong>
                            </div>
                        `
                    })

                    html += '</div>'
                    return html
                },
            },
            legend: {
                data: ['LP Delta', 'Perp Delta', 'Net Delta', 'Spot Delta', 'HyperEVM Delta'].filter((name) => {
                    if (name === 'Spot Delta' && !showSpotDelta) return false
                    if (name === 'HyperEVM Delta' && !showHyperEvmDelta) return false
                    return true
                }),
                top: 10,
                textStyle: {
                    color: colors.foreground,
                },
            },
            grid: {
                top: 60,
                right: 20,
                bottom: 60,
                left: 80,
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                data: formattedTimestamps,
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: colors.border,
                    },
                },
                axisLabel: {
                    color: colors.muted,
                    rotate: 45,
                    interval: Math.floor(formattedTimestamps.length / 8), // Show ~8 labels
                },
            },
            yAxis: {
                type: 'value',
                name: 'Delta (USD)',
                nameLocation: 'middle',
                nameGap: 60,
                axisLine: {
                    lineStyle: {
                        color: colors.border,
                    },
                },
                axisLabel: {
                    color: colors.muted,
                    formatter: '${value}',
                },
                splitLine: {
                    lineStyle: {
                        color: colors.border,
                        type: 'dashed',
                    },
                },
            },
            series: series.map((s) => ({
                ...s,
                markLine: s.name === 'Net Delta' ? markLine : undefined,
            })),
            dataZoom: [
                {
                    type: 'inside',
                    start: Math.max(0, 100 - (100 * 60) / history.timestamps.length), // Show last 60 points
                    end: 100,
                },
                {
                    type: 'slider',
                    start: Math.max(0, 100 - (100 * 60) / history.timestamps.length),
                    end: 100,
                    height: 20,
                    bottom: 10,
                },
            ],
        }

        setOptions(chartOptions)
    }, [history, colors, isDarkMode, showSpotDelta, showHyperEvmDelta])

    if (!options) {
        return (
            <div className="flex h-[300px] w-full items-center justify-center rounded-lg bg-card">
                <div className="text-muted">Loading chart...</div>
            </div>
        )
    }

    return (
        <div className={cn('relative flex flex-col', className)}>
            <h3 className="text-sm font-semibold mb-2">Delta Tracking (Live)</h3>
            <div className="flex-1 min-h-[300px]">
                <EchartWrapper options={options} className="size-full" />
            </div>
        </div>
    )
}

export default memo(DeltaTrackingChart)
