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
}: {
    src?: string
    alt?: string
    width?: number
    height?: number
    priority?: boolean
    className?: string
}) {
    const [imgError, setImgError] = useState(false)
    if (!src || imgError) return <div className={cn('skeleton-loading', className)} style={{ width, height }} />
    return (
        <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={cn('object-cover', className)}
            onError={() => setImgError(true)}
            priority={priority}
        />
    )
}
