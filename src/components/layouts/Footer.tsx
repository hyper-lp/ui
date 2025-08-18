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
        <footer
            className={cn('flex min-h-16 w-full items-center justify-between gap-2 px-6 text-sm font-light md:gap-0 xl:text-base', props.className)}
        >
            {/* left */}
            <div className="hidden flex-row gap-8 md:flex">
                <div>
                    <StyledTooltip closeDelay={500} content={<p>Last deployed on {dayjs.utc(commitDate).format('D MMM. YYYY HH:mm A')} UTC</p>}>
                        <p className="truncate">August 2025</p>
                    </StyledTooltip>
                </div>

                <LinkWrapper href={AppUrls.TAIKAI} target="_blank">
                    <p className="cursor-alias truncate hover:text-primary hover:underline">Hyperliquid Community Hackathon</p>
                </LinkWrapper>
            </div>

            {/* right */}
            <div className="mx-auto flex flex-row items-center justify-center gap-8 md:mx-0 md:justify-end">
                <StyledTooltip
                    closeDelay={500}
                    content={
                        <div className="flex flex-col">
                            <p className="text-lg font-bold">Altitude</p>
                            <p>Lightning-fast RPC nodes for investors & developers</p>
                            <p>
                                <LinkWrapper href="https://rpc.reachaltitude.xyz/" target="_blank">
                                    <p className="cursor-alias truncate underline hover:text-primary">https://rpc.reachaltitude.xyz/</p>
                                </LinkWrapper>
                            </p>
                        </div>
                    }
                >
                    <p className="truncate">Sponsors</p>
                </StyledTooltip>
                <LinkWrapper href={AppUrls.STATUS} target="_blank">
                    <p className="cursor-alias truncate hover:text-primary hover:underline">Status 🤖</p>
                </LinkWrapper>
                <LinkWrapper href={AppUrls.DOCS} target="_blank">
                    <p className="cursor-alias truncate hover:text-primary hover:underline">Docs</p>
                </LinkWrapper>
                <LinkWrapper href={AppUrls.CONTACT_US} className="cursor-alias underline-offset-2 hover:text-primary hover:underline">
                    Contact
                </LinkWrapper>
            </div>
            {/* <Authors className="justify-start md:justify-end" /> */}
        </footer>
    )
}
