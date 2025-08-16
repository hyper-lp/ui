'use client'

import { ReactNode } from 'react'
import { cn } from '@/utils'

/**
 * LP Position Row Template
 */
export const LPRowTemplate = (props: {
    dex: ReactNode
    pair: ReactNode
    range: ReactNode
    hype: ReactNode
    usdt: ReactNode
    value: ReactNode
    apr: ReactNode
    il: ReactNode
    className?: string
}) => {
    return (
        <div className={cn('flex items-center text-xs', props.className)}>
            <div className="w-[60px] px-2">{props.dex}</div>
            <div className="w-[140px] px-2">{props.pair}</div>
            <div className="w-[80px] px-2">{props.range}</div>
            <div className="w-[100px] px-2 text-right">{props.hype}</div>
            <div className="w-[100px] px-2 text-right">{props.usdt}</div>
            <div className="w-[100px] px-2 text-right">{props.value}</div>
            <div className="w-[80px] px-2 text-right">{props.apr}</div>
            <div className="w-[80px] px-2 text-right">{props.il}</div>
        </div>
    )
}

/**
 * Wallet Balance Row Template
 */
export const WalletRowTemplate = (props: {
    token: ReactNode
    balance: ReactNode
    value: ReactNode
    price: ReactNode
    address: ReactNode
    className?: string
}) => {
    return (
        <div className={cn('flex items-center text-xs', props.className)}>
            <div className="w-[140px] px-2">{props.token}</div>
            <div className="w-[120px] px-2 text-right">{props.balance}</div>
            <div className="w-[100px] px-2 text-right">{props.value}</div>
            <div className="w-[100px] px-2 text-right">{props.price}</div>
            <div className="w-[200px] px-2 font-mono text-[10px] text-default/50">{props.address}</div>
        </div>
    )
}

/**
 * Perp Position Row Template
 */
export const PerpRowTemplate = (props: {
    asset: ReactNode
    side: ReactNode
    size: ReactNode
    notional: ReactNode
    entry: ReactNode
    mark: ReactNode
    pnl: ReactNode
    funding: ReactNode
    margin: ReactNode
    leverage: ReactNode
    className?: string
}) => {
    return (
        <div className={cn('flex items-center text-xs', props.className)}>
            <div className="w-[120px] px-2">{props.asset}</div>
            <div className="w-[60px] px-2">{props.side}</div>
            <div className="w-[100px] px-2 text-right">{props.size}</div>
            <div className="w-[100px] px-2 text-right">{props.notional}</div>
            <div className="w-[80px] px-2 text-right">{props.entry}</div>
            <div className="w-[80px] px-2 text-right">{props.mark}</div>
            <div className="w-[120px] px-2 text-right">{props.pnl}</div>
            <div className="w-[80px] px-2 text-right">{props.funding}</div>
            <div className="w-[80px] px-2 text-right">{props.margin}</div>
            <div className="w-[60px] px-2 text-right">{props.leverage}</div>
        </div>
    )
}

/**
 * Spot Balance Row Template
 */
export const SpotRowTemplate = (props: { asset: ReactNode; balance: ReactNode; value: ReactNode; price: ReactNode; className?: string }) => {
    return (
        <div className={cn('flex items-center text-xs', props.className)}>
            <div className="w-[140px] px-2">{props.asset}</div>
            <div className="w-[120px] px-2 text-right">{props.balance}</div>
            <div className="w-[100px] px-2 text-right">{props.value}</div>
            <div className="w-[100px] px-2 text-right">{props.price}</div>
        </div>
    )
}
