'use client'
import { Member } from '@prisma/client';
import React from 'react'
import ChatWelcome from './chat-welcome';
import UseChatQuery from '@/hooks/use-chat-query';
import { Loader2, ServerCrash } from 'lucide-react';


interface ChatMessagesProps { 
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, any>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
  }




export function ChatMessages({
name,
member,
chatId,
apiUrl,
socketUrl,
socketQuery,
paramKey,
paramValue,
type
}: ChatMessagesProps) {

  const queryKey = `chat-${chatId}`;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  }= UseChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue
  })
  
  if(status ==="error"){
    return(
      <div
      className=' flex-1 flex flex-col justify-center items-center'
      >
       <ServerCrash className='w-7 h-7 text-zinc-400  '/>
       <p
       className='text-sm text-zinc-500 dark:text-zinc-400'
       >
        Something went wrong
       </p>
      </div>
    )
  }


if(status ==="pending"){
  return(
    <div
    className=' flex-1 flex flex-col justify-center items-center'
    >
     <Loader2 className='w-7 h-7 text-zinc-400 animate-spin '/>
     <p
     className='text-sm text-zinc-500 dark:text-zinc-400'
     >
      Loading Messages
     </p>
    </div>
  )
}

  return (
    <div
    className=' flex-1 flex flex-col py-4 overflow-y-auto'
    >
        <div className=' flex-1'>
            <ChatWelcome
            name={name}
            type={type}
            /> 
        </div>
    </div>
  )
}
