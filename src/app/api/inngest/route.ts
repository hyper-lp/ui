import { inngest } from '@/lib/inngest'
import { IS_DEV } from '@/config/app.config'
import { pullAndStoreAnalyticsCron } from '@/crons/cron-pull-and-store'
import { serve } from 'inngest/next'

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: IS_DEV ? [pullAndStoreAnalyticsCron] : [],
    streaming: 'allow',
})
