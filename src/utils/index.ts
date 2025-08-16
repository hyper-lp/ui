// Utility functions consolidated from individual files
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// From cn.util.ts - see https://www.youtube.com/watch?v=re2JFITR7TI
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// From error.util.ts
export const extractErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message
    }
    if (typeof error === 'string') {
        return error
    }
    return 'An unknown error occurred'
}

// From misc.util.ts
export const isCurrentPath = (pathname: string, pagePath: string) => (pagePath === '/' ? pathname === pagePath : pathname.startsWith(pagePath))

// Export other utilities
export * from './rate-limit.util'
export * from './referral.util'
export * from './uniswap-v3.util'
export * from './validation.util'
export * from './date.util'
export * from './format.util'
