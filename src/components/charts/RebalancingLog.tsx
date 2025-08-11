'use client'

import { memo } from 'react'
import { cn } from '@/utils'
import type { RebalanceEvent } from '@/stores/delta-history.store'

interface RebalancingLogProps {
    className?: string
    events: RebalanceEvent[]
    maxEvents?: number
}

function RebalancingLog({ className, events = [], maxEvents = 5 }: RebalancingLogProps) {
    // Sort events by timestamp (most recent first) and limit to maxEvents
    const sortedEvents = [...events].sort((a, b) => b.timestamp - a.timestamp).slice(0, maxEvents)

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const getMethodColor = (method: string) => {
        switch (method) {
            case 'taker':
                return 'text-red-500' // More expensive
            case 'maker':
                return 'text-green-500' // Cheaper
            case 'manual':
                return 'text-blue-500'
            default:
                return 'text-gray-500'
        }
    }

    const getMethodIcon = (method: string) => {
        switch (method) {
            case 'taker':
                return '⚡' // Fast but expensive
            case 'maker':
                return '⏱' // Slow but cheap
            case 'manual':
                return '👤' // Manual intervention
            default:
                return '•'
        }
    }

    if (events.length === 0) {
        return (
            <div className={cn('flex flex-col', className)}>
                <h3 className="text-sm font-semibold mb-3">Rebalancing Activity</h3>
                <div className="flex-1 flex items-center justify-center min-h-[250px]">
                    <div className="text-sm text-muted">No rebalancing events yet</div>
                </div>
            </div>
        )
    }

    return (
        <div className={cn('flex flex-col', className)}>
            <h3 className="text-sm font-semibold mb-3">Rebalancing Activity</h3>
            <div className="flex-1 overflow-y-auto">
                <div className="space-y-3">
                    {sortedEvents.map((event, index) => (
                        <div key={`${event.timestamp}-${index}`} className="relative pl-6 pb-3 last:pb-0">
                            {/* Timeline line */}
                            {index < sortedEvents.length - 1 && <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-border" />}

                            {/* Timeline dot */}
                            <div
                                className={cn(
                                    'absolute left-0 top-1 w-4 h-4 rounded-full border-2 bg-background',
                                    getMethodColor(event.method).replace('text-', 'border-'),
                                )}
                            >
                                <span className="absolute -left-0.5 -top-0.5 text-xs">{getMethodIcon(event.method)}</span>
                            </div>

                            {/* Event content */}
                            <div className="ml-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={cn('text-xs font-semibold uppercase', getMethodColor(event.method))}>{event.method}</span>
                                    <span className="text-xs text-muted">{formatTimestamp(event.timestamp)}</span>
                                </div>

                                <div className="text-xs space-y-0.5">
                                    <div className="flex justify-between">
                                        <span className="text-muted">Size:</span>
                                        <span className="font-mono">
                                            {event.size > 0 ? '+' : ''}
                                            {event.size.toFixed(2)} HYPE
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted">Delta:</span>
                                        <span className="font-mono text-xs">
                                            ${event.deltaBefore.toFixed(0)} → ${event.deltaAfter.toFixed(0)}
                                        </span>
                                    </div>
                                    {event.cost !== undefined && (
                                        <div className="flex justify-between">
                                            <span className="text-muted">Cost:</span>
                                            <span className="font-mono text-red-500">-${event.cost.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {event.txHash && (
                                        <div className="truncate">
                                            <a
                                                href={`https://explorer.hyperliquid.xyz/tx/${event.txHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-600 text-xs"
                                            >
                                                {event.txHash.slice(0, 8)}...{event.txHash.slice(-6)} ↗
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {events.length > maxEvents && (
                    <div className="text-xs text-muted text-center mt-3 pt-3 border-t">+{events.length - maxEvents} more events</div>
                )}
            </div>
        </div>
    )
}

export default memo(RebalancingLog)
