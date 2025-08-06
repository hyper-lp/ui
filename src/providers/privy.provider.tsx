'use client'

import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth'
import { env } from '@/env/t3-env'
import { APP_METADATA } from '@/config/app.config'

export function PrivyProvider({ children }: { children: React.ReactNode }) {
    return (
        <BasePrivyProvider
            appId={env.NEXT_PUBLIC_PRIVY_APP_ID}
            config={{
                loginMethods: ['twitter'],
                appearance: {
                    theme: 'dark',
                    logo: APP_METADATA.SITE_URL + '/apple-touch-icon.png',
                },
                embeddedWallets: {
                    createOnLogin: 'off',
                },
            }}
        >
            {children}
        </BasePrivyProvider>
    )
}
