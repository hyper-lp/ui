import type { NextConfig } from 'next'
import { execSync } from 'child_process'

const nextConfig: NextConfig = {
    productionBrowserSourceMaps: false, // Save ~30% bundle size
    images: {
        remotePatterns: [{ hostname: '*' }],
    },
    output: 'standalone',
    // Optimize bundle
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    experimental: {
        webpackBuildWorker: true,
        turbo: {
            resolveAlias: {
                '@/*': ['./src/*'],
            },
        },
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
            {
                source: '/sw.js',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/javascript; charset=utf-8',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'no-cache, no-store, must-revalidate',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self'",
                    },
                ],
            },
            {
                source: '/_next/static/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ]
    },
    generateBuildId: async () => {
        // Use git commit hash as build ID for consistent chunk naming
        return execSync('git rev-parse HEAD').toString().trim().substring(0, 8)
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Optimize client-side bundles
            config.optimization = {
                ...config.optimization,
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        default: false,
                        vendors: false,
                        // Split vendor libraries
                        framework: {
                            name: 'framework',
                            chunks: 'all',
                            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-sync-external-store)[\\/]/,
                            priority: 40,
                            enforce: true,
                        },
                        lib: {
                            test(module: any) {
                                return module.size() > 160000 &&
                                    /node_modules[\\/]/.test(module.identifier())
                            },
                            name(module: any) {
                                const hash = require('crypto').createHash('sha1')
                                hash.update(module.identifier())
                                return hash.digest('hex').substring(0, 8)
                            },
                            priority: 30,
                            minChunks: 1,
                            reuseExistingChunk: true,
                        },
                        commons: {
                            name: 'commons',
                            chunks: 'all',
                            minChunks: 2,
                            priority: 20,
                        },
                        shared: {
                            name(module: any, chunks: any) {
                                const hash = require('crypto').createHash('sha1')
                                hash.update(chunks.reduce((acc: string, chunk: any) => acc + chunk.name, ''))
                                return hash.digest('hex').substring(0, 8)
                            },
                            priority: 10,
                            minChunks: 2,
                            reuseExistingChunk: true,
                        },
                    },
                },
                // Use faster hashing algorithm for development
                moduleIds: 'deterministic',
                runtimeChunk: {
                    name: 'runtime',
                },
            }
        }
        return config
    },
}

export default nextConfig
