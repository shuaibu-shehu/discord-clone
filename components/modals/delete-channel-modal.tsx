'use client'


import { Dialog, DialogDescription, DialogContent, DialogHeader, DialogTitle, DialogFooter} from '../ui/dialog'

import { useModal } from '@/hooks/use-modal-store'
import { Button } from '../ui/button';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import qs from 'query-string'

 
function DeleteChannelModal() {
        const { isOpen, onClose, type, data} = useModal()
        const [isLoading, setIsLoading] = useState(false);
        const isModalOpen = isOpen && type==="deleteChannel";
        const { server, channel } = data;
        const router = useRouter();

        const onClick = async ()=>{
            try {
                setIsLoading(true);
                const url = qs.stringifyUrl({
                    url: `/api/channels/${channel?.id}`,
                    query: {
                        serverId: server?.id,
                    }
                });
                await axios.delete(url);
                onClose();
                router.push(`/servers/${server?.id}`);
                router.refresh();
            } catch (error) {
                console.log(error);
            }finally{
                setIsLoading(false);
            }
        }


    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className=' text=2xl text-center font-bold'>
                        Delete channel
                    </DialogTitle>
                    <DialogDescription className=' text-center text-zinc-500'>
                        Are you sure you want to do this <br /> 
                        <span  className=' font-semibold text-indigo-500'>{channel?.name}</span> will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter 
                className=' bg-gray-100 px-6 py-4'
                >
                    <div
                    className=' flex justify-between w-full items-center'
                    >
                        <Button
                        disabled={isLoading}
                        onClick={onClose}
                        variant={'ghost'}
                        >
                            Cancel
                        </Button>
                        <Button
                        disabled={isLoading}
                        onClick={onClick}
                        variant={'primary'}
                        >
                           Delete
                        </Button>
                    </div>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}

export default DeleteChannelModal

