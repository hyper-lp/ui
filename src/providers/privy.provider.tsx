'use client'

import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth'
import { env } from '@/env/t3-env'
import { APP_METADATA } from '@/config/app.config'

export function PrivyProvider({ children }: { children: React.ReactNode }) {
    // Note: WalletConnect initialization warning in dev is expected due to React StrictMode
    // and Privy's internal initialization. It doesn't affect functionality.
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
                externalWallets: {
                    walletConnect: {
                        enabled: false,
                    },
                },
            }}
        >
            {children}
        </BasePrivyProvider>
    )
}
