'use client'

import { cn } from '@/utils'
import { ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { FileIds } from '@/enums'
import { SectionCard, ThemeCard } from './Cards'
import FileMapper from '@/components/common/FileMapper'
import { useTheme } from 'next-themes'
import { AppThemes } from '@/enums'
import { IS_DEV } from '@/config'

export function ErrorBoundaryTemplate(props: { error: string }) {
    return (
        <ThemeCard className="gap-5 px-0 pb-0">
            <div className="p-5 text-red-500">{props.error}</div>
        </ThemeCard>
    )
}

export default function AccountTemplate(props: {
    charts?: ReactNode
    header: ReactNode
    summary?: {
        address: ReactNode
        aum: ReactNode
        netDelta: ReactNode
        apr: ReactNode
    } | null
    hyperEvm: {
        lp: ReactNode
        balances: ReactNode
        txs: ReactNode
        capital?: ReactNode
        delta?: ReactNode
    }
    hyperCore: {
        short: ReactNode
        spot: ReactNode
        txs: ReactNode
        capital?: ReactNode
        delta?: ReactNode
    }
    activity?: ReactNode
    className?: string
}) {
    const { resolvedTheme } = useTheme()

    return (
        <div className={cn('flex flex-col gap-4', props.className)}>
            {/* --------------- Header */}
            {props.header}

            {/* --------------- Content */}
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-4">
                {/* 1. historic of snapshots */}
                <SectionCard className="h-[400px] flex-1 !p-1 md:h-[500px] md:!p-2">{props.charts}</SectionCard>

                {/* 2. last snapshot */}
                <div className="3xl:w-[800px] flex h-min w-full flex-col gap-4 lg:w-[500px] xl:w-[600px] 2xl:w-[700px]">
                    {/* HyperEvm */}
                    <div>
                        <FileMapper
                            id={resolvedTheme === AppThemes.DARK ? FileIds.HYPER_EVM_WHITE : FileIds.HYPER_EVM_DARK}
                            width={170}
                            height={30}
                            className="ml-4 rounded-none"
                        />
                        <div className="flex flex-col gap-2 p-2">
                            {/* HYPE LPs */}
                            <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading HyperEvm LPs" />}>{props.hyperEvm.lp}</ErrorBoundary>

                            {/* Balances */}
                            <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading HyperEvm balances" />}>
                                {props.hyperEvm.balances}
                            </ErrorBoundary>
                        </div>
                    </div>

                    {/* HyperCore */}
                    <div>
                        <FileMapper
                            id={resolvedTheme === AppThemes.DARK ? FileIds.HYPER_CORE_WHITE : FileIds.HYPER_CORE_DARK}
                            width={170}
                            height={30}
                            className="ml-4 rounded-none"
                        />
                        <div className="flex flex-col gap-2 p-2">
                            {/* HYPE Short */}
                            <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading HyperCore Short" />}>
                                {props.hyperCore.short}
                            </ErrorBoundary>

                            {/* Spot */}
                            <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading HyperCore Spot" />}>
                                {props.hyperCore.spot}
                            </ErrorBoundary>
                        </div>
                    </div>

                    {/* Activity */}
                    {'todolater'.length === 0 && IS_DEV && (
                        <div>
                            <p className="ml-4 rounded-none text-lg font-semibold">Activity</p>
                            <div className="flex h-min flex-col gap-2 p-2">
                                <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading Activity TXs" />}>
                                    {props.activity}
                                </ErrorBoundary>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
