'use client'


import { Dialog, DialogDescription, DialogContent, DialogHeader, DialogTitle} from '../ui/dialog'

import { useModal } from '@/hooks/use-modal-store'
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useOrigin } from '@/hooks/use-origin';
import { useState } from 'react';
import axios from 'axios';

 
function InviteModal() {
        const {onOpen,isOpen, onClose, type, data} = useModal()
        const origin = useOrigin();
        const  [copied , setCopied] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const isModalOpen = isOpen && type==="invite";
        const { server } = data;
      const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

      const onCopy = () => {
            navigator.clipboard.writeText(inviteUrl);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 1000);
      }
      const onnew = async () => {
        try {
            const res = await axios.patch(`/api/servers/${server?.id}/invite-code`);
            onOpen('invite', { server: res.data });

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
                        invite friends
                    </DialogTitle>
                    
                </DialogHeader>
            <div className='p-6'>
                <Label
                className=' uppercase text=xs font-bold
                text-zinc-500 dark:text-secondary/70
                '
                >
                 Server invite link   
                </Label>
                <div
                className=' flex items-center mt-2 gap-x-2'
                >
                    <Input
                    disabled= {isLoading}
                    className=' bg-zinc-300/50 border-0
                    focus-visible:ring-0 text-black focus-visible:ring-offset-0
                    '
                    value={inviteUrl}
                    />

                    <Button 
                    disabled={isLoading}
                    onClick={onCopy}
                    size={"icon"}>
                        {copied ? <Check/> : <Copy className='h-4 e-4' />}
                        
                    </Button>
                </div>
                <Button
                onClick={onnew}
                disabled={isLoading}
                variant={'link'}
                size={'sm'}
                className=' text-sm text-zinc-500 mt-4'
                >
                    Generate a new link
                    <RefreshCw className='h-4 w-4 ml-2'/>
                </Button>
            </div>
            </DialogContent>
        </Dialog>
    )
}

export default InviteModal

