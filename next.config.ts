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
}

export default nextConfig
