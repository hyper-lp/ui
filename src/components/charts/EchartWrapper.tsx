'use client'

import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import * as ecStat from 'echarts-stat'
import { cn } from '@/utils'

/**
 * ------------------------ helper
 */

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

/**
 * ------------------------ wrapper
 */

interface InterfaceEchartWrapperProps {
    options: echarts.EChartsOption
    id?: string
    onPointClick?: (params: unknown) => void
    onDataZoomChange?: (start: number, end: number) => void
    className?: string
}

export default function EchartWrapper(props: InterfaceEchartWrapperProps) {
    const chartRef = useRef<HTMLDivElement>(null)
    const myChart = useRef<echarts.ECharts | null>(null)
    const handleChartResize = () => myChart.current?.resize()
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(echarts as any).registerTransform((ecStat as any).transform.regression)

        // only if ref mounted in dom
        if (chartRef?.current) {
            if (!myChart.current) myChart.current = echarts.init(chartRef.current)
            window.addEventListener('resize', handleChartResize, { passive: true })
            myChart.current.setOption(
                // @ts-expect-error: poorly typed
                props.options,
                {
                    /**
                     * lazyUpdate?: boolean
                        Default: true = ECharts merges the new options with the existing ones.
                        false = the new option object replaces the existing one completely.
                     */
                    notMerge: true,

                    /**
                     * lazyUpdate?: boolean
                        Default: false
                        What it does:
                        - If true, ECharts will not immediately update the chart after setOption is called.
                        - Instead, it waits until the next frame, allowing multiple setOption calls to be batched for better performance.
                        Use case: Useful when you're calling setOption multiple times in a row and want to avoid unnecessary renders.
                     */
                    lazyUpdate: true,

                    /**
                     * Default: false
                        What it does:
                        When true, calling setOption won't trigger any event dispatch (like rendered, finished, etc.).
                        Use case: Good for silent updates where you don't want side effects like re-triggering chart-related events.
                     */
                    silent: false,
                },
            )

            // attach click event listener
            myChart.current.on('click', (params: unknown) => {
                if (props.onPointClick) props.onPointClick(params)
            })

            // attach dataZoom event listener
            myChart.current.on('dataZoom', () => {
                const option = myChart.current?.getOption()
                const zoom = option?.dataZoom?.[0]
                if (!zoom) return
                const xAxisArray = option?.xAxis as echarts.EChartOption.XAxis[] | undefined
                let startValue = zoom?.startValue
                let endValue = zoom?.endValue
                if ((startValue === undefined || endValue === undefined) && xAxisArray && Array.isArray(xAxisArray)) {
                    const xAxis = xAxisArray[0]
                    const min = typeof xAxis.min === 'number' ? xAxis.min : 0
                    const max = typeof xAxis.max === 'number' ? xAxis.max : 1
                    const startPercent = zoom?.start ?? 0
                    const endPercent = zoom?.end ?? 100

                    startValue = min + (max - min) * (startPercent / 100)
                    endValue = min + (max - min) * (endPercent / 100)
                }
                if (props.onDataZoomChange && typeof startValue === 'number' && typeof endValue === 'number') {
                    props.onDataZoomChange(startValue, endValue)
                }
            })
        }

        return () => {
            if (myChart?.current) {
                // cleanup events listeners
                window.removeEventListener('resize', handleChartResize)
                myChart.current.off('click')
                myChart.current.off('dataZoom')
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.options])

    return <div ref={chartRef} className={cn('m-0 p-0', props.className)} style={{ width: '100%', height: '100%' }}></div>
}
