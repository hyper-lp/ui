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
import { CHART_SERIES_NAMES, SECTION_CONFIG, SectionType } from '@/config/sections.config'

const DEFAULT_VISIBLE_POINTS = 10 // Number of points to show by default in dataZoom

const grid = {
    top: 70,
    right: 140,
    bottom: 50,
    left: 50,
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

export const ChartSeries = {
    hyperLpBalance: CHART_SERIES_NAMES.hyperLpBalance,
    DeployedAUM: CHART_SERIES_NAMES.deployedAUM,
    LongEVM: SECTION_CONFIG[SectionType.LONG_EVM].chartSeriesName, // Combined LP + HyperDrive
    HyperEvmBalances: CHART_SERIES_NAMES.wallet,
    HyperCorePerps: CHART_SERIES_NAMES.perps,
    HyperCoreSpots: CHART_SERIES_NAMES.spots,
    StrategyDelta: CHART_SERIES_NAMES.strategyDelta,
    NetDelta: CHART_SERIES_NAMES.netDelta,
} as const

export default function DeltaTrackingChart() {
    const [options, setOptions] = useState<EChartsOption | null>(null)
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const { resolvedTheme } = useTheme()
    const colors = getThemeColors(resolvedTheme)

    // Store legend selection state to persist between refreshes
    const legendSelectionRef = useRef<Record<string, boolean> | null>(null)

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
            graphic: [
                {
                    type: 'text',
                    left: 'center',
                    top: 'center',
                    z: 0,
                    style: {
                        text: 'hyperlp.xyz',
                        fontSize: 48,
                        fontWeight: 'bold',
                        fill: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    },
                },
            ],
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
                    { name: ChartSeries.hyperLpBalance, itemStyle: { color: aumColor }, textStyle: { color: textOpacity } },
                    { name: ChartSeries.DeployedAUM, itemStyle: { color: aumColor }, textStyle: { color: textOpacity } },
                    { name: ChartSeries.LongEVM, itemStyle: { color: colors.hyperEvmLp }, textStyle: { color: textOpacity } },
                    { name: ChartSeries.HyperEvmBalances, itemStyle: { color: colors.hyperEvmBalances }, textStyle: { color: textOpacity } },
                    { name: ChartSeries.HyperCorePerps, itemStyle: { color: colors.hyperCorePerp }, textStyle: { color: textOpacity } },
                    { name: ChartSeries.HyperCoreSpots, itemStyle: { color: colors.hyperCoreSpot }, textStyle: { color: textOpacity } },
                    { name: ChartSeries.StrategyDelta, itemStyle: { color: netDeltaColor }, textStyle: { color: textOpacity } },
                ],
                top: 10,
                icon: 'roundRect',
                itemWidth: 14,
                itemHeight: 8,
                itemGap: 15,
                selected: legendSelectionRef.current || {
                    [ChartSeries.DeployedAUM]: true,
                    [ChartSeries.LongEVM]: true,
                    [ChartSeries.HyperEvmBalances]: false,
                    [ChartSeries.HyperCorePerps]: true,
                    [ChartSeries.HyperCoreSpots]: false,
                    [ChartSeries.StrategyDelta]: true,
                },
                inactiveColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            },
            series: [
                // HyperLP balance skeleton
                {
                    name: ChartSeries.hyperLpBalance,
                    type: 'line',
                    data: createSkeletonData(0, 100, 1000),
                    smooth: false,
                    symbol: 'circle',
                    symbolSize: 6,
                    showSymbol: true,
                    lineStyle: {
                        color: aumColor,
                        width: 2,
                        opacity: 0.3,
                        type: 'dotted',
                    },
                    itemStyle: {
                        color: aumColor,
                        opacity: 0.3,
                    },
                    animation: true,
                    animationDuration: 3000,
                    animationDelay: 0,
                    endLabel: {
                        show: true,
                        formatter: 'HyperLP $••,•••',
                        color: textOpacity,
                        fontSize: 14,
                        offset: [5, 0],
                        backgroundColor: aumColor + '08',
                        padding: [2, 4],
                        borderRadius: 4,
                    },
                },
                // Deployed AUM skeleton (Deployed AUM)
                {
                    name: ChartSeries.DeployedAUM,
                    type: 'line',
                    data: createSkeletonData(0, 100, 1000),
                    smooth: false,
                    symbol: 'circle',
                    symbolSize: 6,
                    showSymbol: true,
                    lineStyle: {
                        color: aumColor,
                        width: 2,
                        opacity: 0.3,
                        type: 'dotted',
                    },
                    itemStyle: {
                        color: aumColor,
                        opacity: 0.3,
                    },
                    animation: true,
                    animationDuration: 3000,
                    animationDelay: 0,
                    endLabel: {
                        show: true,
                        formatter: 'Deployed $••,•••',
                        color: textOpacity,
                        fontSize: 14,
                        offset: [5, 0],
                        backgroundColor: aumColor + '08',
                        padding: [2, 4],
                        borderRadius: 4,
                    },
                },
                // Yield leg skeleton (LP + HyperDrive)
                {
                    name: ChartSeries.LongEVM,
                    type: 'line',
                    data: createSkeletonData(1, 80, 300),
                    smooth: false,
                    symbol: 'circle',
                    symbolSize: 6,
                    showSymbol: true,
                    lineStyle: {
                        color: colors.hyperEvmLp,
                        width: 2,
                        opacity: 0.3,
                    },
                    itemStyle: {
                        color: colors.hyperEvmLp,
                        opacity: 0.3,
                    },
                    animation: true,
                    animationDuration: 3000,
                    animationDelay: 200,
                    endLabel: {
                        show: true,
                        formatter: `${SECTION_CONFIG[SectionType.LONG_EVM].chartSeriesName} +•k$`,
                        color: textOpacity,
                        fontSize: 14,
                        offset: [5, 0],
                        backgroundColor: colors.hyperEvmLp + '08',
                        padding: [2, 4],
                        borderRadius: 4,
                    },
                },
                // Wallet skeleton
                {
                    name: ChartSeries.HyperEvmBalances,
                    type: 'line',
                    data: createSkeletonData(2, 60, 100),
                    smooth: false,
                    symbol: 'circle',
                    symbolSize: 6,
                    showSymbol: true,
                    lineStyle: {
                        color: colors.hyperEvmBalances,
                        width: 2,
                        opacity: 0.3,
                    },
                    itemStyle: {
                        color: colors.hyperEvmBalances,
                        opacity: 0.3,
                    },
                    animation: true,
                    animationDuration: 3000,
                    animationDelay: 400,
                    endLabel: {
                        show: true,
                        formatter: 'Wallet Δ +•k$',
                        color: textOpacity,
                        fontSize: 14,
                        offset: [5, 0],
                        backgroundColor: colors.hyperEvmBalances + '08',
                        padding: [2, 4],
                        borderRadius: 4,
                    },
                },
                // Perps skeleton
                {
                    name: ChartSeries.HyperCorePerps,
                    type: 'line',
                    data: createSkeletonData(3, 70, -200),
                    smooth: false,
                    symbol: 'circle',
                    symbolSize: 6,
                    showSymbol: true,
                    lineStyle: {
                        color: colors.hyperCorePerp,
                        width: 2,
                        opacity: 0.3,
                    },
                    itemStyle: {
                        color: colors.hyperCorePerp,
                        opacity: 0.3,
                    },
                    animation: true,
                    animationDuration: 3000,
                    animationDelay: 600,
                    endLabel: {
                        show: true,
                        formatter: 'Perps Δ -•k$',
                        color: textOpacity,
                        fontSize: 14,
                        offset: [5, 0],
                        backgroundColor: colors.hyperCorePerp + '08',
                        padding: [2, 4],
                        borderRadius: 4,
                    },
                },
                // Spots skeleton
                {
                    name: ChartSeries.HyperCoreSpots,
                    type: 'line',
                    data: createSkeletonData(4, 40, 50),
                    smooth: false,
                    symbol: 'circle',
                    symbolSize: 6,
                    showSymbol: true,
                    lineStyle: {
                        color: colors.hyperCoreSpot,
                        width: 2,
                        opacity: 0.3,
                    },
                    itemStyle: {
                        color: colors.hyperCoreSpot,
                        opacity: 0.3,
                    },
                    animation: true,
                    animationDuration: 3000,
                    animationDelay: 700,
                    endLabel: {
                        show: true,
                        formatter: 'Spots Δ +•k$',
                        color: textOpacity,
                        fontSize: 14,
                        offset: [5, 0],
                        backgroundColor: colors.hyperCoreSpot + '08',
                        padding: [2, 4],
                        borderRadius: 4,
                    },
                },
                // Strategy Delta skeleton with dashed line
                {
                    name: ChartSeries.StrategyDelta,
                    type: 'line',
                    data: createSkeletonData(5, 50, 50),
                    smooth: false,
                    symbol: 'circle',
                    symbolSize: 7,
                    showSymbol: true,
                    lineStyle: {
                        color: netDeltaColor,
                        width: 3,
                        type: 'dashed',
                        opacity: 0.3,
                    },
                    itemStyle: {
                        color: netDeltaColor,
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
                        formatter: 'Strategy Δ +•k$',
                        color: textOpacity,
                        fontSize: 14,
                        offset: [5, 0],
                        backgroundColor: netDeltaColor + '08',
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
                    start: 50,
                    end: 100,
                },
                // X-axis slider
                {
                    type: 'slider',
                    xAxisIndex: 0,
                    start: 50,
                    end: 100,
                    height: 18,
                    bottom: 15,
                    backgroundColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.01)' : 'rgba(0, 0, 0, 0.01)',
                    borderColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                    fillerColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                    handleStyle: {
                        color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                        borderColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                        borderWidth: 1,
                    },
                    moveHandleStyle: {
                        color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                        borderColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                    },
                    dataBackground: {
                        lineStyle: {
                            color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                        },
                        areaStyle: {
                            color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.015)',
                        },
                    },
                    textStyle: {
                        color: textOpacity,
                    },
                    show: true,
                },
                // Y-axis slider
                {
                    type: 'slider',
                    yAxisIndex: 0,
                    start: 0,
                    end: 100,
                    width: 16,
                    left: 12,
                    backgroundColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.01)' : 'rgba(0, 0, 0, 0.01)',
                    borderColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                    fillerColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                    handleStyle: {
                        color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                        borderColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                        borderWidth: 1,
                    },
                    moveHandleStyle: {
                        color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
                        borderColor: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                    },
                    dataBackground: {
                        lineStyle: {
                            color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                        },
                        areaStyle: {
                            color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.015)',
                        },
                    },
                    textStyle: {
                        color: textOpacity,
                    },
                    show: true,
                },
            ],
        }
    }, [colors, resolvedTheme])

    // Store dataZoom range to persist between refreshes
    const [, setZoomRange] = useState<{ x: { start: number; end: number }; y: { start: number; end: number } } | null>(null)
    const zoomRangeRef = useRef<{ x: { start: number; end: number }; y: { start: number; end: number } } | null>(null)

    // Store legend selection state to persist between refreshes
    const [, setLegendSelection] = useState<Record<string, boolean> | null>(null)

    // Get historical snapshots and rebalance events from the app store
    const getSnapshots = useAppStore((state) => state.getSnapshots)
    const rebalanceEvents = useAppStore((state) => state.rebalanceEvents)
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

    // Handle legend selection changes
    const handleLegendSelectChanged = useCallback((selected: Record<string, boolean>) => {
        setLegendSelection(selected)
        legendSelectionRef.current = selected
    }, [])

    // Handle reset/restore from toolbox
    const handleRestore = useCallback(() => {
        // Clear the persisted zoom state
        zoomRangeRef.current = null
        setZoomRange(null)
        // Clear the persisted legend selection state
        legendSelectionRef.current = null
        setLegendSelection(null)
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

        try {
            // 1. get stored snapshots
            let storedSnapshots = getSnapshots()
            console.log(
                `[DeltaTrackingChart] Re-rendering with ${storedSnapshots.length} snapshots, trigger: lastSnapshotAddedAt=${lastSnapshotAddedAt}`,
            )

            // Show loading skeleton if no data
            if (storedSnapshots.length === 0) {
                setOptions(createLoadingOptions())
                return
            }

            // If only 1 data point, duplicate it with a 1 second offset to show lines
            if (storedSnapshots.length === 1) {
                const singleSnapshot = storedSnapshots[0]
                if (singleSnapshot && singleSnapshot.timestamp) {
                    const duplicateSnapshot = {
                        ...singleSnapshot,
                        timestamp: singleSnapshot.timestamp - 1000, // Subtract 1 second
                    }
                    storedSnapshots = [duplicateSnapshot, singleSnapshot]
                }
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

            // Filter out snapshots that don't comply with current schema
            const validSnapshots = storedSnapshots.filter((snapshot) => {
                // Check for required structure
                if (!snapshot || !snapshot.metrics) {
                    console.warn('[DeltaTrackingChart] Skipping snapshot without metrics:', snapshot)
                    return false
                }

                // Validate current schema structure
                if (!snapshot.metrics.longLegs || !Array.isArray(snapshot.metrics.longLegs)) {
                    console.warn('[DeltaTrackingChart] Skipping legacy snapshot (missing longLegs array):', snapshot.timestamp)
                    return false
                }

                if (!snapshot.metrics.shortLegs || !snapshot.metrics.shortLegs.values) {
                    console.warn('[DeltaTrackingChart] Skipping snapshot without shortLegs.values:', snapshot.timestamp)
                    return false
                }

                if (!snapshot.metrics.idle || !snapshot.metrics.idle.deltas) {
                    console.warn('[DeltaTrackingChart] Skipping snapshot without idle.deltas:', snapshot.timestamp)
                    return false
                }

                if (!snapshot.metrics.portfolio) {
                    console.warn('[DeltaTrackingChart] Skipping snapshot without portfolio metrics:', snapshot.timestamp)
                    return false
                }

                return true
            })

            if (validSnapshots.length === 0) {
                console.warn('[DeltaTrackingChart] No valid snapshots after filtering')
                setOptions(createLoadingOptions())
                return
            }

            if (validSnapshots.length !== storedSnapshots.length) {
                console.log(
                    `[DeltaTrackingChart] Filtered ${storedSnapshots.length - validSnapshots.length} invalid snapshots, ${validSnapshots.length} remain`,
                )
            }

            validSnapshots.forEach((snapshot) => {
                const timestamp = snapshot.timestamp

                // Use the price from the snapshot if available, otherwise use fallback
                const hypePrice = snapshot.prices?.HYPE || 0

                // Extract deltas - aggregate all long legs (LP + HyperDrive)
                const lpMetrics = snapshot.metrics.longLegs?.find((l) => l.type === 'lp')
                const hyperdriveMetrics = snapshot.metrics.longLegs?.find((l) => l.type === 'hyperdrive')
                const lpDeltaHYPE = lpMetrics?.metrics?.totalDeltaHYPE || 0
                const hyperdriveDeltaHYPE = hyperdriveMetrics?.metrics?.totalDeltaHYPE || 0
                const totalLongDeltaHYPE = lpDeltaHYPE + hyperdriveDeltaHYPE
                const lpUSD = totalLongDeltaHYPE * hypePrice

                const perpUSD = -(snapshot.metrics.shortLegs?.values?.perpsNotionalUSD || 0) - (snapshot.metrics.shortLegs?.values?.perpsPnlUSD || 0)
                const spotUSD = (snapshot.metrics.idle?.deltas?.spotDeltaHYPE || 0) * hypePrice
                const balancesUSD = (snapshot.metrics.idle?.deltas?.balancesDeltaHYPE || 0) * hypePrice

                const netUSD = (snapshot.metrics.portfolio?.netDeltaHYPE || 0) * hypePrice
                // const strategyUSD = ((snapshot.metrics.portfolio?.strategyDelta || 0) * hypePrice)
                const totalUSD = snapshot.metrics.portfolio?.totalValueUSD || 0
                const deployedUSD = snapshot.metrics.portfolio?.deployedValueUSD || 0

                // For time axis, data must be [timestamp, value] pairs
                lpDeltasUSD.push([timestamp, lpUSD])
                perpDeltasUSD.push([timestamp, perpUSD])
                spotDeltasUSD.push([timestamp, spotUSD])
                balancesDeltasUSD.push([timestamp, balancesUSD])
                netDeltasUSD.push([timestamp, netUSD])
                // strategyDeltasUSD.push([timestamp, strategyUSD])
                strategyDeltasUSD.push([timestamp, lpUSD + perpUSD])
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
                graphic: [
                    {
                        type: 'text',
                        left: 'center',
                        top: 'center',
                        z: 0,
                        style: {
                            text: 'hyperlp.xyz',
                            fontSize: 48,
                            fontWeight: 'bold',
                            fill: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        },
                    },
                ],
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
                        const deployedAUM = snapshot?.metrics.portfolio.deployedValueUSD || 0
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

                        // Define custom sort order for tooltip items
                        const seriesOrder = [
                            ChartSeries.hyperLpBalance,
                            ChartSeries.DeployedAUM,
                            ChartSeries.LongEVM,
                            ChartSeries.HyperEvmBalances,
                            ChartSeries.HyperCorePerps,
                            ChartSeries.HyperCoreSpots,
                            ChartSeries.StrategyDelta,
                            ChartSeries.NetDelta,
                        ]

                        // Sort params based on defined order
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const sortedParams = uniqueParams.sort((a: any, b: any) => {
                            const aIndex = seriesOrder.indexOf(a.seriesName)
                            const bIndex = seriesOrder.indexOf(b.seriesName)
                            return aIndex - bIndex
                        })

                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        sortedParams.forEach((param: any) => {
                            // Skip formatting for AUM and Deployed AUM series
                            if (param.seriesName === ChartSeries.hyperLpBalance || param.seriesName === ChartSeries.DeployedAUM) {
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
                            const deltaPercent = deployedAUM > 0 ? Math.abs(value / deployedAUM) * 100 : 0

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
                                        <span style="font-size: 11px; font-weight: 500;">${numeral(hypeAmount).format('+0,0.00')}</span>
                                        <img src="/tokens/HYPE.jpg" style="width: 12px; height: 12px; border-radius: 50%;" />
                                        <span style="font-size: 11px; font-weight: 500;">(${numeral(value).format('+0,0a')}$)</span>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-left: 16px;">
                                    <span style="color: ${textColor}; font-size: 11px;">${deltaPercent.toFixed(0)}% of Deployed AUM</span>
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
                            name: ChartSeries.hyperLpBalance,
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
                            name: ChartSeries.LongEVM,
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
                        // {
                        //     name: ChartSeries.NetDelta,
                        //     textStyle: {
                        //         color: netDeltaColor,
                        //     },
                        // },
                    ],
                    top: 10,
                    selected: legendSelectionRef.current || {
                        [ChartSeries.hyperLpBalance]: false,
                        [ChartSeries.DeployedAUM]: false,
                        [ChartSeries.LongEVM]: true,
                        [ChartSeries.HyperEvmBalances]: false,
                        [ChartSeries.HyperCorePerps]: true,
                        [ChartSeries.HyperCoreSpots]: false,
                        [ChartSeries.StrategyDelta]: true,
                        // [ChartSeries.NetDelta]: false,
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
                            yAxisIndex: false,
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
                        dataView: {
                            show: true,
                            title: 'Raw Data',
                            lang: ['Data View', 'Turn Off', 'Refresh'],
                            backgroundColor: resolvedTheme === 'dark' ? '#1a1a1a' : '#ffffff',
                            textareaColor: resolvedTheme === 'dark' ? '#2a2a2a' : '#f5f5f5',
                            textareaBorderColor: resolvedTheme === 'dark' ? '#404040' : '#d1d5db',
                            textColor: resolvedTheme === 'dark' ? '#ffffff' : '#000000',
                            buttonColor: resolvedTheme === 'dark' ? '#3b82f6' : '#2563eb',
                            buttonTextColor: '#ffffff',
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
                        showMaxLabel: true,
                        fontSize: 10,
                        opacity: 0.5,
                        interval: 'auto',
                        hideOverlap: true,
                        show: true,
                        color: colors.charts.text,
                        formatter: (value: number) => DAYJS_FORMATS.dateTimeChart(value),
                        align: 'center',
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
                        name: ChartSeries.hyperLpBalance,
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
                                return `HyperLP ${formatUSD(value)}`
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
                        name: ChartSeries.LongEVM,
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
                                return `${SECTION_CONFIG[SectionType.LONG_EVM].chartSeriesName} ${formattedValue}`
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
                    // {
                    //     name: ChartSeries.NetDelta,
                    //     type: 'line',
                    //     data: netDeltasUSD,
                    //     smooth: false,
                    //     symbol: 'circle',
                    //     symbolSize: 6,
                    //     showSymbol: true,
                    //     lineStyle: {
                    //         color: netDeltaColor,
                    //         width: 2,
                    //         type: 'solid',
                    //         opacity: 0.5,
                    //     },
                    //     itemStyle: {
                    //         color: netDeltaColor,
                    //         opacity: 0.5,
                    //     },
                    //     emphasis: {
                    //         focus: 'series',
                    //     },
                    //     z: 8,
                    //     endLabel: {
                    //         show: true,
                    //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    //         formatter: (params: any) => {
                    //             const value = Array.isArray(params.value) ? params.value[1] : params.value || 0
                    //             // Hide label if value is very close to 0
                    //             if (Math.abs(value) < 1) return ''
                    //             const formattedValue = numeral(value).format('+0,0a$')
                    //             return `${ChartSeries.NetDelta} ${formattedValue}`
                    //         },
                    //         color: netDeltaColor,
                    //         fontSize: 12,
                    //         offset: [5, 0],
                    //         backgroundColor: netDeltaColor + '15',
                    //         padding: [2, 4],
                    //         borderRadius: 4,
                    //     },
                    // },
                    {
                        name: ChartSeries.StrategyDelta,
                        type: 'line',
                        data: strategyDeltasUSD,
                        smooth: false,
                        symbol: 'circle',
                        symbolSize: 7,
                        showSymbol: true,
                        lineStyle: {
                            color: netDeltaColor,
                            width: 3,
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
                        markLine: {
                            silent: false,
                            symbol: 'none',
                            animation: false,
                            data: (() => {
                                const markLineData = (rebalanceEvents || []).map((event) => {
                                    const timestamp = new Date(event.timestamp).getTime()
                                    // Extract summary from metadata, fallback to 'Rebalance' if not available
                                    let summary = event.metadata?.summary || 'Rebalance'

                                    // Capitalize DEX names in the summary
                                    summary = summary
                                        .replace(/\bhyperswap\b/gi, 'Hyperswap')
                                        .replace(/\bhybra\b/gi, 'Hybra')
                                        .replace(/\bhyperbrick\b/gi, 'HyperBrick')
                                        .replace(/\bprjtx\b/gi, 'PRJTX')
                                        .replace(/\bproject[\s-]?x\b/gi, 'Project X')
                                    // console.log(
                                    //     '[DeltaTrackingChart] Adding markLine for rebalance at:',
                                    //     new Date(event.timestamp).toISOString(),
                                    //     'timestamp:',
                                    //     timestamp,
                                    //     'summary:',
                                    //     summary,
                                    // )
                                    return {
                                        xAxis: timestamp,
                                        label: {
                                            show: true,
                                            formatter: summary,
                                            position: 'middle' as const,
                                            color: colors.hyperEvmLp,
                                            fontSize: 10,
                                            rotate: 90, // Rotate text vertically
                                        },
                                        lineStyle: {
                                            color: colors.hyperEvmLp, // Same color as LP series
                                            type: 'dashed' as const,
                                            width: 2, // Thicker line
                                            opacity: 0.6, // Slightly transparent
                                        },
                                    }
                                })
                                return markLineData
                            })(),
                        },
                        endLabel: {
                            show: true,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            formatter: (params: any) => {
                                const value = Array.isArray(params.value) ? params.value[1] : params.value || 0
                                const formattedValue = numeral(value).format('+0,0a$')
                                return `${ChartSeries.StrategyDelta} ${formattedValue}`
                            },
                            color: netDeltaColor,
                            fontSize: 14,
                            fontWeight: 600,
                            offset: [5, 0],
                            backgroundColor: netDeltaColor + '15',
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
                    // Y-axis slider (manual control only, no inside zoom)
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
        } catch (error) {
            console.error('[DeltaTrackingChart] Error processing snapshots:', error)
            setOptions(createLoadingOptions())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastSnapshotAddedAt, resolvedTheme, isInitialLoad, rebalanceEvents])

    if (!options) {
        return (
            <div className="flex h-[400px] w-full items-center justify-center md:h-[480px]">
                <div className="text-default/50">Loading chart...</div>
            </div>
        )
    }

    return (
        <EchartWrapper
            options={options}
            className="h-[400px] w-full md:h-[480px]"
            onDataZoomChange={handleDataZoom}
            onLegendSelectChanged={handleLegendSelectChanged}
            onRestore={handleRestore}
        />
    )
}
