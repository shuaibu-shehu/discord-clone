'use client'

import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import dynamic from 'next/dynamic';

const ActionTooltip = dynamic(() => import("../action-tooltip"), { ssr: false });

interface NavigationItemProps{
    id : string;
    imageUrl : string;
    name : string;
}

export default function NavigationItem({id , imageUrl, name} : NavigationItemProps) {
  const router = useRouter();
  const params = useParams();

  const onClick = () => {
    router.push(`/servers/${id}`);
  }
 
    return (
    <ActionTooltip 
    side={'right'}
    align={'center'}
    label={name}
    >
        <button
        onClick={()=>onClick()}
        className=" group relative 
        flex items-center"
  
       >
         <div
        className={cn(
            ` absolute left-0 bg-primary
             rounded-r-full transition-all w-[4px]`,
             params?.serverId == id ? ' h-[36px]' : ' h-[8px]'
        )}
         />
         <div 
         className={cn(
            ` relative group flex mx-3 h-[48px] w-[48px] rounded-[20px] 
            group-hover:rounded-[16px] transition-all overflow-hidden`,
            params?.serverId == id &&' bg-primary/10 text-primary rounded-[16px]'
         )}
         >
            <Image 
            fill
            src={imageUrl}
            alt= 'Channel'
            />
         </div>
        </button>
    </ActionTooltip>
)
}
