'use client'

import StyledTooltip from '../common/StyledTooltip'
import { AppUrls, IconIds } from '@/enums'
import LinkWrapper from '../common/LinkWrapper'
import { cn } from '@/utils'
import IframeWrapper from './IframeWrapper'
import IconWrapper from '../icons/IconWrapper'

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
                <StyledTooltip
                    placement="top"
                    closeDelay={500}
                    content={
                        <div className="flex flex-col gap-4 bg-background p-2 rounded-lg">
                            {[
                                {
                                    name: 'Telegram',
                                    iconIds: IconIds.TELEGRAM,
                                    description: 'https://t.me/katalyster',
                                },
                                {
                                    name: 'Twitter',
                                    iconIds: IconIds.X,
                                    description: 'https://x.com/Katalyster',
                                },
                                {
                                    name: 'Linkedin',
                                    iconIds: IconIds.LINKEDIN,
                                    description: 'https://www.linkedin.com/in/msaubin/',
                                },
                            ].map((social) => (
                                <div key={social.name}>
                                    <LinkWrapper
                                        href={social.description}
                                        target="_blank"
                                        className="underline-offset-2 cursor-alias hover:underline hover:text-primary flex items-center gap-1"
                                    >
                                        <IconWrapper id={social.iconIds} className="w-4 h-4 mr-1" />
                                        {social.name}
                                    </LinkWrapper>
                                </div>
                            ))}
                        </div>
                    }
                >
                    <LinkWrapper
                        href={AppUrls.KATALYSTER_TWITTER}
                        target="_blank"
                        className="underline-offset-2 cursor-alias hover:underline hover:text-primary"
                    >
                        Katalyster
                    </LinkWrapper>
                </StyledTooltip>
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
