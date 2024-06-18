'use client'
import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ActionToolTipProps{
    label :string;
    children : React.ReactNode;
    side? : 'top' | 'right' | 'bottom' | 'left';
    align? : 'start' | 'center' | 'end';   
}

export default function ActionTooltip({ label,children, side, align } : ActionToolTipProps) {
  return (
    <TooltipProvider>
        <Tooltip delayDuration={50}>
                <TooltipTrigger>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    <p className=' font-semibold text-sm capitalize'>
                            {label.toLowerCase()}
                    </p>
                </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}
