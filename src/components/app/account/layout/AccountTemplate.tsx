'use client'

import { cn } from '@/utils'
import { ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { AccountCard } from './AccountCard'
import FileMapper from '@/components/common/FileMapper'
import { FileIds } from '@/enums'

export function ErrorBoundaryTemplate(props: { error: string }) {
    return (
        <AccountCard className="gap-5 px-0 pb-0">
            <div className="p-5 text-red-500">{props.error}</div>
        </AccountCard>
    )
}

export default function AccountTemplate(props: {
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
    }
    hyperCore: {
        short: ReactNode
        spot: ReactNode
        txs: ReactNode
    }
    className?: string
}) {
    return (
        <div className={cn('flex flex-col gap-8', props.className)}>
            {/* --------------- Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                {/* Address */}
                <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading address" />}>{props.summary.address}</ErrorBoundary>

                {/* Total AUM USD */}
                <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading total AUM USD" />}>{props.summary.aum}</ErrorBoundary>

                {/* Net HYPE delta USD */}
                <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading net HYPE delta USD" />}>{props.summary.netDelta}</ErrorBoundary>

                {/* Current APR */}
                <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading current APR" />}>{props.summary.apr}</ErrorBoundary>
            </div>

            {/* All */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* --------------- HyperEvm */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <FileMapper id={FileIds.HYPER_EVM_MINT} width={100} height={20} />
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl border border-hl-dark p-2">
                        {/* HYPE LPs */}
                        <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading HyperEvm LPs" />}>{props.hyperEvm.lp}</ErrorBoundary>

                        {/* Balances */}
                        <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading HyperEvm balances" />}>
                            {props.hyperEvm.balances}
                        </ErrorBoundary>

                        {/* Txs */}
                        <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading HyperEvm TXs" />}>{props.hyperEvm.txs}</ErrorBoundary>
                    </div>
                </div>

                {/* --------------- HyperCore */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <FileMapper id={FileIds.HYPER_CORE_MINT} width={100} height={20} />
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl border border-hl-dark p-2">
                        {/* HYPE Short */}
                        <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading HyperCore Short" />}>
                            {props.hyperCore.short}
                        </ErrorBoundary>

                        {/* Spot */}
                        <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading HyperCore Spot" />}>
                            {props.hyperCore.spot}
                        </ErrorBoundary>

                        {/* Txs */}
                        <ErrorBoundary fallback={<ErrorBoundaryTemplate error="Error loading HyperCore TXs" />}>{props.hyperCore.txs}</ErrorBoundary>
                    </div>
                </div>
            </div>
        </div>
    )
}
