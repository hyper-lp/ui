import { Inngest } from 'inngest'

// Make Inngest optional - use default value if not configured
export const inngest = new Inngest({
    id: process.env.INGEST_CLIENT_ID || 'hyperlp',
    env: process.env.INNGEST_BRANCH || 'main',
})
