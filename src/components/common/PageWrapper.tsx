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
                    'mx-auto mt-4 flex min-h-[calc(100vh-230px)] w-full flex-col overflow-x-hidden overflow-y-scroll md:mt-12 md:min-h-[calc(100vh-192px)]',
                    paddingX,
                    className,
                )}
            >
                {children}
            </div>
        </Suspense>
    )
}
