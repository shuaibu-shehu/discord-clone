'use client'

import CreateServerModal from '@/components/modals/create-server-modal'
import React, { useEffect } from 'react'
import InviteModal from '../modals/invite-modal'
import EditServerModal from '../modals/edit-server-modal'
import MemebersModal from '../modals/members-modal'
import CreateChannelModal from '../modals/create-channel-modal '
import LeaveServerModal from '../modals/leave-server-modal'
import DeleteServerModal from '../modals/delete-server-modal'
import DeleteChannelModal from '../modals/delete-channel-modal'
import EditChannelModal from '../modals/edit-channel-modal'
import MessageFileModal from '../modals/message-file-modal'
import DeleteMessageModal from '../modals/delete-messagel-modal'

export const ModalProvider = () =>{
    const [isMounted, setIsMounted] = React.useState(false)

    useEffect(() => {
        setIsMounted(true)
    },[])
    
    if(!isMounted){
        return null
    }
    
    return(
        <>
        <CreateServerModal />
        <CreateChannelModal />
        <InviteModal />
        <EditServerModal/>
        <MemebersModal/>
        <LeaveServerModal/>
        <DeleteServerModal/>
        <DeleteChannelModal/>
        <EditChannelModal/>
        <MessageFileModal />
        <DeleteMessageModal />
        </>
    )
}