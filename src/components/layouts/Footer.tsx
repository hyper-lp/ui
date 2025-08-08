'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/utils'
import { env } from '@/env/t3-env'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import LinkWrapper from '../common/LinkWrapper'
import { AppUrls } from '@/enums'
import StyledTooltip from '../common/StyledTooltip'
dayjs.extend(utc)
dayjs.extend(relativeTime)

export default function Footer(props: { className?: string }) {
    const [commitDate, setCommitDate] = useState<null | Date>(null)
    useEffect(() => {
        const timestamp = env.NEXT_PUBLIC_COMMIT_TIMESTAMP
        if (timestamp) {
            const date = new Date(parseInt(timestamp, 10) * 1000)
            setCommitDate(date)
        }
    }, [])
    if (!commitDate) return null
    return (
        <footer className={cn('w-full flex justify-between px-6 font-light text-xs gap-2 md:gap-0', props.className)}>
            {/* left */}
            <div className="flex gap-8 flex-row">
                <div className="hidden md:flex">
                    <StyledTooltip closeDelay={500} content={<p>Last deployed on {dayjs.utc(commitDate).format('D MMM. YYYY HH:mm A')} UTC</p>}>
                        <p className="truncate">Aug. 2025</p>
                    </StyledTooltip>
                </div>

                <LinkWrapper href={AppUrls.TAIKAI} target="_blank" className="hidden md:flex">
                    <p className="truncate hover:underline hover:text-primary cursor-alias">Hyperliquid Community Hackathon</p>
                </LinkWrapper>
                <LinkWrapper href={AppUrls.DOCS} target="_blank">
                    <p className="truncate hover:underline hover:text-primary cursor-alias">Docs</p>
                </LinkWrapper>
            </div>

            {/* right */}
            <LinkWrapper href={AppUrls.CONTACT_US} className="underline-offset-2 cursor-alias hover:underline hover:text-primary">
                Contact
            </LinkWrapper>
            {/* <Authors className="justify-start md:justify-end" /> */}
        </footer>
    )
}
