import { FileIds, IconIds } from '@/enums'
import { cn } from '@/utils'
import { ReactNode } from 'react'
import DarkThemeSVG from './svgs/DarkThemeSVG'
import LightThemeSVG from './svgs/LightThemeSVG'
import Image from 'next/image'
import IconWrapper from './IconWrapper'

export function FileWrapper(props: { children: ReactNode; className?: string }) {
    return <div className={cn('flex items-center justify-center relative', props.className)}>{props.children}</div>
}

export default function FileMapper({
    className = 'size-5',
    sizes = '20px',
    ...props
}: {
    id?: FileIds | IconIds | string
    sizes?: string
    className?: string
}) {
    // theme
    if (props.id === FileIds.THEME_LIGHT) return <LightThemeSVG className={className} />
    if (props.id === FileIds.THEME_DARK) return <DarkThemeSVG className={className} />
    if (props.id === FileIds.BASE)
        return (
            <FileWrapper className={className}>
                <Image src={`/chains/base.svg`} alt={`${props.id} logo`} sizes={sizes} fill className={className} />
            </FileWrapper>
        )
    if (props.id === FileIds.UNICHAIN)
        return (
            <FileWrapper className={className}>
                <Image src={`/chains/unichain.svg`} alt={`${props.id} logo`} sizes={sizes} fill className={className} />
            </FileWrapper>
        )

    // icon
    if (props.id && props.id in IconIds) return <IconWrapper id={props.id as IconIds} className={className} />

    // fallback
    return <div className={cn('bg-milk rounded-full', className)} />
}
