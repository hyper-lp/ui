'use client'

import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import PageWrapper from '@/components/common/PageWrapper'
import ReferralModal from '@/components/modals/ReferralModal'

// Lazy load the heavy chart component
const HeatmapAprChart = lazy(() => import('@/components/charts/HeatmapAprChart'))

// Loading fallback for chart with animation
const ChartSkeleton = () => (
    <motion.div
        className="flex h-[450px] w-full items-center justify-center rounded-lg bg-background/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        <motion.p
            className="text-sm text-default/40"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
        >
            Loading chart...
        </motion.p>
    </motion.div>
)

export default function HomePage() {
    return (
        <PageWrapper>
            <ReferralModal />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.6,
                    delay: 0.2,
                    ease: [0.4, 0, 0.2, 1],
                }}
                className="flex flex-col items-center justify-center gap-2"
            >
                {/* Explanation of APR calculation */}
                <motion.div
                    className="flex flex-col items-center gap-1 text-center text-sm md:flex-row md:gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <p>Gross Delta-neutral APR</p>
                    <p>= ⅔ × LP Fees + ⅓ × Short Perp Funding</p>
                </motion.div>
                {/* <motion.div
                    className="flex flex-col gap-1 md:flex-row md:gap-2 items-center text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <p>Delta-neutral APR</p>
                    <p>= ⅔ × LP Fees (HyperEVM) + ⅓ × Short Perp Funding (HyperCore)</p>
                </motion.div> */}
                <Suspense fallback={<ChartSkeleton />}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.4,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                        className="mx-auto w-full"
                    >
                        <HeatmapAprChart />
                    </motion.div>
                </Suspense>
            </motion.div>
        </PageWrapper>
    )
}
