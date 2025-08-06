/**
 * Unified color configuration for the entire application
 * This consolidates colors from multiple config files to follow DRY principle
 */

export const Colors = {
    light: {
        // Primary brand colors
        primary: '#26a69a', // Hyperliquid signature teal
        secondary: '#00ffbb',

        // Base colors
        background: '#ffffff',
        foreground: '#000000',

        // Chart specific
        tooltipBackground: 'rgba(255, 255, 255, 0.98)',
        folly: '#ff3366', // Red/pink for negative values
        aquamarine: '#00ffbb', // Green for positive values

        // Heatmap gradient (from light to dark for contrast)
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
        // Primary brand colors
        primary: '#4db6ac', // Lighter teal for dark mode
        secondary: '#00ffc4',

        // Base colors
        background: '#000000',
        foreground: '#ffffff',

        // Chart specific
        tooltipBackground: 'rgba(20, 30, 45, 0.99)',
        folly: '#ff4d7a', // Brighter red/pink for dark mode
        aquamarine: '#00ffc4', // Brighter green for dark mode

        // Heatmap gradient (from dark to bright for contrast)
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

/**
 * Get colors based on current theme
 * @param isDarkMode - Whether dark mode is active
 * @returns Color configuration for the theme
 */
export function getThemeColors(isDarkMode: boolean) {
    return isDarkMode ? Colors.dark : Colors.light
}
