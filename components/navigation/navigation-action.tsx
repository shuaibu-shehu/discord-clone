'use client'

import { Plus } from 'lucide-react'
import React from 'react'
import { useModal } from '@/hooks/use-modal-store'
import dynamic from 'next/dynamic'

const ActionTooltip = dynamic(() => import("../action-tooltip"), { ssr: false });

export default function NavigationAction() {
  const {onOpen, data} = useModal()
  const {server} = data
  return (
    <div>
        <ActionTooltip 
        side={'right'} 
        align={'center'} 
        label={'Add a server'}
        >
        <button 
        onClick={()=>onOpen('createServer',{server})}
        className='group'
        >
            <div 
            className='
             flex mx-3 h-[48px] w-[48px] rounded-[24px]
            group-hover:rounded-[16px] transition-all
             items-center justify-center
            overflow-hidden  bg-zinc-50 dark:bg-neutral-700 group-hover:bg-emerald-500 
             '
            >
                <Plus 
                className=' group-hover:text-white transition text-emerald-500'
                size={25}
                />

            </div>
        </button>
    </ActionTooltip>
    </div>
  )
}
