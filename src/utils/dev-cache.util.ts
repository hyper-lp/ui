/**
 * Development utilities for cache management
 * Only active in development mode
 */

/**
 * Force clear Next.js module cache
 * Useful when hot reload isn't working properly
 */
export function clearModuleCache() {
    if (process.env.NODE_ENV !== 'development') return

    // Clear require cache
    if (typeof require !== 'undefined' && require.cache) {
        Object.keys(require.cache).forEach((id) => {
            if (id.includes('DeltaTrackingChart')) {
                delete require.cache[id]
            }
        })
    }

    // Force webpack hot reload
    interface WindowWithWebpack extends Window {
        webpackHotUpdate?: () => void
    }
    if (typeof window !== 'undefined') {
        const windowWithWebpack = window as WindowWithWebpack
        if (windowWithWebpack.webpackHotUpdate) {
            console.log('[Dev] Forcing webpack hot reload')
            windowWithWebpack.webpackHotUpdate()
        }
    }
}

/**
 * Add timestamp to force cache bust
 */
export function getCacheBustParam(): string {
    return process.env.NODE_ENV === 'development' ? `?cb=${Date.now()}` : ''
}

// Auto-clear cache on module hot reload in development
if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const moduleHot = (globalThis as any).module?.hot
    if (moduleHot) {
        moduleHot.accept()
        moduleHot.dispose(() => {
            clearModuleCache()
        })
    }
}
