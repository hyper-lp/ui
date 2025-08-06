'use client'

import StyledTooltip from '../common/StyledTooltip'
import { AppUrls } from '@/enums'
import LinkWrapper from '../common/LinkWrapper'
import { cn } from '@/utils'
import IframeWrapper from './IframeWrapper'

export default function Authors(props: { className?: string }) {
    return (
        <div className={cn('flex flex-wrap gap-x-1', props.className)}>
            <p className="text-wrap">
                <StyledTooltip placement="top" closeDelay={500} content={<IframeWrapper src={AppUrls.MERSO_WEBSITE} />}>
                    <LinkWrapper
                        href={AppUrls.MERSO_WEBSITE}
                        target="_blank"
                        className="underline-offset-2 cursor-alias hover:underline hover:text-primary"
                    >
                        xMerso,
                    </LinkWrapper>
                </StyledTooltip>
            </p>
            <p className="text-wrap">
                <LinkWrapper
                    href={AppUrls.KATALYSTER_TWITTER}
                    target="_blank"
                    className="underline-offset-2 cursor-alias hover:underline hover:text-primary"
                >
                    Katalyster
                </LinkWrapper>
            </p>
            <p className="text-wrap">and</p>
            <p className="text-wrap">
                <StyledTooltip placement="top" closeDelay={500} content={<IframeWrapper src={AppUrls.FBERGER_WEBSITE} />}>
                    <LinkWrapper
                        href={AppUrls.FBERGER_WEBSITE}
                        target="_blank"
                        className="underline-offset-2 cursor-alias hover:underline hover:text-primary"
                    >
                        fberger
                    </LinkWrapper>
                </StyledTooltip>
            </p>
            <p>- reach out to help</p>
        </div>
    )
}
