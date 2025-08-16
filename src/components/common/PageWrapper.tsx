import { cn } from '@/utils'
import { Suspense } from 'react'
import { DefaultFallbackContent } from '../layouts/DefaultFallback'

export default function PageWrapper({
    children,
    className,
    paddingX = 'px-4 md:px-6 lg:px-8',
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
                    'mx-auto mt-4 flex min-h-[calc(100vh-230px)] w-full flex-col overflow-visible md:mt-6 md:min-h-[calc(100vh-160px)]',
                    paddingX,
                    className,
                )}
            >
                {children}
            </div>
        </Suspense>
    )
}
