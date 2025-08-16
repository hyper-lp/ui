'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import type { EChartsOption } from 'echarts'
import { useTheme } from 'next-themes'
import EchartWrapper from '../shared/EchartWrapperOptimized'
import { getThemeColors } from '@/config'
import { STATUS_COLORS } from '@/config'
import { DAYJS_FORMATS, formatUSD } from '@/utils'
import { useAppStore } from '@/stores/app.store'
import numeral from 'numeral'

const DEFAULT_VISIBLE_POINTS = 10 // Number of points to show by default in dataZoom

const grid = {
    top: 50,
    right: 100,
    bottom: 50,
    left: 45,
    // left: 15,
    containLabel: true,
}

const emptyOptions: EChartsOption = {
    title: {
        text: 'Waiting for data...',
        left: 'center',
        top: 'center',
        textStyle: {
            fontSize: 14,
        },
    },
    grid,
}

export enum ChartSeries {
    TotalCapital = 'AUM',
    HyperEvmLps = 'LPs Δ',
    HyperEvmBalances = 'Balances Δ',
    HyperCorePerps = 'Perps Δ',
    NetDelta = 'Net Δ',
    HyperCoreSpots = 'Spots Δ',
}

export default function DeltaTrackingChart() {
    const [options, setOptions] = useState<EChartsOption | null>(null)
    const { resolvedTheme } = useTheme()
    const colors = getThemeColors(resolvedTheme)

    // Store dataZoom range to persist between refreshes
    const [, setZoomRange] = useState<{ x: { start: number; end: number }; y: { start: number; end: number } } | null>(null)
    const zoomRangeRef = useRef<{ x: { start: number; end: number }; y: { start: number; end: number } } | null>(null)

    // Get historical snapshots from the app store
    const getSnapshots = useAppStore((state) => state.getSnapshots)
    const lastSnapshotAddedAt = useAppStore((state) => state.lastSnapshotAddedAt)

    // Handle dataZoom changes
    const handleDataZoom = useCallback((start: number, end: number, axis: 'x' | 'y' = 'x') => {
        const currentRange = zoomRangeRef.current || { x: { start: 0, end: 100 }, y: { start: 0, end: 100 } }
        const newRange = {
            ...currentRange,
            [axis]: { start, end },
        }
        setZoomRange(newRange)
        zoomRangeRef.current = newRange
    }, [])

    // Handle reset/restore from toolbox
    const handleRestore = useCallback(() => {
        // Clear the persisted zoom state
        zoomRangeRef.current = null
        setZoomRange(null)
        // Force re-render with default zoom values
    }, [])

    useEffect(() => {
        // 1. get stored snapshots
        let storedSnapshots = getSnapshots()

        // Show empty state if no data
        if (storedSnapshots.length === 0) {
            setOptions(emptyOptions)
            return
        }

        // If only 1 data point, duplicate it with a 1 second offset to show lines
        if (storedSnapshots.length === 1) {
            const singleSnapshot = storedSnapshots[0]
            const duplicateSnapshot = {
                ...singleSnapshot,
                timestamp: singleSnapshot.timestamp - 1000, // Subtract 1 second
            }
            storedSnapshots = [duplicateSnapshot, singleSnapshot]
        }

        // 2. extract deltas from AccountSnapshot array
        const lpDeltasUSD: Array<[number, number]> = []
        const perpDeltasUSD: Array<[number, number]> = []
        const netDeltasUSD: Array<[number, number]> = []
        const spotDeltasUSD: Array<[number, number]> = []
        const balancesDeltasUSD: Array<[number, number]> = []
        const totalCapitalUSD: Array<[number, number]> = []

        storedSnapshots.forEach((snapshot) => {
            const timestamp = snapshot.timestamp

            // Use the price from the snapshot if available, otherwise use fallback
            const hypePrice = snapshot.prices.HYPE

            // Convert HYPE deltas to USD using the snapshot's price
            const lpUSD = snapshot.metrics.hyperEvm.deltas.lpsHYPE * hypePrice
            const perpUSD = snapshot.metrics.hyperCore.deltas.perpsHYPE * hypePrice
            const spotUSD = snapshot.metrics.hyperCore.deltas.spotHYPE * hypePrice
            const balancesUSD = snapshot.metrics.hyperEvm.deltas.balancesHYPE * hypePrice
            const netUSD = snapshot.metrics.portfolio.netDeltaHYPE * hypePrice
            const totalUSD = snapshot.metrics.portfolio.totalUSD

            // For time axis, data must be [timestamp, value] pairs
            lpDeltasUSD.push([timestamp, lpUSD])
            perpDeltasUSD.push([timestamp, perpUSD])
            spotDeltasUSD.push([timestamp, spotUSD])
            balancesDeltasUSD.push([timestamp, balancesUSD])
            netDeltasUSD.push([timestamp, netUSD])
            totalCapitalUSD.push([timestamp, totalUSD])
        })

        // Use a consistent color for Net Delta line
        const netDeltaColor = colors.charts.text || '#ffffff'

        // 4. prepare series data
        const echartsOptions: EChartsOption = {
            animation: true,
            animationDuration: 300,
            animationEasing: 'cubicInOut',
            appendToBody: true,
            tooltip: {
                trigger: 'axis',
                triggerOn: 'mousemove',
                backgroundColor: resolvedTheme === 'dark' ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1,
                borderRadius: 12,
                padding: [8, 12],
                extraCssText: `backdrop-filter: blur(12px) saturate(120%); -webkit-backdrop-filter: blur(12px) saturate(120%); box-shadow: 0 8px 32px rgba(0, 0, 0, ${resolvedTheme === 'dark' ? '0.2' : '0.1'});`,
                appendToBody: true,
                hideDelay: 0,
                transitionDuration: 0,
                enterable: false,
                confine: true,
                textStyle: {
                    color: resolvedTheme === 'dark' ? '#ffffff' : '#000000',
                    fontSize: 11,
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter: function (params: any) {
                    if (!Array.isArray(params) || params.length === 0) return ''

                    // Remove duplicates by series name
                    const uniqueParams = params.filter(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (param: any, index: number, self: any[]) => index === self.findIndex((p: any) => p.seriesName === param.seriesName),
                    )

                    const firstParam = uniqueParams[0]
                    const timestamp = DAYJS_FORMATS.custom(firstParam.value[0], 'ddd. MMM. D ∙ hh:mm:ss A')

                    // Get snapshot for total capital context
                    const snapshot = storedSnapshots.find((s) => s.timestamp === firstParam.value[0])
                    const totalCapital = snapshot?.metrics.portfolio.totalUSD || 0
                    const hypePrice = snapshot?.prices.HYPE || 0

                    const isDark = resolvedTheme === 'dark'
                    const textColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.6)'
                    const dividerColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'

                    // <div style="display: flex; align-items: center; gap: 6px;">
                    //     <span style="color: ${textColor}; font-size: 11px;">AUM:</span>
                    //     <span style="font-size: 12px; font-weight: 500;">${formatUSD(totalCapital)}</span>
                    // </div >

                    let html = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 2px;">
                        <div style="margin-bottom: 10px;">
                            <div style="font-size: 13px; font-weight: 600; margin-bottom: 4px;">${timestamp}</div>
                            <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                                
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <img src="/tokens/HYPE.jpg" style="width: 12px; height: 12px; border-radius: 50%;" />
                                    <span style="font-size: 12px; font-weight: 500;">$${numeral(hypePrice).format('0,0.[0000]')}</span>
                                </div>
                            </div>
                        </div>
                        <div style="height: 1px; background: ${dividerColor}; margin: 8px -6px;"></div>`

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    uniqueParams.forEach((param: any) => {
                        // Skip formatting for Total Capital series
                        if (param.seriesName === ChartSeries.TotalCapital) {
                            const value = Array.isArray(param.value) ? param.value[1] : 0
                            html += `
                                <div style="margin: 8px 0;">
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <span style="display: inline-block; width: 8px; height: 8px; background: ${param.color || '#666'}; border-radius: 50%;"></span>
                                        <span style="font-size: 12px; font-weight: 500;">${param.seriesName}</span>
                                        <span style="font-size: 11px; font-weight: 500; margin-left: auto;">${formatUSD(value)}</span>
                                    </div>
                                </div>
                            `
                            return
                        }

                        // With time axis, value is [timestamp, value]
                        const value = Array.isArray(param.value) ? param.value[1] : 0
                        const hypeAmount = hypePrice > 0 ? value / hypePrice : 0
                        const deltaPercent = totalCapital > 0 ? Math.abs(value / totalCapital) * 100 : 0

                        // Determine status and color for all series based on risk
                        const color = param.color || '#666'
                        let riskLabel = ''
                        let riskBadgeColor = ''

                        if (param.seriesName === ChartSeries.NetDelta) {
                            if (deltaPercent < 10) {
                                riskBadgeColor = STATUS_COLORS.success
                                riskLabel = 'HEDGED'
                            } else if (deltaPercent < 20) {
                                riskBadgeColor = STATUS_COLORS.warning
                                riskLabel = 'DRIFT'
                            } else {
                                riskBadgeColor = STATUS_COLORS.error
                                riskLabel = 'REBALANCE'
                            }
                        }

                        // <img src="/tokens/HYPE.jpg" style="width: 14px; height: 14px; border-radius: 50%;" />

                        html += `
                            <div style="margin: 8px 0;">
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; gap: 8px;">
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <span style="display: inline-block; width: 8px; height: 8px; background: ${color}; border-radius: 50%;"></span>
                                        <span style="font-size: 12px; font-weight: 500;">${param.seriesName}</span>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 6px;">
                                        <span style="font-size: 11px; font-weight: 500;">${hypeAmount >= 0 ? '+' : ''}${hypeAmount.toFixed(2)} (${value >= 0 ? '+' : ''}${numeral(value).format('0,0a')}$)</span>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-left: 16px;">
                                    <span style="color: ${textColor}; font-size: 11px;">${deltaPercent.toFixed(0)}% of AUM</span>
                                    ${
                                        riskLabel
                                            ? `
                                        <span style="
                                            font-size: 9px; 
                                            padding: 2px 6px; 
                                            background: ${riskBadgeColor}20; 
                                            color: ${riskBadgeColor}; 
                                            border-radius: 4px; 
                                            font-weight: 600;
                                            letter-spacing: 0.5px;
                                        ">${riskLabel}</span>
                                    `
                                            : ''
                                    }
                                </div>
                            </div>
                        `
                    })

                    html += '</div>'
                    return html
                },
            },
            legend: {
                data: [
                    ChartSeries.TotalCapital,
                    ChartSeries.HyperEvmLps,
                    ChartSeries.HyperEvmBalances,
                    ChartSeries.HyperCorePerps,
                    ChartSeries.HyperCoreSpots,
                    ChartSeries.NetDelta,
                ],
                top: 10,
                textStyle: {
                    color: colors.charts.text,
                },
                selected: {
                    [ChartSeries.TotalCapital]: true,
                    [ChartSeries.HyperEvmLps]: true,
                    [ChartSeries.HyperEvmBalances]: false,
                    [ChartSeries.HyperCorePerps]: true,
                    [ChartSeries.HyperCoreSpots]: false,
                    [ChartSeries.NetDelta]: true,
                },
                icon: 'roundRect',
                itemWidth: 14,
                itemHeight: 8,
                itemGap: 15,
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 0,
                        title: {
                            zoom: 'Zoom',
                            back: 'Reset',
                        },
                        iconStyle: {
                            borderColor: colors.charts.text,
                            opacity: 0.5,
                        },
                        emphasis: {
                            iconStyle: {
                                borderColor: colors.charts.text,
                                opacity: 1,
                            },
                        },
                    },
                },
                itemSize: 12,
                top: 15,
                right: 5,
            },
            grid,
            xAxis: {
                type: 'time',
                axisLabel: {
                    showMinLabel: false,
                    fontSize: 10,
                    opacity: 0.5,
                    interval: 'auto',
                    hideOverlap: true,
                    show: true,
                    color: colors.charts.text,
                    formatter: (value: number) => DAYJS_FORMATS.dateTimeChart(value),
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: colors.charts.line,
                        opacity: 0.5,
                        type: 'dashed',
                    },
                },
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
            },
            yAxis: [
                {
                    type: 'value',
                    // name: 'USD exposure to HYPE {img|}',
                    // nameLocation: 'middle',
                    // nameGap: 55,
                    // nameTextStyle: {
                    //     color: colors.charts.text,
                    //     fontSize: 14,
                    //     fontWeight: 500,
                    //     rich: {
                    //         img: {
                    //             backgroundColor: {
                    //                 image: '/tokens/HYPE.svg',
                    //             },
                    //             width: 20,
                    //             height: 20,
                    //             borderRadius: 9999,
                    //         },
                    //     },
                    // },
                    position: 'left',
                    axisLine: {
                        show: false,
                    },
                    axisLabel: {
                        opacity: 0.5,
                        color: colors.charts.text,
                        formatter: (value: number) => formatUSD(value),
                        showMinLabel: false,
                        showMaxLabel: true,
                    },
                    splitLine: {
                        lineStyle: {
                            color: colors.charts.line,
                            opacity: 0.5,
                            type: 'dashed',
                        },
                    },
                },
            ],
            series: [
                {
                    name: ChartSeries.TotalCapital,
                    type: 'line',
                    data: totalCapitalUSD,
                    smooth: false,
                    symbol: 'circle',
                    symbolSize: 6,
                    showSymbol: true,
                    yAxisIndex: 0,
                    lineStyle: {
                        color: STATUS_COLORS.info,
                        width: 2,
                        type: 'solid',
                    },
                    itemStyle: {
                        color: STATUS_COLORS.info,
                    },
                    emphasis: {
                        focus: 'series',
                    },
                    endLabel: {
                        show: true,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter: (params: any) => {
                            const value = Array.isArray(params.value) ? params.value[1] : params.value || 0
                            return `${ChartSeries.TotalCapital} ${formatUSD(value)}`
                        },
                        color: STATUS_COLORS.info,
                        fontSize: 12,
                        offset: [5, 0],
                        backgroundColor: STATUS_COLORS.info + '15',
                        padding: [2, 4],
                        borderRadius: 4,
                    },
                },
                {
                    name: ChartSeries.HyperEvmLps,
                    type: 'line',
                    data: lpDeltasUSD,
                    smooth: false,
                    symbol: 'circle',
                    symbolSize: 6,
                    showSymbol: true,
                    lineStyle: {
                        color: colors.hyperEvmLp,
                        width: 2,
                        type: 'dashed',
                    },
                    itemStyle: {
                        color: colors.hyperEvmLp,
                    },
                    emphasis: {
                        focus: 'series',
                    },
                    endLabel: {
                        show: true,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter: (params: any) => {
                            const value = Array.isArray(params.value) ? params.value[1] : params.value || 0
                            const formattedValue = Math.round(value) !== 0 ? numeral(value).format('+0,0a$') : numeral(value).format('0,0a$')
                            return `${ChartSeries.HyperEvmLps} ${formattedValue}`
                        },
                        color: colors.hyperEvmLp,
                        fontSize: 12,
                        offset: [5, 0],
                        backgroundColor: colors.hyperEvmLp + '15',
                        padding: [2, 4],
                        borderRadius: 4,
                    },
                },
                {
                    name: ChartSeries.HyperEvmBalances,
                    type: 'line',
                    data: balancesDeltasUSD,
                    smooth: false,
                    symbol: 'circle',
                    symbolSize: 6,
                    showSymbol: true,
                    lineStyle: {
                        color: colors.hyperEvmBalances,
                        width: 2,
                        type: 'dashed',
                    },
                    itemStyle: {
                        color: colors.hyperEvmBalances,
                    },
                    emphasis: {
                        focus: 'series',
                    },
                    endLabel: {
                        show: true,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter: (params: any) => {
                            const value = Array.isArray(params.value) ? params.value[1] : params.value || 0
                            const formattedValue = Math.round(value) !== 0 ? numeral(value).format('+0,0a$') : numeral(value).format('0,0a$')
                            return `${ChartSeries.HyperEvmBalances} ${formattedValue}`
                        },
                        color: colors.hyperEvmBalances,
                        fontSize: 12,
                        offset: [5, 0],
                        backgroundColor: colors.hyperEvmBalances + '15',
                        padding: [2, 4],
                        borderRadius: 4,
                    },
                },
                {
                    name: ChartSeries.HyperCorePerps,
                    type: 'line',
                    data: perpDeltasUSD,
                    smooth: false,
                    symbol: 'circle',
                    symbolSize: 6,
                    showSymbol: true,
                    lineStyle: {
                        color: colors.hyperCorePerp,
                        width: 2,
                        type: 'dashed',
                    },
                    itemStyle: {
                        color: colors.hyperCorePerp,
                    },
                    emphasis: {
                        focus: 'series',
                    },
                    endLabel: {
                        show: true,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter: (params: any) => {
                            const value = Array.isArray(params.value) ? params.value[1] : params.value || 0
                            const formattedValue = Math.round(value) !== 0 ? numeral(value).format('+0,0a$') : numeral(value).format('0,0a$')
                            return `${ChartSeries.HyperCorePerps} ${formattedValue}`
                        },
                        color: colors.hyperCorePerp,
                        fontSize: 12,
                        offset: [5, 0],
                        backgroundColor: colors.hyperCorePerp + '15',
                        padding: [2, 4],
                        borderRadius: 4,
                    },
                },
                {
                    name: ChartSeries.NetDelta,
                    type: 'line',
                    data: netDeltasUSD,
                    smooth: false,
                    symbol: 'circle',
                    symbolSize: 6,
                    showSymbol: true,
                    lineStyle: {
                        color: netDeltaColor,
                        width: 2,
                        type: 'solid',
                    },
                    itemStyle: {
                        color: netDeltaColor,
                    },
                    areaStyle: {
                        opacity: 0.2,
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: netDeltaColor + '40', // 25% opacity
                                },
                                {
                                    offset: 1,
                                    color: netDeltaColor + '00', // 0% opacity
                                },
                            ],
                        },
                    },
                    emphasis: {
                        focus: 'series',
                    },
                    z: 10,
                    markLine: {
                        silent: true,
                        symbol: 'none',
                        data: [
                            {
                                yAxis: 0,
                                label: {
                                    show: false,
                                },
                                lineStyle: {
                                    color: colors.charts.axis,
                                    type: 'dashed',
                                    width: 1,
                                },
                            },
                        ],
                    },
                    endLabel: {
                        show: true,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter: (params: any) => {
                            const value = Array.isArray(params.value) ? params.value[1] : params.value || 0
                            // Hide label if value is very close to 0
                            if (Math.abs(value) < 1) return ''
                            const formattedValue = Math.round(value) !== 0 ? numeral(value).format('+0,0a$') : numeral(value).format('0,0a$')
                            return `${ChartSeries.NetDelta} ${formattedValue}`
                        },
                        color: netDeltaColor,
                        fontSize: 12,
                        offset: [5, 0],
                        backgroundColor: netDeltaColor + '15',
                        padding: [2, 4],
                        borderRadius: 4,
                    },
                },
                {
                    name: ChartSeries.HyperCoreSpots,
                    type: 'line',
                    data: spotDeltasUSD,
                    smooth: false,
                    symbol: 'circle',
                    symbolSize: 6,
                    showSymbol: true,
                    lineStyle: {
                        color: colors.hyperCoreSpot,
                        width: 2,
                        type: 'dashed',
                    },
                    itemStyle: {
                        color: colors.hyperCoreSpot,
                    },
                    emphasis: {
                        focus: 'series',
                    },
                    endLabel: {
                        show: true,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter: (params: any) => {
                            const value = Array.isArray(params.value) ? params.value[1] : params.value || 0
                            const formattedValue = Math.round(value) !== 0 ? numeral(value).format('+0,0a$') : numeral(value).format('0,0a$')
                            return `${ChartSeries.HyperCoreSpots} ${formattedValue}`
                        },
                        color: colors.hyperCoreSpot,
                        fontSize: 12,
                        offset: [5, 0],
                        backgroundColor: colors.hyperCoreSpot + '15',
                        padding: [2, 4],
                        borderRadius: 4,
                    },
                },
            ],
            dataZoom: [
                // X-axis inside zoom
                {
                    type: 'inside',
                    xAxisIndex: 0,
                    start: zoomRangeRef.current?.x?.start ?? Math.max(0, 100 - (100 * DEFAULT_VISIBLE_POINTS) / storedSnapshots.length),
                    end: zoomRangeRef.current?.x?.end ?? 100,
                },
                // X-axis slider
                {
                    type: 'slider',
                    xAxisIndex: 0,
                    start: zoomRangeRef.current?.x?.start ?? Math.max(0, 100 - (100 * DEFAULT_VISIBLE_POINTS) / storedSnapshots.length),
                    end: zoomRangeRef.current?.x?.end ?? 100,
                    height: 12,
                    bottom: 15,
                    backgroundColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.01)' : 'rgba(0, 0, 0, 0.01)',
                    borderColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                    fillerColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                    selectedDataBackground: {
                        lineStyle: {
                            color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
                        },
                        areaStyle: {
                            color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                        },
                    },
                    handleStyle: {
                        color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
                        borderColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                        borderWidth: 1,
                    },
                    moveHandleStyle: {
                        color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                        borderColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                    },
                    emphasis: {
                        handleStyle: {
                            color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                            borderColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                        },
                        moveHandleStyle: {
                            color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
                            borderColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                        },
                        handleLabel: {
                            show: false,
                        },
                    },
                    dataBackground: {
                        lineStyle: {
                            color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                        },
                        areaStyle: {
                            color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                        },
                    },
                    textStyle: {
                        color: colors.charts.text,
                    },
                },
                // Y-axis inside zoom
                {
                    type: 'inside',
                    yAxisIndex: 0,
                    start: zoomRangeRef.current?.y?.start ?? 0,
                    end: zoomRangeRef.current?.y?.end ?? 100,
                },
                // Y-axis slider
                {
                    type: 'slider',
                    yAxisIndex: 0,
                    start: zoomRangeRef.current?.y?.start ?? 0,
                    end: zoomRangeRef.current?.y?.end ?? 100,
                    width: 12,
                    left: 10,
                    backgroundColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.01)' : 'rgba(0, 0, 0, 0.01)',
                    borderColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                    fillerColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                    selectedDataBackground: {
                        lineStyle: {
                            color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
                        },
                        areaStyle: {
                            color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                        },
                    },
                    handleStyle: {
                        color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
                        borderColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                        borderWidth: 1,
                    },
                    moveHandleStyle: {
                        color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                        borderColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                    },
                    emphasis: {
                        handleStyle: {
                            color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                            borderColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                        },
                        moveHandleStyle: {
                            color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
                            borderColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                        },
                        handleLabel: {
                            show: false,
                        },
                    },
                    dataBackground: {
                        lineStyle: {
                            color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                        },
                        areaStyle: {
                            color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                        },
                    },
                    textStyle: {
                        color: colors.charts.text,
                    },
                },
            ],
        }

        // finally, set the options
        setOptions(echartsOptions)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastSnapshotAddedAt, resolvedTheme])

    if (!options) {
        return (
            <div className="flex size-full items-center justify-center">
                <div className="text-default/50">Loading chart...</div>
            </div>
        )
    }

    return (
        <EchartWrapper options={options} className="size-full h-[400px] md:h-[500px]" onDataZoomChange={handleDataZoom} onRestore={handleRestore} />
    )
}
