'use client'

import { cn } from '@/utils'
import { ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
// import FileMapper from '@/components/common/FileMapper'
import { FileIds } from '@/enums'
import { SectionCard, ThemeCard } from './Cards'
import FileMapper from '@/components/common/FileMapper'
import { useTheme } from 'next-themes'
import { AppThemes } from '@/enums'

export function ErrorBoundaryTemplate(props: { error: string }) {
    return (
        <ThemeCard className="gap-5 px-0 pb-0">
            <div className="p-5 text-red-500">{props.error}</div>
        </ThemeCard>
    )
}

export default function AccountTemplate(props: {
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
    charts?: ReactNode
    className?: string
}) {
    const { resolvedTheme } = useTheme()

    return (
        <div className={cn('flex flex-col gap-4', props.className)}>
            {/* --------------- Header */}
            {props.header}

            {/* --------------- Content */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* 1. historic of snapshots */}
                <SectionCard className="h-[400px] w-full !p-1 md:!p-2">{props.charts}</SectionCard>

                {/* 2. last snapshot */}
                <div className="grid h-min grid-cols-1 gap-2">
                    {/* Global summary section - only render if summary is provided */}
                    {props.summary && (
                        <SectionCard>
                            <h3 className="mb-3 text-base font-medium text-default">Global</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Address */}
                                <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading address" />}>
                                    {props.summary.address}
                                </ErrorBoundary>

                                {/* Total AUM USD */}
                                <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading total AUM USD" />}>
                                    {props.summary.aum}
                                </ErrorBoundary>

                                {/* Net HYPE delta USD */}
                                <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading net HYPE delta USD" />}>
                                    {props.summary.netDelta}
                                </ErrorBoundary>

                                {/* Current APR */}
                                <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading current APR" />}>
                                    {props.summary.apr}
                                </ErrorBoundary>
                            </div>
                        </SectionCard>
                    )}

                    {/* HyperEvm */}
                    <SectionCard className="!border-none !px-0">
                        <FileMapper
                            id={resolvedTheme === AppThemes.DARK ? FileIds.HYPER_EVM_WHITE : FileIds.HYPER_EVM_DARK}
                            width={140}
                            height={24}
                            className="mb-1 ml-4 rounded-none"
                        />
                        <div className="flex flex-col gap-2 p-2">
                            {/* HYPE LPs */}
                            <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading HyperEvm LPs" />}>{props.hyperEvm.lp}</ErrorBoundary>

                            {/* Balances */}
                            <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading HyperEvm balances" />}>
                                {props.hyperEvm.balances}
                            </ErrorBoundary>
                        </div>
                    </SectionCard>

                    {/* HyperCore */}
                    <SectionCard className="h-min !border-none !px-0">
                        <FileMapper
                            id={resolvedTheme === AppThemes.DARK ? FileIds.HYPER_CORE_WHITE : FileIds.HYPER_CORE_DARK}
                            width={140}
                            height={24}
                            className="mb-1 ml-4 rounded-none"
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
                    </SectionCard>
                </div>
            </div>
        </div>
    )
}
