// Export the RebalanceEvent interface for components that still need it
export interface RebalanceEvent {
    timestamp: number
    method: 'taker' | 'maker' | 'manual'
    size: number // Size of the adjustment
    deltaBefore: number
    deltaAfter: number
    cost?: number // Cost in USD
    txHash?: string
}
