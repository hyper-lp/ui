export const ChartColors = {
    light: {
        primary: '#26a69a',
        background: '#ffffff',
        tooltipBackground: 'rgba(255, 255, 255, 0.98)', // Slightly transparent white
        default: '#000000',
        heatmapGradient: [
            // Light mode colors - from light to dark for contrast
            '#f6fefd', // Off-White (lowest)
            '#d1d4dc', // Light Gray
            '#949e9c', // Pale Gray
            '#868993', // Warm Gray
            '#50d2c1', // Teal
            '#22ab94', // primary (Hyperliquid signature)
            '#089891', // Sea Green
            '#142e61', // Deep Blue
            '#0f1a1f', // Oil Black (highest - maximum contrast)
        ],
    },
    dark: {
        primary: '#4db6ac',
        background: '#000000',
        tooltipBackground: 'rgba(20, 30, 45, 0.99)', // Dark blue-gray with slight transparency
        default: '#ffffff',
        heatmapGradient: [
            // Dark mode colors - from dark to bright for contrast
            '#0f1a1f', // Oil Black (lowest)
            '#142e61', // Deep Blue
            '#2e313c', // Charcoal Blue
            '#434651', // Dark Gray
            '#089891', // Sea Green
            '#22ab94', // primary (Hyperliquid signature)
            '#50d2c1', // Teal
            '#26a69a', // Muted Turquoise
            '#bbd9fb', // Soft Blue (highest - bright for contrast)
        ],
    },
}
