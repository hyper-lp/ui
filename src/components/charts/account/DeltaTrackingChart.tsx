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
    top: 70,
    right: 110,
    bottom: 50,
    left: 55,
    containLabel: true,
}

// Helper function to create skeleton loading data
const createSkeletonData = (phaseOffset: number, amplitude: number, baseValue: number = 0): Array<[number, number]> => {
    const now = Date.now()
    const points = 20
    const data: Array<[number, number]> = []

    for (let i = 0; i < points; i++) {
        const timestamp = now - (points - i - 1) * 60000 // 1 minute intervals
        const value = baseValue + amplitude * Math.sin((i / points) * Math.PI * 2 + phaseOffset)
        data.push([timestamp, value])
    }

    return data
}

export enum ChartSeries {
    AUM = 'AUM',
    DeployedAUM = 'Deployed AUM',
    HyperEvmLps = 'LPs Δ',
    HyperEvmBalances = 'Wallet Δ',
    HyperCorePerps = 'Perps Δ',
    HyperCoreSpots = 'Spots Δ',
    StrategyDelta = 'Strategy Δ',
    NetDelta = 'Net Δ',
}

export default function DeltaTrackingChart() {
    const [options, setOptions] = useState<EChartsOption | null>(null)
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const { resolvedTheme } = useTheme()
    const colors = getThemeColors(resolvedTheme)

    // Create loading skeleton options dynamically based on theme
    const createLoadingOptions = useCallback((): EChartsOption => {
        const netDeltaColor = colors.charts.text || '#ffffff'
        const aumColor = resolvedTheme === 'dark' ? '#ffffff' : '#000000'
        const textOpacity = resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'

        return {
            backgroundColor: 'transparent',
            animation: true,
            animationDuration: 2000,
            animationEasing: 'linear',
            animationLoop: true,
            grid,
            tooltip: { show: false },
            xAxis: {
                type: 'time',
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    show: true,
                    color: textOpacity,
                    fontSize: 10,
                    formatter: () => '••:••',
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: colors.charts.line,
                        opacity: 0.2,
                        type: 'dashed',
                    },
                },
            },
            yAxis: {
                type: 'value',
                position: 'left',
                min: -1000,
                max: 2000,
                axisLine: { show: false },
                axisLabel: {
                    show: true,
                    color: textOpacity,
                    fontSize: 10,
                    formatter: () => '$•,•••',
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: colors.charts.line,
                        opacity: 0.2,
                        type: 'dashed',
                    },
                },
            },
            legend: {
                data: [
                    { name: 'AUM', itemStyle: { color: aumColor }, textStyle: { color: textOpacity } },
                    { name: 'Deployed AUM', itemStyle: { color: aumColor }, textStyle: { color: textOpacity } },
                    { name: 'LPs Δ', itemStyle: { color: colors.hyperEvmLp }, textStyle: { color: textOpacity } },
                    { name: 'Wallet Δ', itemStyle: { color: colors.hyperEvmBalances }, textStyle: { color: textOpacity } },
                    { name: 'Perps Δ', itemStyle: { color: colors.hyperCorePerp }, textStyle: { color: textOpacity } },
                    { name: 'Spots Δ', itemStyle: { color: colors.hyperCoreSpot }, textStyle: { color: textOpacity } },
                    { name: 'Strategy Δ', itemStyle: { color: netDeltaColor }, textStyle: { color: textOpacity } },
                    { name: 'Net Δ', itemStyle: { color: netDeltaColor }, textStyle: { color: textOpacity } },
                ],
                top: 10,
                icon: 'roundRect',
                itemWidth: 14,
                itemHeight: 8,
                itemGap: 15,
                selected: {
                    AUM: true,
                    'Deployed AUM': true,
                    'LPs Δ': true,
                    'Wallet Δ': false,
                    'Perps Δ': true,
                    'Spots Δ': false,
                    'Strategy Δ': true,
                    'Net Δ': false,
                },
                inactiveColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            },
            series: [
                // AUM skeleton
                {
                    name: 'AUM',
                    type: 'line',
                    data: createSkeletonData(0, 100, 1000),
                    smooth: false,
                    symbol: 'none',
                    lineStyle: {
                        color: aumColor,
                        width: 2,
                        opacity: 0.3,
                    },
                    animation: true,
                    animationDuration: 3000,
                    animationDelay: 0,
                    endLabel: {
                        show: true,
                        formatter: 'AUM $••,•••',
                        color: textOpacity,
                        fontSize: 12,
                        offset: [5, 0],
                        backgroundColor: aumColor + '08',
                        padding: [2, 4],
                        borderRadius: 4,
                    },
                },
                // LPs skeleton
                {
                    name: 'LPs Δ',
                    type: 'line',
                    data: createSkeletonData(1, 80, 300),
                    smooth: false,
                    symbol: 'none',
                    lineStyle: {
                        color: colors.hyperEvmLp,
                        width: 2,
                        opacity: 0.3,
                    },
                    animation: true,
                    animationDuration: 3000,
                    animationDelay: 200,
                    endLabel: {
                        show: true,
                        formatter: 'LPs Δ +•k$',
                        color: textOpacity,
                        fontSize: 12,
                        offset: [5, 0],
                        backgroundColor: colors.hyperEvmLp + '08',
                        padding: [2, 4],
                        borderRadius: 4,
                    },
                },
                // Wallet skeleton
                {
                    name: 'Wallet Δ',
                    type: 'line',
                    data: createSkeletonData(2, 60, 100),
                    smooth: false,
                    symbol: 'none',
                    lineStyle: {
                        color: colors.hyperEvmBalances,
                        width: 2,
                        opacity: 0.3,
                    },
                    animation: true,
                    animationDuration: 3000,
                    animationDelay: 400,
                    endLabel: {
                        show: true,
                        formatter: 'Wallet Δ +•k$',
                        color: textOpacity,
                        fontSize: 12,
                        offset: [5, 0],
                        backgroundColor: colors.hyperEvmBalances + '08',
                        padding: [2, 4],
                        borderRadius: 4,
                    },
                },
                // Perps skeleton
                {
                    name: 'Perps Δ',
                    type: 'line',
                    data: createSkeletonData(3, 70, -200),
                    smooth: false,
                    symbol: 'none',
                    lineStyle: {
                        color: colors.hyperCorePerp,
                        width: 2,
                        opacity: 0.3,
                    },
                    animation: true,
                    animationDuration: 3000,
                    animationDelay: 600,
                    endLabel: {
                        show: true,
                        formatter: 'Perps Δ -•k$',
                        color: textOpacity,
                        fontSize: 12,
                        offset: [5, 0],
                        backgroundColor: colors.hyperCorePerp + '08',
                        padding: [2, 4],
                        borderRadius: 4,
                    },
                },
                // Net Delta skeleton with dashed line
                {
                    name: 'Net Δ',
                    type: 'line',
                    data: createSkeletonData(4, 50, 50),
                    smooth: false,
                    symbol: 'none',
                    lineStyle: {
                        color: netDeltaColor,
                        width: 2,
                        type: 'dashed',
                        opacity: 0.3,
                    },
                    areaStyle: {
                        opacity: 0.05,
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: netDeltaColor + '10',
                                },
                                {
                                    offset: 1,
                                    color: netDeltaColor + '00',
                                },
                            ],
                        },
                    },
                    animation: true,
                    animationDuration: 3000,
                    animationDelay: 800,
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
                                    opacity: 0.3,
                                },
                            },
                        ],
                    },
                    endLabel: {
                        show: true,
                        formatter: 'Net Δ +•k$',
                        color: textOpacity,
                        fontSize: 12,
                        offset: [5, 0],
                        backgroundColor: netDeltaColor + '08',
                        padding: [2, 4],
                        borderRadius: 4,
                    },
                },
                // Spots skeleton
                {
                    name: 'Spots Δ',
                    type: 'line',
                    data: createSkeletonData(5, 40, -50),
                    smooth: false,
                    symbol: 'none',
                    lineStyle: {
                        color: colors.hyperCoreSpot,
                        width: 2,
                        opacity: 0.3,
                    },
                    animation: true,
                    animationDuration: 3000,
                    animationDelay: 1000,
                    endLabel: {
                        show: true,
                        formatter: 'Spots Δ -•k$',
                        color: textOpacity,
                        fontSize: 12,
                        offset: [5, 0],
                        backgroundColor: colors.hyperCoreSpot + '08',
                        padding: [2, 4],
                        borderRadius: 4,
                    },
                },
            ],
        }
    }, [colors, resolvedTheme])

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

    // Show skeleton briefly on initial load for better UX
    useEffect(() => {
        if (isInitialLoad) {
            setOptions(createLoadingOptions())
            const timer = setTimeout(() => {
                setIsInitialLoad(false)
            }, 1500) // Show skeleton for 1.5 seconds
            return () => clearTimeout(timer)
        }
    }, [isInitialLoad, createLoadingOptions])

    useEffect(() => {
        // Skip if still showing initial loading state
        if (isInitialLoad) return

        // 1. get stored snapshots
        let storedSnapshots = getSnapshots()

        // Show loading skeleton if no data
        if (storedSnapshots.length === 0) {
            setOptions(createLoadingOptions())
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
        const strategyDeltasUSD: Array<[number, number]> = []
        const spotDeltasUSD: Array<[number, number]> = []
        const balancesDeltasUSD: Array<[number, number]> = []
        const totalCapitalUSD: Array<[number, number]> = []
        const deployedAUM: Array<[number, number]> = []

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
            const strategyUSD = (snapshot.metrics.portfolio.strategyDelta || 0) * hypePrice
            const totalUSD = snapshot.metrics.portfolio.totalUSD

            // Calculate deployed AUM (LPs + Perps value in USD)
            const deployedUSD =
                snapshot.metrics.portfolio.deployedAUM || snapshot.metrics.hyperEvm.values.lpsUSD + snapshot.metrics.hyperCore.values.perpsUSD

            // For time axis, data must be [timestamp, value] pairs
            lpDeltasUSD.push([timestamp, lpUSD])
            perpDeltasUSD.push([timestamp, perpUSD])
            spotDeltasUSD.push([timestamp, spotUSD])
            balancesDeltasUSD.push([timestamp, balancesUSD])
            netDeltasUSD.push([timestamp, netUSD])
            strategyDeltasUSD.push([timestamp, strategyUSD])
            totalCapitalUSD.push([timestamp, totalUSD])
            deployedAUM.push([timestamp, deployedUSD])
        })

        // Use theme-aware colors
        const netDeltaColor = colors.charts.text || '#ffffff'
        const aumColor = resolvedTheme === 'dark' ? '#ffffff' : '#000000'

        // 4. prepare series data
        const echartsOptions: EChartsOption = {
            animation: true,
            animationDuration: 300,
            animationEasing: 'cubicInOut',
            tooltip: {
                trigger: 'axis',
                triggerOn: 'mousemove',
                backgroundColor: resolvedTheme === 'dark' ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1,
                borderRadius: 12,
                padding: [8, 12],
                extraCssText: `z-index: 99999; backdrop-filter: blur(12px) saturate(120%); -webkit-backdrop-filter: blur(12px) saturate(120%); box-shadow: 0 8px 32px rgba(0, 0, 0, ${resolvedTheme === 'dark' ? '0.2' : '0.1'});`,
                appendToBody: true,
                hideDelay: 0,
                transitionDuration: 0,
                enterable: false,
                confine: false,
                alwaysShowContent: false,
                show: true,
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
                        // Skip formatting for AUM and Deployed AUM series
                        if (param.seriesName === ChartSeries.AUM || param.seriesName === ChartSeries.DeployedAUM) {
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
                    {
                        name: ChartSeries.AUM,
                        textStyle: {
                            color: aumColor,
                        },
                    },
                    {
                        name: ChartSeries.DeployedAUM,
                        textStyle: {
                            color: aumColor,
                        },
                    },
                    {
                        name: ChartSeries.HyperEvmLps,
                        textStyle: {
                            color: colors.hyperEvmLp,
                        },
                    },
                    {
                        name: ChartSeries.HyperEvmBalances,
                        textStyle: {
                            color: colors.hyperEvmBalances,
                        },
                    },
                    {
                        name: ChartSeries.HyperCorePerps,
                        textStyle: {
                            color: colors.hyperCorePerp,
                        },
                    },
                    {
                        name: ChartSeries.HyperCoreSpots,
                        textStyle: {
                            color: colors.hyperCoreSpot,
                        },
                    },
                    {
                        name: ChartSeries.StrategyDelta,
                        textStyle: {
                            color: netDeltaColor,
                        },
                    },
                    {
                        name: ChartSeries.NetDelta,
                        textStyle: {
                            color: netDeltaColor,
                        },
                    },
                ],
                top: 10,
                selected: {
                    [ChartSeries.AUM]: false,
                    [ChartSeries.DeployedAUM]: true,
                    [ChartSeries.HyperEvmLps]: true,
                    [ChartSeries.HyperEvmBalances]: false,
                    [ChartSeries.HyperCorePerps]: true,
                    [ChartSeries.HyperCoreSpots]: false,
                    [ChartSeries.StrategyDelta]: true,
                    [ChartSeries.NetDelta]: false,
                },
                icon: 'roundRect',
                itemWidth: 14,
                itemHeight: 8,
                itemGap: 15,
                inactiveColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
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
                itemSize: 10,
                top: 15,
                right: 0,
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
                    min: 'dataMin',
                    max: 'dataMax',
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
                    name: ChartSeries.AUM,
                    type: 'line',
                    data: totalCapitalUSD,
                    smooth: false,
                    symbol: 'circle',
                    symbolSize: 6,
                    showSymbol: true,
                    yAxisIndex: 0,
                    lineStyle: {
                        color: aumColor,
                        width: 2,
                        type: 'solid',
                    },
                    itemStyle: {
                        color: aumColor,
                    },
                    emphasis: {
                        focus: 'series',
                    },
                    endLabel: {
                        show: true,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter: (params: any) => {
                            const value = Array.isArray(params.value) ? params.value[1] : params.value || 0
                            return `${ChartSeries.AUM} ${formatUSD(value)}`
                        },
                        color: aumColor,
                        fontSize: 12,
                        offset: [5, 0],
                        backgroundColor: aumColor + '15',
                        padding: [2, 4],
                        borderRadius: 4,
                    },
                },
                {
                    name: ChartSeries.DeployedAUM,
                    type: 'line',
                    data: deployedAUM,
                    smooth: false,
                    symbol: 'circle',
                    symbolSize: 6,
                    showSymbol: true,
                    yAxisIndex: 0,
                    z: 5,
                    lineStyle: {
                        color: aumColor,
                        width: 2,
                        type: 'dotted',
                        opacity: 0.8,
                    },
                    itemStyle: {
                        color: aumColor,
                    },
                    emphasis: {
                        focus: 'series',
                    },
                    endLabel: {
                        show: true,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter: (params: any) => {
                            const value = Array.isArray(params.value) ? params.value[1] : params.value || 0
                            return `Deployed ${formatUSD(value)}`
                        },
                        color: aumColor,
                        fontSize: 12,
                        offset: [5, 0],
                        backgroundColor: aumColor + '15',
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
                        type: 'solid',
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
                            const formattedValue = numeral(value).format('+0,0a$')
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
                        type: 'solid',
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
                            const formattedValue = numeral(value).format('+0,0a$')
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
                        type: 'solid',
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
                            const formattedValue = numeral(value).format('+0,0a$')
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
                        type: 'dashed',
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
                            const formattedValue = numeral(value).format('+0,0a$')
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
                    name: ChartSeries.StrategyDelta,
                    type: 'line',
                    data: strategyDeltasUSD,
                    smooth: false,
                    symbol: 'circle',
                    symbolSize: 6,
                    showSymbol: true,
                    lineStyle: {
                        color: netDeltaColor,
                        width: 2,
                        type: 'dashed',
                    },
                    itemStyle: {
                        color: netDeltaColor,
                    },
                    areaStyle: {
                        opacity: 0.15,
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: netDeltaColor + '30', // 19% opacity
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
                    z: 9,
                    endLabel: {
                        show: true,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter: (params: any) => {
                            const value = Array.isArray(params.value) ? params.value[1] : params.value || 0
                            const formattedValue = numeral(value).format('+0,0a$')
                            return `${ChartSeries.StrategyDelta} ${formattedValue}`
                        },
                        color: netDeltaColor,
                        fontSize: 12,
                        fontWeight: 600,
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
                        type: 'solid',
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
                            const formattedValue = numeral(value).format('+0,0a$')
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
                    height: 18,
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
                    width: 16,
                    left: 12,
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
    }, [lastSnapshotAddedAt, resolvedTheme, isInitialLoad])

    if (!options) {
        return (
            <div className="flex h-[400px] w-full items-center justify-center md:h-[500px]">
                <div className="text-default/50">Loading chart...</div>
            </div>
        )
    }

    return (
        <EchartWrapper options={options} className="size-full h-[400px] md:h-[500px]" onDataZoomChange={handleDataZoom} onRestore={handleRestore} />
    )
}
