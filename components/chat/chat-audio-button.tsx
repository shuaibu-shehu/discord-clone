'use client'

import qs from 'query-string';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PhoneIcon, PhoneOff, Video, VideoOff } from 'lucide-react';
import dynamic from 'next/dynamic';
const ActionTooltip = dynamic(() => import("../action-tooltip"), { ssr: false });

export default function ChatAudioButton() {
    
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isAudio = searchParams?.get("audio");
    
    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname || "",
            query: {
                audio: isAudio ? undefined : true
            }
        },{ skipNull: true });
        
        router.push(url);
    
    }

    const Icon = isAudio? PhoneOff: PhoneIcon;
const tooltipLabel = isAudio ? "End voice call " : "Start voice call"

    return (
    <ActionTooltip  side='bottom' label={tooltipLabel}>
        <button  onClick={onClick}  className=' hover:opacity-75 transition mr-4'>
            <Icon  className='h-5 w-5 text-zinc-500 dark:text-zinc-400'  />
        </button>
    </ActionTooltip>
  )
}
