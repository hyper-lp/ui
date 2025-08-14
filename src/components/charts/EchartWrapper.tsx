'use client'

import React, { useEffect, useRef, memo } from 'react'
import * as echarts from 'echarts'
import { cn } from '@/utils'

/**
 * ------------------------ helper
 */

export function ChartBackground({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <div className={`bg-card rounded-lg p-4 ${className}`}>{children}</div>
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
        <div className="bg-card flex h-[400px] w-full items-center justify-center rounded-lg">
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMouseOver?: (params: any) => void
    onMouseOut?: () => void
    className?: string
}

function EchartWrapper(props: InterfaceEchartWrapperProps) {
    const chartRef = useRef<HTMLDivElement>(null)
    const myChart = useRef<echarts.ECharts | null>(null)
    const handleChartResize = () => myChart.current?.resize()
    useEffect(() => {
        // only if ref mounted in dom
        if (chartRef?.current) {
            if (!myChart.current) {
                // Note: ECharts internally adds non-passive event listeners for mousewheel/wheel events.
                // This triggers Chrome DevTools warnings but is a known ECharts behavior that doesn't
                // impact performance for our use case. The library handles these events appropriately.
                myChart.current = echarts.init(chartRef.current, null, {
                    // Use passive event listeners for better scroll performance
                    useCoarsePointer: true,
                    pointerSize: 40,
                })
            }
            window.addEventListener('resize', handleChartResize, { passive: true })
            myChart.current.setOption(props.options, {
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
                silent: true,
            })

            // attach click event listener
            myChart.current.on('click', (params: unknown) => {
                if (props.onPointClick) props.onPointClick(params)
            })

            // Only attach hover event listeners if callbacks are provided
            if (props.onMouseOver) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mouseOverHandler = (params: any) => {
                    try {
                        // Validate params before calling the callback
                        if (params && typeof params === 'object') {
                            props.onMouseOver?.(params)
                        }
                    } catch (error) {
                        // Silently handle errors to prevent console spam
                        if (process.env.NODE_ENV === 'development') {
                            console.warn('EchartWrapper mouseover error:', error)
                        }
                    }
                }
                myChart.current.on('mouseover', 'series', mouseOverHandler)
            }

            if (props.onMouseOut) {
                const mouseOutHandler = () => {
                    try {
                        props.onMouseOut!()
                    } catch (error) {
                        // Silently handle errors to prevent console spam
                        if (process.env.NODE_ENV === 'development') {
                            console.warn('EchartWrapper mouseout error:', error)
                        }
                    }
                }
                myChart.current.on('mouseout', 'series', mouseOutHandler)
            }

            // attach dataZoom event listener
            myChart.current.on('dataZoom', () => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const option = myChart.current?.getOption() as any
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const zoom = option?.dataZoom?.[0] as any
                if (!zoom) return
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const xAxisArray = option?.xAxis as any[] | undefined
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
                // cleanup all event listeners
                window.removeEventListener('resize', handleChartResize)
                myChart.current.off('click')
                myChart.current.off('dataZoom')
                myChart.current.off('mouseover')
                myChart.current.off('mouseout')
                // Dispose the chart instance to prevent memory leaks
                myChart.current.dispose()
                myChart.current = null
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.options])

    return <div ref={chartRef} className={cn('m-0 p-0', props.className)} style={{ width: '100%', height: '100%' }}></div>
}

export default memo(EchartWrapper)
