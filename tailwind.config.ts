import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: 'class',
    content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            fontFamily: {
                inter: ['var(--font-inter)', 'sans-serif'],
                'inter-tight': ['var(--font-inter-tight)', 'sans-serif'],
            },
            colors: {
                // Core colors from CSS variables
                background: 'hsl(var(--color-background) / <alpha-value>)',
                'background-opposite': 'hsl(var(--color-background-opposite) / <alpha-value>)',
                primary: 'hsl(var(--color-primary) / <alpha-value>)',
                default: 'hsl(var(--color-default) / <alpha-value>)',
                'hl-light-green': 'hsl(var(--color-hl-light-green) / <alpha-value>)',
                'hl-dark-green': 'hsl(var(--color-hl-dark-green) / <alpha-value>)',

                // Platform-specific colors
                'hyper-evm-lp': 'hsl(var(--color-hyper-evm-lp) / <alpha-value>)',
                'hyper-evm-balances': 'hsl(var(--color-hyper-evm-balances) / <alpha-value>)',
                'hyper-core-perp': 'hsl(var(--color-hyper-core-perp) / <alpha-value>)',
                'hyper-core-spot': 'hsl(var(--color-hyper-core-spot) / <alpha-value>)',

                // Status colors
                success: 'hsl(var(--color-success) / <alpha-value>)',
                warning: 'hsl(var(--color-warning) / <alpha-value>)',
                error: 'hsl(var(--color-error) / <alpha-value>)',
            },
            animation: {
                'skeleton-move': 'skeleton-move 2s infinite',
                flash: 'flash 0.8s ease-in-out',
            },
            keyframes: {
                'skeleton-move': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
            },
        },
    },
    plugins: [],
}

export default config
