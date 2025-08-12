'use client'

import React, { useEffect, useRef, memo, useState } from 'react'
import type * as echarts from 'echarts'
import { cn } from '@/utils'

export function ChartBackground({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <div className={`rounded-lg bg-card p-4 ${className}`}>{children}</div>
}

export function LoadingArea() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="text-secondary">Loading...</div>
        </div>
    )
}

export function CustomFallback() {
    return (
        <div className="flex h-[400px] w-full items-center justify-center rounded-lg bg-card">
            <div className="text-secondary">Loading chart...</div>
        </div>
    )
}

interface InterfaceEchartWrapperProps {
    options: echarts.EChartsOption
    id?: string
    onPointClick?: (params: unknown) => void
    onDataZoomChange?: (start: number, end: number) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMouseOver?: (params: any) => void
    onMouseOut?: () => void
    className?: string
}

function EchartWrapperOptimized(props: InterfaceEchartWrapperProps) {
    const chartRef = useRef<HTMLDivElement>(null)
    const myChart = useRef<echarts.ECharts | null>(null)
    const [echartsModule, setEchartsModule] = useState<typeof echarts | null>(null)
    const handleChartResize = () => myChart.current?.resize()

    useEffect(() => {
        let isSubscribed = true

        const loadEcharts = async () => {
            const echartsLib = await import('echarts')
            if (isSubscribed) {
                setEchartsModule(echartsLib)
            }
        }

        loadEcharts()

        return () => {
            isSubscribed = false
        }
    }, [])

    useEffect(() => {
        if (!echartsModule || !chartRef.current) return

        if (!myChart.current) {
            myChart.current = echartsModule.init(chartRef.current)
        }

        myChart.current.setOption(props.options)

        if (props.onPointClick) {
            myChart.current.off('click')
            myChart.current.on('click', props.onPointClick)
        }

        if (props.onDataZoomChange) {
            myChart.current.off('dataZoom')
            myChart.current.on('dataZoom', (params: unknown) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { start, end } = params as any
                props.onDataZoomChange?.(start, end)
            })
        }

        if (props.onMouseOver) {
            myChart.current.off('mouseover')
            myChart.current.on('mouseover', props.onMouseOver)
        }

        if (props.onMouseOut) {
            myChart.current.off('mouseout')
            myChart.current.on('mouseout', props.onMouseOut)
        }

        window.addEventListener('resize', handleChartResize)

        return () => {
            window.removeEventListener('resize', handleChartResize)
        }
    }, [echartsModule, props])

    useEffect(() => {
        return () => {
            if (myChart.current) {
                myChart.current.dispose()
                myChart.current = null
            }
        }
    }, [])

    if (!echartsModule) {
        return <CustomFallback />
    }

    return <div ref={chartRef} className={cn('h-full w-full', props.className)} />
}

export default memo(EchartWrapperOptimized)
