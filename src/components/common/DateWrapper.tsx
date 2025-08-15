'use client'

import { cn, DAYJS_FORMATS, getDurationBetween } from '@/utils'
import StyledTooltip from './StyledTooltip'
import { useState, useEffect } from 'react'

interface DateWrapperProps {
    date: string | number | Date
    className?: string
    children?: React.ReactNode
    fetchTime?: number // in milliseconds
    label?: string // e.g., "LP fetch time", "EVM fetch time"
}

export function DateWrapper(props: DateWrapperProps) {
    const [now, setNow] = useState(new Date())
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])
    return (
        <StyledTooltip
            disableAnimation={true}
            content={
                <div className="space-y-1">
                    <p>{DAYJS_FORMATS.dateLong(props.date)} UTC</p>
                    <p>
                        {
                            getDurationBetween({
                                startTs: new Date(props.date).getTime(),
                                endTs: now.getTime(),
                                showYears: false,
                                showMonths: false,
                                showWeeks: false,
                            }).oneLiner
                        }{' '}
                        ago
                    </p>
                    {props.fetchTime && props.label && (
                        <p>
                            {props.label}: {(props.fetchTime / 1000).toFixed(2)}s
                        </p>
                    )}
                </div>
            }
        >
            {typeof props.children === 'string' || !props.children ? (
                <span className={cn('cursor-help text-sm text-default/50', props.className)}>
                    {props.children || DAYJS_FORMATS.timeAgo(props.date)}
                </span>
            ) : (
                <div className={cn('cursor-help', props.className)}>{props.children}</div>
            )}
        </StyledTooltip>
    )
}

export function DateWrapperAccurate({ className = 'text-sm', ...props }: DateWrapperProps) {
    const [now, setNow] = useState(new Date())
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])
    return (
        <DateWrapper date={props.date}>
            <p className={cn('cursor-help truncate hover:underline', className)}>
                {
                    getDurationBetween({
                        startTs: new Date(props.date).getTime(),
                        endTs: now.getTime(),
                        showYears: false,
                        showMonths: false,
                        showWeeks: false,
                    }).oneLiner
                }{' '}
                ago
            </p>
        </DateWrapper>
    )
}
