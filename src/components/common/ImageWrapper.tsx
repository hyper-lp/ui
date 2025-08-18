'use client'

import { cn } from '@/utils'
import Image from 'next/image'
import { useState } from 'react'

export function ImageWrapper({
    src,
    alt = 'missing alt',
    width = 20,
    height = 20,
    className = 'rounded-full',
    priority = false,
    scaleByHeight = false,
}: {
    src?: string
    alt?: string
    width?: number
    height?: number
    priority?: boolean
    className?: string
    scaleByHeight?: boolean
}) {
    const [imgError, setImgError] = useState(false)
    if (!src || imgError) return <div className={cn('skeleton-loading', className)} style={{ width, height }} />

    const imageStyle = scaleByHeight ? { height: height, width: 'auto' } : { width: 'auto', height: 'auto', maxWidth: width, maxHeight: height }

    return (
        <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={cn('object-cover', className)}
            style={imageStyle}
            onError={() => setImgError(true)}
            priority={priority}
        />
    )
}
