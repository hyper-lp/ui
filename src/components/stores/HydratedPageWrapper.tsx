'use client'

import { useAppStore } from '@/stores/app.store'
import { ReactNode, useEffect } from 'react'
import PageWrapper from '../common/PageWrapper'

export default function HydratedPageWrapper(props: { children: ReactNode; className?: string; paddingX?: string }) {
    const { hasHydrated } = useAppStore()
    const loadAppStore = () => useAppStore.persist.rehydrate()
    useEffect(() => {
        if (!hasHydrated) loadAppStore()
    }, [hasHydrated])
    return (
        <PageWrapper className={props.className} paddingX={props.paddingX}>
            {props.children}
        </PageWrapper>
    )
}
