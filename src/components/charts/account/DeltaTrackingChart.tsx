'use client'

import { useEffect, useState, useMemo } from 'react'
import type { EChartsOption } from 'echarts'
import { useTheme } from 'next-themes'
import EchartWrapper from '../shared/EchartWrapperOptimized'
import { getThemeColors } from '@/config'
import { cn } from '@/utils'
import type { DeltaHistory } from '@/stores/delta-history.store'

interface DeltaTrackingChartProps {
    className?: string
    history: DeltaHistory
    showSpotDelta?: boolean
    showHyperEvmDelta?: boolean
    totalCapital?: number
    hypePrice?: number
}

export default function DeltaTrackingChart({
    className,
    history,
    showSpotDelta = false,
    showHyperEvmDelta = false,
    totalCapital,
    hypePrice = 30,
}: DeltaTrackingChartProps) {
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

        // Determine if we should show dual axes
        const showDualAxes = totalCapital && totalCapital > 0

        const allDeltas = [
            ...history.lpDeltas,
            ...history.perpDeltas,
            ...history.netDeltas,
            ...(showSpotDelta ? history.spotDeltas : []),
            ...(showHyperEvmDelta ? history.hyperEvmDeltas : []),
        ]

        // For left axis (USD): range from -capital to +capital
        // For right axis (Delta ratio): range from -1 to +1
        let usdAxisMax: number

        if (showDualAxes) {
            // Use total capital for USD axis
            usdAxisMax = totalCapital
        } else {
            // Fallback when no capital info: use actual delta values converted to USD
            const maxAbsDelta = Math.max(...allDeltas.map((d) => Math.abs(d * hypePrice)), 100)
            usdAxisMax = maxAbsDelta * 1.1 // Add 10% padding
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

        // Prepare series data - convert HYPE deltas to USD
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const series: any[] = [
            {
                name: 'LP Delta',
                type: 'line',
                data: history.lpDeltas.map((d) => d * hypePrice),
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    color: colors.aquamarine, // Use theme green for positive
                    width: 2,
                },
                emphasis: {
                    focus: 'series',
                },
            },
            {
                name: 'Perp Delta',
                type: 'line',
                data: history.perpDeltas.map((d) => d * hypePrice),
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    color: colors.folly, // Use theme red for negative
                    width: 2,
                },
                emphasis: {
                    focus: 'series',
                },
            },
            {
                name: 'Net Delta',
                type: 'line',
                data: history.netDeltas.map((d) => d * hypePrice),
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    color: colors.primary, // Use primary theme color for net
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
                data: history.spotDeltas.map((d) => d * hypePrice),
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    color: colors.secondary, // Use secondary theme color
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
                data: history.hyperEvmDeltas.map((d) => d * hypePrice),
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    color: colors.muted, // Use muted color for secondary data
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
                              color: colors.secondary, // Use secondary for events
                              type: 'dashed',
                              width: 1,
                              opacity: 0.5,
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
                    color: colors.foreground,
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
                        const hypeAmount = typeof param.value === 'number' ? (param.value / hypePrice).toFixed(2) : '0'
                        const deltaRatio = showDualAxes && totalCapital > 0 ? (param.value / totalCapital).toFixed(3) : ''
                        const color = param.color || '#666'
                        html += `
                            <div style="display: flex; justify-content: space-between; align-items: center; margin: 2px 0;">
                                <span style="display: flex; align-items: center;">
                                    <span style="display: inline-block; width: 10px; height: 10px; background: ${color}; border-radius: 50%; margin-right: 6px;"></span>
                                    ${param.seriesName}
                                </span>
                                <strong style="margin-left: 20px;">$${value} (${hypeAmount} HYPE${deltaRatio ? `, ${deltaRatio}` : ''})</strong>
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
                // By default, only show Net Delta - users can click to toggle others
                selected: {
                    'LP Delta': false,
                    'Perp Delta': false,
                    'Net Delta': true,
                    'Spot Delta': false,
                    'HyperEVM Delta': false,
                },
            },
            grid: {
                top: 50,
                right: showDualAxes ? 60 : 20,
                bottom: 60,
                left: 60,
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
            yAxis: showDualAxes
                ? [
                      {
                          type: 'value',
                          name: 'USD Value',
                          nameLocation: 'middle',
                          nameGap: 60,
                          position: 'left',
                          min: -usdAxisMax,
                          max: usdAxisMax,
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
                          name: 'Delta Ratio',
                          nameLocation: 'middle',
                          nameGap: 50,
                          position: 'right',
                          min: -1,
                          max: 1,
                          axisLine: {
                              lineStyle: {
                                  color: colors.border,
                              },
                          },
                          axisLabel: {
                              color: colors.muted,
                              formatter: function (value: number) {
                                  if (Math.abs(value) < 0.01) return '0'
                                  const sign = value > 0 ? '+' : ''
                                  return `${sign}${value.toFixed(2)}`
                              },
                          },
                          splitLine: {
                              show: false,
                          },
                      },
                  ]
                : {
                      type: 'value',
                      name: 'USD Value',
                      nameLocation: 'middle',
                      nameGap: 60,
                      min: -usdAxisMax,
                      max: usdAxisMax,
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
                yAxisIndex: 0, // All series use the USD axis (left)
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
    }, [history, colors, isDarkMode, showSpotDelta, showHyperEvmDelta, totalCapital, hypePrice])

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
