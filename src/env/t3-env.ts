import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here.
     * This way you can ensure the app isn't built with invalid env vars.
     */

    server: {
        // Database
        DATABASE_URL: z.string().url(),

        // Privy Server-side
        PRIVY_APP_SECRET: z.string().optional(),

        // API Security
        API_SECRET_KEY: z.string().optional(),
        RATE_LIMIT_ENABLED: z.string().optional().default('true'),
    },

    /**
     * Specify your client-side environment variables schema here.
     * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
     */

    client: {
        NEXT_PUBLIC_APP_URL: z.string().min(1),
        NEXT_PUBLIC_COMMIT_TIMESTAMP: z.string().optional(),
        NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),
        NEXT_PUBLIC_PRIVY_APP_ID: z.string().min(1),
    },

    /**
     * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
     */

    runtimeEnv: {
        // Server
        DATABASE_URL: process.env.DATABASE_URL,
        PRIVY_APP_SECRET: process.env.PRIVY_APP_SECRET,
        API_SECRET_KEY: process.env.API_SECRET_KEY,
        RATE_LIMIT_ENABLED: process.env.RATE_LIMIT_ENABLED,

        // Client
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_COMMIT_TIMESTAMP: process.env.NEXT_PUBLIC_COMMIT_TIMESTAMP,
        NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
        NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    },

    emptyStringAsUndefined: true,
})
