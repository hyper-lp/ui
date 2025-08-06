'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/utils'
import { env } from '@/env/t3-env'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
import Authors from '../common/Authors'
import { SITE_NAME } from '@/config/app.config'
import LinkWrapper from '../common/LinkWrapper'
import { AppUrls } from '@/enums'
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
        <footer
            className={cn('w-full flex flex-col md:flex-row md:justify-between md:items-end px-8 font-light text-xs gap-2 md:gap-0', props.className)}
        >
            {/* left */}
            <div className="flex gap-8 flex-row">
                <p className="truncate hidden md:flex">August 2025 © {SITE_NAME}</p>
                {/* <StyledTooltip closeDelay={500} content={<p>Deployed on {dayjs.utc(commitDate).format('D MMM. YYYY HH:mm A')} UTC</p>}>
                    <p className="truncate hover:underline hover:text-primary">Alpha version</p>
                </StyledTooltip> */}
                <LinkWrapper href={AppUrls.TAIKAI} target="_blank" className="hidden md:flex">
                    <p className="truncate hover:underline hover:text-primary cursor-alias">Hyperliquid Community Hackathon</p>
                </LinkWrapper>
            </div>

            {/* right */}
            <Authors className="justify-start md:justify-end" />
        </footer>
    )
}
