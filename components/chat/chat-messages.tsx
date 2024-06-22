'use client'
import { Member, Message, Profile } from '@prisma/client';
import React, { ElementRef, Fragment, useRef } from 'react'
import ChatWelcome from './chat-welcome';
import UseChatQuery from '@/hooks/use-chat-query';
import { Loader2, ServerCrash } from 'lucide-react';
import ChatItem from './chat-item';
import {format} from 'date-fns';
import { useChatSocket } from '@/hooks/use-chat-socket';
import useChatScroll from '@/hooks/use-chat-scroll';


const DATE_FORMAT = 'd MMM yyyy,HH:mm';

type MessageWithMemberWithProfile = Message & {
 member: Member & {
  profile : Profile
 }
}

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
   
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`

  const chatRef = useRef<ElementRef<"div">>(null)
  const bottomRef = useRef<ElementRef<"div">>(null)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = UseChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue
  })
  
  useChatSocket({ addKey,updateKey,queryKey })
  useChatScroll({ 
    chatRef, 
    bottomRef, 
    loadMore: fetchNextPage, 
    shouldLoadMore: !isFetchingNextPage && 
    !!hasNextPage, 
    count: data?.pages?.[0].items.length??0});


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
    ref={chatRef}
    className=' flex-1 flex flex-col py-4 overflow-y-auto'
    >
        <div className=' flex-1'>
           {!hasNextPage && <ChatWelcome
            name={name}
            type={type}
            /> }
            {hasNextPage && (
              <div className='flex justify-center'>
                {isFetchingNextPage ? (
                 <Loader2 className='w-6 h-6 text-zinc-500 animate-spin my-4 '/> 
                ): (
                  <button
                  onClick={() => fetchNextPage()}
                  className=' text-zinc-500 text-xs hover:text-zinc-600  dark:text-zinc-400
                  my-4 dark:hover:text-zinc-300 transition
                  '
                  >
                    Load previous messages
                  </button>
                )}
              </div>
              )}
            <div className=' flex flex-col-reverse mt-auto'>
              {data?.pages.map((group, i) => (
                <Fragment key={i}>
                  {group.items.map((message:MessageWithMemberWithProfile) => (
                    <ChatItem
                    key={message.id}
                    id={message.id}
                    content={message.content}
                    currentMember={member}
                    fileUrl={message.fileUrl}
                    deleted={message.deleted}
                    member={message.member}
                    timeStamp={format(new Date(message.createdAt), DATE_FORMAT)}
                    isUpdated={message.updatedAt !== message.createdAt}
                    socketUrl={socketUrl}
                    socketQuery={socketQuery}
                    />
                  ))}
                </Fragment>
              ))}
            </div>
        </div>
        <div ref={bottomRef}/>
    </div>
  )
}
