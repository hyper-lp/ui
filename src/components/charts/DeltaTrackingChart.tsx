'use client'

import { useEffect, useState, useMemo, memo } from 'react'
import type { EChartsOption } from 'echarts'
import { useTheme } from 'next-themes'
import EchartWrapper from './EchartWrapperOptimized'
import { getThemeColors } from '@/config'
import { cn } from '@/utils'
import type { DeltaHistory } from '@/stores/delta-history.store'

interface DeltaTrackingChartProps {
    className?: string
    history: DeltaHistory
    showSpotDelta?: boolean
    showHyperEvmDelta?: boolean
    totalCapital?: number
}

function DeltaTrackingChart({ className, history, showSpotDelta = false, showHyperEvmDelta = false, totalCapital }: DeltaTrackingChartProps) {
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

        // Calculate max delta for symmetric scale on both axes
        const showRatioAxis = totalCapital && totalCapital > 0

        const allDeltas = [
            ...history.lpDeltas,
            ...history.perpDeltas,
            ...history.netDeltas,
            ...(showSpotDelta ? history.spotDeltas : []),
            ...(showHyperEvmDelta ? history.hyperEvmDeltas : []),
        ]

        // Find max absolute delta for symmetric USD scale
        const maxAbsDelta = Math.max(...allDeltas.map(Math.abs), 100) // At least $100 scale
        const paddedMaxDelta = maxAbsDelta * 1.1 // Add 10% padding

        // Calculate max ratio for percentage scale
        let maxRatio = 1 // Default to 100%
        if (showRatioAxis) {
            maxRatio = Math.max(paddedMaxDelta / totalCapital, 0.5) // At least 50% scale
            // Round to nice numbers
            if (maxRatio > 2) maxRatio = Math.ceil(maxRatio)
            else if (maxRatio > 1) maxRatio = 2
            else maxRatio = 1
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
                right: 80,
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
            yAxis: showRatioAxis
                ? [
                      {
                          type: 'value',
                          name: 'Delta (USD)',
                          nameLocation: 'middle',
                          nameGap: 60,
                          position: 'left',
                          min: -paddedMaxDelta,
                          max: paddedMaxDelta,
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
                      {
                          type: 'value',
                          name: 'Delta Ratio (%)',
                          nameLocation: 'middle',
                          nameGap: 50,
                          position: 'right',
                          min: -(paddedMaxDelta / totalCapital) * 100,
                          max: (paddedMaxDelta / totalCapital) * 100,
                          axisLine: {
                              lineStyle: {
                                  color: colors.border,
                              },
                          },
                          axisLabel: {
                              color: colors.muted,
                              formatter: function (value: number) {
                                  if (Math.abs(value) < 0.01) return '0%'
                                  const sign = value > 0 ? '+' : ''
                                  return `${sign}${value.toFixed(0)}%`
                              },
                          },
                          splitLine: {
                              show: false,
                          },
                      },
                  ]
                : {
                      type: 'value',
                      name: 'Delta (USD)',
                      nameLocation: 'middle',
                      nameGap: 60,
                      min: -paddedMaxDelta,
                      max: paddedMaxDelta,
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
    }, [history, colors, isDarkMode, showSpotDelta, showHyperEvmDelta, totalCapital])

    if (!options) {
        return (
            <div className="bg-card flex h-[300px] w-full items-center justify-center rounded-lg">
                <div className="text-muted">Loading chart...</div>
            </div>
        )
    }

    return (
        <div className={cn('relative flex flex-col', className)}>
            <h3 className="mb-2 text-sm font-semibold">Delta Tracking (Live)</h3>
            <div className="min-h-[300px] flex-1">
                <EchartWrapper options={options} className="size-full" />
            </div>
        </div>
    )
}

export default memo(DeltaTrackingChart)
