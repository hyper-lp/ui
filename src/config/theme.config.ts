import { AppThemes } from '@/enums/app.enum'
import { IconIds } from '@/enums/icons.enum'
import type { ThemeConfig } from '@/interfaces/app.interface'

export const APP_THEMES = {
    [AppThemes.LIGHT]: { index: 0, iconId: IconIds.THEME_LIGHT },
    [AppThemes.DARK]: { index: 1, iconId: IconIds.THEME_DARK },
} as const

/**
 * Unified color configuration for the entire application
 * This consolidates colors from multiple config files to follow DRY principle
 */

/**
 * Color constants and utilities
 * CSS variables are defined in globals.css - this file provides JS/TS access to those colors
 */

// Status colors (not theme-dependent)
export const STATUS_COLORS = {
    success: '#10B981', // Green
    warning: '#F59E0B', // Orange
    error: '#EF4444', // Red
    info: '#3B82F6', // Blue
} as const

// Chart colors that need hex values
export const CHART_COLORS = {
    light: {
        text: '#434651',
        axis: 'rgba(46, 49, 60, 0.1)',
        line: 'rgba(46, 49, 60, 0.2)',
        tooltipBackground: 'rgba(255, 255, 255, 0.98)',

        // Platform colors for charts
        hyperEvmLp: '#00bfa3',
        hyperEvmBalances: '#4db8cc',
        hyperCorePerp: '#ff3366',
        hyperCoreSpot: '#ff9933',

        // Heatmap colors
        heatmapGradient: [
            '#f6fefd', // Off-White (lowest)
            '#d1d4dc', // Light Gray
            '#949e9c', // Pale Gray
            '#868993', // Warm Gray
            '#50d2c1', // Teal
            '#22ab94', // Primary teal
            '#089891', // Sea Green
            '#142e61', // Deep Blue
            '#0f1a1f', // Oil Black (highest)
        ],
    },
    dark: {
        text: '#e6e8ef',
        axis: 'rgba(209, 212, 220, 0.4)',
        line: 'rgba(209, 212, 220, 0.2)',
        tooltipBackground: 'rgba(20, 30, 45, 0.99)',

        // Platform colors for charts
        hyperEvmLp: '#00ffd4',
        hyperEvmBalances: '#4dd4e6',
        hyperCorePerp: '#ff6680',
        hyperCoreSpot: '#ffaa44',

        // Heatmap colors
        heatmapGradient: [
            '#0f1a1f', // Oil Black (lowest)
            '#142e61', // Deep Blue
            '#2e313c', // Charcoal Blue
            '#434651', // Dark Gray
            '#089891', // Sea Green
            '#22ab94', // Primary teal
            '#50d2c1', // Teal
            '#26a69a', // Muted Turquoise
            '#bbd9fb', // Soft Blue (highest)
        ],
    },
} as const

// Type for theme colors
export type ThemeColors = {
    background: string
    backgroundOpposite: string
    primary: string
    default: string
    hyperEvmLp: string
    hyperEvmBalances: string
    hyperCorePerp: string
    hyperCoreSpot: string
    charts: {
        text: string
        axis: string
        line: string
        tooltipBackground: string
        heatmapGradient: readonly string[]
    }
}

/**
 * Get theme colors for a specific mode
 */
export function getColorsByTheme(isDark: boolean): ThemeColors {
    const mode = isDark ? 'dark' : 'light'
    const chartColors = CHART_COLORS[mode]

    return {
        // Core colors (these would be read from CSS variables in a real app, but hardcoded for simplicity)
        background: mode === 'dark' ? '#0f1a1f' : '#f6fefd',
        backgroundOpposite: mode === 'dark' ? '#f6fefd' : '#0f1a1f',
        primary: '#22ab94',
        default: mode === 'dark' ? '#d1d4dc' : '#2e313c',
        // Platform colors
        hyperEvmLp: chartColors.hyperEvmLp,
        hyperEvmBalances: chartColors.hyperEvmBalances,
        hyperCorePerp: chartColors.hyperCorePerp,
        hyperCoreSpot: chartColors.hyperCoreSpot,
        charts: chartColors,
    }
}

// Use the centralized color constants
const lightColors = getColorsByTheme(false)
const darkColors = getColorsByTheme(true)

export const COLORS: ThemeConfig = {
    light: lightColors,
    dark: darkColors,
} as const

/**
 * Get colors based on current theme
 * @param isDarkMode - Whether dark mode is active
 * @returns Color configuration for the theme
 */
export function getThemeColors(mode?: string) {
    return mode === AppThemes.DARK ? COLORS.dark : COLORS.light
}
