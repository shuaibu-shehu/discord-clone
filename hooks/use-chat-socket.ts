import { useSocket } from "@/components/providers/socket.provider";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSockeetProps = {
    addKey: string;
    updateKey: string;
    queryKey: string;
}
type MessagewithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

export const useChatSocket = ({
    addKey,
    updateKey,
    queryKey }: ChatSockeetProps) => {

    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) return;

        socket.on(updateKey, (message: MessagewithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {

                if (!oldData || !oldData.pages || oldData.pages.length === 0) return;
                console.log('FROM QUERYT',oldData);
                
                const newData = oldData.pages.map((page: any) => {
                    return {
                        ...page,
                        items: page.items.map((item: MessagewithMemberWithProfile) => {
                            if (item.id === message.id) {
                                return message;
                            }
                            return item;
                        })
                    }
                })
                return {
                    ...oldData,
                    pages: newData
                }
            })
        });

        socket.on(addKey, (message: MessagewithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0){
                    return {
                        pages: [
                            {
                                items: [message]
                            }
                        ]
                    }
                }
                console.log('FROM QUERYT',oldData);
                

                const newData = [...oldData.pages];

                newData[0]={
                    ...newData[0],
                    items: [message, ...newData[0].items]
                };

                return {
                    ...oldData,
                    pages: newData
                }
            })
        });

        return () => {
            socket.off(addKey);
            socket.off(updateKey);
        }
    }, [socket, queryClient, addKey, updateKey, queryKey])
}