'use client'

import { ReactNode } from 'react'
import { cn } from '@/utils'

/**
 * LP Position Row Template
 */
export const LPRowTemplate = (props: {
    dex: ReactNode
    poolAddress: ReactNode
    feeTier: ReactNode
    status: ReactNode
    hype: ReactNode
    usdt: ReactNode
    value: ReactNode
    split: ReactNode
    tvl: ReactNode
    apr24h: ReactNode
    apr7d: ReactNode
    apr30d: ReactNode
    positionId: ReactNode
    nftId: ReactNode
    className?: string
}) => {
    return (
        <div className={cn('flex items-center gap-1 px-2 text-sm', props.className)}>
            <div className="w-[70px] pl-2">{props.dex}</div>
            <div className="w-[70px]">{props.poolAddress}</div>
            <div className="w-[55px]">{props.feeTier}</div>
            <div className="w-[55px]">{props.status}</div>
            <div className="w-[60px] text-center">{props.value}</div>
            <div className="w-[60px] text-center">{props.hype}</div>
            <div className="w-[60px] text-center">{props.usdt}</div>
            <div className="w-[70px] text-center">{props.split}</div>
            <div className="w-[50px] text-center">{props.tvl}</div>
            <div className="w-[60px] text-center">{props.apr24h}</div>
            <div className="w-[60px] text-center">{props.apr7d}</div>
            <div className="w-[65px] text-center">{props.apr30d}</div>
            <div className="w-[80px] text-center">{props.positionId}</div>
            <div className="w-[80px] text-right">{props.nftId}</div>
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
        <div className={cn('flex items-center text-sm', props.className)}>
            <div className="w-[140px] px-2">{props.token}</div>
            <div className="w-[120px] px-2 text-right">{props.balance}</div>
            <div className="w-[100px] px-2 text-right">{props.value}</div>
            <div className="w-[100px] px-2 text-right">{props.price}</div>
            <div className="w-[200px] px-2 text-[10px] text-default/50">{props.address}</div>
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
        <div className={cn('flex items-center text-sm', props.className)}>
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
export const SpotRowTemplate = (props: { asset: ReactNode; balance: ReactNode; value: ReactNode; price?: ReactNode; className?: string }) => {
    return (
        <div className={cn('flex items-center text-sm', props.className)}>
            <div className="w-[140px] px-2">{props.asset}</div>
            <div className="w-[120px] px-2 text-right">{props.balance}</div>
            <div className="w-[100px] px-2 text-right">{props.value}</div>
            {props.price !== undefined && <div className="w-[80px] px-2 text-right">{props.price}</div>}
        </div>
    )
}
