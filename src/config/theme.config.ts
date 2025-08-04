import { AppThemes } from '@/enums/app.enum'
import { IconIds } from '@/enums/icons.enum'
import { FileIds } from '@/enums/files.enum'
import { Inter, Inter_Tight } from 'next/font/google'
import resolveConfig from 'tailwindcss/resolveConfig'
import type { Config } from 'tailwindcss'
import tailwindConfig from '../../tailwind.config'
import { DefaultColors } from 'tailwindcss/types/generated/colors'

export const APP_THEMES = {
    [AppThemes.LIGHT]: { index: 0, iconId: IconIds.THEME_LIGHT, svgId: FileIds.THEME_LIGHT },
    [AppThemes.DARK]: { index: 1, iconId: IconIds.THEME_DARK, svgId: FileIds.THEME_DARK },
} as const

/**
 * fonts
 */

export const INTER_FONT = Inter({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
    preload: true,
})

export const INTER_TIGHT_FONT = Inter_Tight({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin'],
    variable: '--font-inter-tight',
})

/**
 * tailwind
 */

const fullConfig = resolveConfig(tailwindConfig as Config)
export const AppColors = fullConfig.theme.colors as DefaultColors & {
    background: string
    primary: string
    default: string
    jagger: {
        DEFAULT: string
        800: string
        500: string
        400: string
        300: string
        200: string
    }
    folly: string
    aquamarine: string
    milk: {
        DEFAULT: string
        600: string
        400: string
        200: string
        150: string
        100: string
        50: string
    }
}

/**
 * toast
 */

export const toastStyle = {
    borderRadius: '10px',
    background: AppColors.blue[800],
    borderColor: AppColors.blue[300],
    border: 2,
    color: AppColors.blue[300],
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '800px',
} as const

export const DEFAULT_PADDING_X = 'px-6 md:px-8 lg:px-10'
