'use client'

import { use, useEffect, useState } from "react"

import { LiveKitRoom , VideoConference } from "@livekit/components-react"
import "@livekit/components-styles"
import { Channel } from "@prisma/client"
import { useUser } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"

interface MediaRoomProps {
    chaId: string;
    video: boolean;
    audio: boolean;
}


export function MediaRoom({
    chaId,
    video,
    audio
}: MediaRoomProps) {
  const { user } = useUser()
  const [token, setToken] = useState("")
  
  useEffect(() => {
      if(!user?.firstName || !user?.lastName) return

      const name = `${user.firstName} ${user.lastName}`;

      (async () => {
        try {
            const resp = await fetch(`/api/livekit?room=${chaId}&username=${name}`)
            const data = await resp.json()
            setToken(data.token)
        } catch (error) {
            console.log(error);
            
        }
      })();
  }, [user?.firstName, user?.lastName, chaId])

  if(token=="") {
    return (
    <div 
    className=" flex flex-col flex-1 justify-center items-center"
    >
        <Loader2 className="w-7 h-7 text-zinc-500 dark:text-zinc-300 animate-spin my-4"/>
        <p
        className="text-sm text-zinc-500 dark:text-zinc-400"
        >
            Loading...
        </p>
    </div>
  )
}
 return (
    <LiveKitRoom
    data-lk-theme="default"
    serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
    token={token}
    connect={true}
    video={video}
    audio={audio}
    >
        <VideoConference />
    </LiveKitRoom>
 )
}