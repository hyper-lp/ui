'use client'

import PageWrapper from '@/components/common/PageWrapper'
import { useEffect } from 'react'
import { extractErrorMessage } from '@/utils'
import IconWrapper from '@/components/icons/IconWrapper'
import { AppUrls, IconIds } from '@/enums'
import LinkWrapper from '@/components/common/LinkWrapper'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => console.error(error), [error])
    return (
        <PageWrapper>
            <div className="mx-auto mt-10 flex flex-col items-center gap-4 max-w-lg">
                <p className="font-semibold text-lg">
                    Sorry, something went <span className="text-primary">wrong</span>
                </p>
                <div className="flex w-full flex-col items-center gap-2 rounded-xl">
                    <pre className="text-primary max-h-96 overflow-y-auto border border-dashed border-primary/20 rounded-xl px-8 py-10 w-full text-xs text-center text-wrap">
                        {extractErrorMessage(error)}
                    </pre>
                </div>
                <div className="flex w-full flex-col items-center gap-3">
                    <button
                        onClick={() => reset()}
                        className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-default/20 hover:bg-background/10 px-4 py-4 font-semibold sm:py-2"
                    >
                        <p className="font-semibold">Reload page</p>
                        <IconWrapper id={IconIds.UPDATE_NOW} className="size-5" />
                    </button>

                    <p className="text-sm text-default">
                        Please try again or
                        <LinkWrapper href={AppUrls.FBERGER_WEBSITE} target="_blank" className="underline hover:text-primary px-1">
                            contact us
                        </LinkWrapper>
                        if the problem persists.
                    </p>
                </div>
            </div>
        </PageWrapper>
    )
}
