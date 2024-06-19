'use client'

import { ServerWithMembersWithProfiles } from '@/types';
import { ChannelType, MemberRole } from '@prisma/client';
import React from 'react'
import { Plus, Settings } from 'lucide-react';

import dynamic from 'next/dynamic';
import { useModal } from '@/hooks/use-modal-store';

const ActionTooltip = dynamic(() => import("../action-tooltip"), { ssr: false });

interface ServerSectionProps {
    label: string;
    role?: MemberRole;
    selectionType: 'channels' | 'members';
    channelType?: ChannelType;
    server?:ServerWithMembersWithProfiles;
}

export  function ServerSection({
label,
role,
selectionType,
channelType,
server
}: ServerSectionProps) {
    const {onOpen} = useModal()
  return (
    <div
    className='flex items-center justify-between py-2'
    >
        <p
        className='text-sm uppercase font-semibold text-zinc-500
        dark:text-zinc-400
        '
        >
            {label}
        </p>
        {role != MemberRole.GUEST && selectionType==='channels' && (
            <ActionTooltip
            label='Create Channel'
            side='top'
            >
                <button
                onClick={()=>onOpen('createChannel',{channelType})}
                className=' text-zinc-500 hover:text-zinc-600
                dark:text-zinc-400 dark:hover:text-zinc-300
                '
                >
                    <Plus className='w-4 h-4'/>
                </button>
            </ActionTooltip>
        )}
        {role === MemberRole.ADMIN && selectionType==='members' && (
            <ActionTooltip
            label='Manage Members'
            side='top'
            >
                <button
                onClick={()=>onOpen('members',{server})}
                className=' text-zinc-500 hover:text-zinc-600
                dark:text-zinc-400 dark:hover:text-zinc-300
                '
                >
                    <Settings className='w-4 h-4'/>
                </button>
            </ActionTooltip>
        )}
    </div>
  )
}
