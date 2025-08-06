import { cn } from '@/utils'
import { Suspense } from 'react'
import { DefaultFallbackContent } from '../layouts/DefaultFallback'
import { DEFAULT_PADDING_X } from '@/config/theme.config'

export default function PageWrapper({
    children,
    className,
    paddingX = DEFAULT_PADDING_X,
    ...props
}: {
    children: React.ReactNode
    className?: string
    paddingX?: string
}) {
    return (
        <Suspense fallback={DefaultFallbackContent()}>
            <div
                {...props}
                className={cn(
                    'mx-auto flex min-h-[calc(100vh-230px)] md:min-h-[calc(100vh-192px)] w-full flex-col overflow-x-hidden overflow-y-scroll mt-2 md:mt-12',
                    paddingX,
                    className,
                )}
            >
                {children}
            </div>
        </Suspense>
    )
}
