import ChatHeader from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessages } from '@/components/chat/chat-messages';
import { MediaRoom } from '@/components/media-room';
import { getOrCreateConversation } from '@/lib/conversation';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

interface MemberIdPageProps {
  params: {
    serverId: string;
    memberId: string;
  },
  searchParams: {
    video?: boolean;
    audio?: boolean;
  }

}



export default async function MemberIdPage({
  params,
  searchParams
}: MemberIdPageProps) {
  const profile = await currentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id
    },
    include: {
      profile: true
    }
  })

  if (!currentMember) {
    console.log('conversation ');
    return redirect('/');
  }

  const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

  if (!conversation) {
    return redirect(`/server/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;
console.log(searchParams.video, searchParams.audio);

  return (
    <div
      className=' bg-white dark:bg-[#313338] flex flex-col h-screen'
    >
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type='conversation'
      />
      {searchParams.video && !searchParams.audio && (
        <MediaRoom
        chaId={conversation.id}
        video={true}
        audio={true}
        />
      )}
      {searchParams.audio && !searchParams.video && (
        <MediaRoom
        chaId={conversation.id}
        video={false}
        audio={true}
        />
      )}
      {!searchParams.video && !searchParams.audio && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type='conversation'
            apiUrl={`/api/direct-messages`}
            paramKey='conversationId'
            paramValue={conversation.id}
            socketUrl={`/api/socket/direct-messages`}
            socketQuery={{
              conversationId: conversation.id
            }}
          />
        </>
      )}

      <ChatInput
        name={otherMember.profile.name}
        type='conversation'
        apiUrl='/api/socket/direct-messages'
        query={{
          conversationId: conversation.id
        }}
      />
    </div>
  )
}
