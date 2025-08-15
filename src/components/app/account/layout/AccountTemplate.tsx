'use client'

import { cn } from '@/utils'
import { ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { AccountCard } from './AccountCard'
import FileMapper from '@/components/common/FileMapper'
import IconWrapper from '@/components/icons/IconWrapper'
import { FileIds, IconIds } from '@/enums'
import { useAppStore } from '@/stores/app.store'

export function ErrorBoundaryTemplate(props: { error: string }) {
    return (
        <AccountCard className="gap-5 px-0 pb-0">
            <div className="p-5 text-red-500">{props.error}</div>
        </AccountCard>
    )
}

export default function AccountTemplate(props: {
    header: ReactNode
    summary: {
        address: ReactNode
        aum: ReactNode
        netDelta: ReactNode
        apr: ReactNode
    }
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
    const { sectionStates, toggleSection } = useAppStore()
    const hyperEvmExpanded = sectionStates.hyperEvm
    const hyperCoreExpanded = sectionStates.hyperCore

    return (
        <div className={cn('flex flex-col gap-8', props.className)}>
            {/* --------------- Header */}
            {props.header}

            {/* --------------- Content */}
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                {/* 1. historic of snapshots */}
                <div className="flex flex-col rounded-lg border border-default/5 bg-default/5 hover:border-default/10">{props.charts}</div>

                {/* 2. last snapshot */}
                <div className="grid grid-cols-1 gap-2">
                    {/* Global summary section */}
                    <div className="flex h-fit flex-col rounded-lg border border-default/5 bg-default/5 p-4 hover:border-default/10">
                        <h3 className="mb-3 text-base font-medium text-default">Global</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Address */}
                            <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading address" />}>{props.summary.address}</ErrorBoundary>

                            {/* Total AUM USD */}
                            <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading total AUM USD" />}>
                                {props.summary.aum}
                            </ErrorBoundary>

                            {/* Net HYPE delta USD */}
                            <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading net HYPE delta USD" />}>
                                {props.summary.netDelta}
                            </ErrorBoundary>

                            {/* Current APR */}
                            <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading current APR" />}>{props.summary.apr}</ErrorBoundary>
                        </div>
                    </div>

                    {/* HyperEvm */}
                    <div className="flex h-fit flex-col rounded-lg border border-default/5 bg-default/5 hover:border-default/10">
                        <div className="flex items-center justify-between px-4 pb-2 pt-4">
                            <button onClick={() => toggleSection('hyperEvm')} className="flex items-center gap-2">
                                <IconWrapper
                                    id={hyperEvmExpanded ? IconIds.CHEVRON_DOWN : IconIds.CHEVRON_RIGHT}
                                    className="size-5 text-default/50"
                                />
                                <FileMapper id={FileIds.HYPER_EVM_DARK} width={140} height={20} className="rounded-none" />
                            </button>
                            <div className="flex items-center gap-3">
                                {props.hyperEvm.delta}
                                {props.hyperEvm.capital}
                            </div>
                        </div>

                        {/* sections */}
                        {hyperEvmExpanded && (
                            <div className="flex flex-col gap-2 p-2">
                                {/* HYPE LPs */}
                                <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading HyperEvm LPs" />}>
                                    {props.hyperEvm.lp}
                                </ErrorBoundary>

                                {/* Balances */}
                                <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading HyperEvm balances" />}>
                                    {props.hyperEvm.balances}
                                </ErrorBoundary>

                                {/* Txs */}
                                <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading HyperEvm TXs" />}>
                                    {props.hyperEvm.txs}
                                </ErrorBoundary>
                            </div>
                        )}
                    </div>

                    {/* HyperCore */}
                    <div className="flex h-fit flex-col rounded-lg border border-default/5 bg-default/5 hover:border-default/10">
                        <div className="flex items-center justify-between px-4 pb-2 pt-4">
                            <button onClick={() => toggleSection('hyperCore')} className="flex items-center gap-2">
                                <IconWrapper
                                    id={hyperCoreExpanded ? IconIds.CHEVRON_DOWN : IconIds.CHEVRON_RIGHT}
                                    className="size-5 text-default/50"
                                />
                                <FileMapper id={FileIds.HYPER_CORE_DARK} width={140} height={20} />
                            </button>
                            <div className="flex items-center gap-3">
                                {props.hyperCore.delta}
                                {props.hyperCore.capital}
                            </div>
                        </div>

                        {/* sections */}
                        {hyperCoreExpanded && (
                            <div className="flex flex-col gap-2 p-2">
                                {/* HYPE Short */}
                                <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading HyperCore Short" />}>
                                    {props.hyperCore.short}
                                </ErrorBoundary>

                                {/* Spot */}
                                <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading HyperCore Spot" />}>
                                    {props.hyperCore.spot}
                                </ErrorBoundary>

                                {/* Txs */}
                                <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading HyperCore TXs" />}>
                                    {props.hyperCore.txs}
                                </ErrorBoundary>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
