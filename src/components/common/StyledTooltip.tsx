'use client'

import { ReactNode } from 'react'
import { Tooltip, TooltipProps } from '@heroui/tooltip'
import { cn } from '@/utils'

type TooltipPlacement = TooltipProps['placement']

interface StyledTooltipProps {
    content: ReactNode
    children: ReactNode
    placement?: TooltipPlacement
    disableAnimation?: boolean
    className?: string
    delay?: number
    closeDelay?: number
    showArrow?: boolean
    isDisabled?: boolean
}

export default function StyledTooltip({
    content,
    children,
    placement = 'top',
    disableAnimation = true,
    className,
    delay = 200,
    closeDelay = 200,
    showArrow = true,
    isDisabled = false,
}: StyledTooltipProps) {
    return (
        <Tooltip
            placement={placement}
            disableAnimation={disableAnimation}
            delay={delay}
            closeDelay={closeDelay}
            showArrow={showArrow}
            isDisabled={isDisabled}
            content={
                <div
                    className={cn('z-[9999] rounded-xl backdrop-blur-lg shadow-lg p-3 -mt-1 text-sm flex will-change-transform', className)}
                    role="tooltip"
                >
                    {content}
                </div>
            }
        >
            {children}
        </Tooltip>
    )
}
