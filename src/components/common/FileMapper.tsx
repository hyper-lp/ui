import { FileIds, IconIds } from '@/enums'
import { cn } from '@/utils'
import { ReactNode } from 'react'
import IconWrapper from '../icons/IconWrapper'
import { ImageWrapper } from './ImageWrapper'

export function FileWrapper(props: { children: ReactNode; className?: string }) {
    return <div className={cn('relative flex items-center justify-center', props.className)}>{props.children}</div>
}

export default function FileMapper({
    className = 'rounded-full',
    width = 20,
    height = 20,
    priority = false,
    ...props
}: {
    id?: FileIds | IconIds | string
    width?: number
    height?: number
    priority?: boolean
    className?: string
}) {
    // all files
    if (props.id && props.id in FileIds)
        return (
            <ImageWrapper
                src={props.id as FileIds}
                alt={props.id as string}
                width={width}
                height={height}
                className={className}
                priority={priority}
            />
        )

    // all icons, just in case
    if (props.id && props.id in IconIds) return <IconWrapper id={props.id as IconIds} className={className} />

    // fallback
    return <div className={cn('bg-milk rounded-full', className)} style={{ width, height }} />
}
