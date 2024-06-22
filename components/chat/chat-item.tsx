'use client'

import * as z from 'zod';
import axios from 'axios';
import qs from 'query-string';
import { zodResolver } from '@hookform/resolvers/zod';
import { Member, MemberRole, Profile } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import UserAvatar from '../user-avatar';
import ActionTooltip from '../action-tooltip';
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useModal } from '@/hooks/use-modal-store';
import { useParams, useRouter } from 'next/navigation';

interface ChatItemProps {
    id: string;
    content: string;
    member: Member & {
        profile: Profile
    };
    timeStamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, any>;
}

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className='w-4 h-4 text-indigo-500 ml-2' />,
    "ADMIN": <ShieldAlert className='w-4 h-4 text-rose-500 ml-2' />,

}

const formSchemma = z.object({
    content: z.string().min(1)
})

export default function ChatItem({
    id,
    content,
    member,
    timeStamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery
}: ChatItemProps) {
    const fileType = fileUrl?.split('.').pop();

    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const isOwner = currentMember.id === member.id;

    const canDeletedMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;

    const isPdf = fileType === "pdf" && fileUrl;
    const isImage = !isPdf && fileUrl;

    const [isEditing, setIsEditing] = useState(false);

    const {onOpen} = useModal();

    const router = useRouter();
    const params = useParams();

    const onMemberClick = ()=>{
        if(member.id === currentMember.id) return;

        router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
    } 

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === 'Escape' || event.keyCode === 27) {
                setIsEditing(false);
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    },[])

    const form = useForm<z.infer<typeof formSchemma>>({
        resolver: zodResolver(formSchemma),
        defaultValues: {
            content: content
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchemma>) => {                    
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: {...socketQuery,
                    messageId: id
                },     
            });            

             await axios.patch(url, values);

             form.reset();
            setIsEditing(false);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div
            className=' relative group flex items-center hover:bg-black/5 *:
    p-4 transition w-full
    '
        >
            <div
                className=' group flex gap-x-2 items-start w-full '
            >
                <div
                    onClick={onMemberClick}
                    className=' cursor-pointer hover:drop-shadow-md transition'
                >
                    <UserAvatar
                    src={member.profile.imageUrl} />
                </div>
                <div
                    className=' flex flex-col w-full'
                >
                    <div
                        className='flex items-center gap-x-2'
                    >
                        <div
                            className=' flex  items-center'
                        >
                            <p onClick={onMemberClick}  className='font-semibold hover:underline cursor-pointer'>
                                {member.profile.name}
                            </p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span
                            className='text-sm text-zinc-500 dark:text-zinc-400'
                        >
                            {timeStamp}
                        </span>
                    </div>
                    {isImage && (
                        <a href={fileUrl}
                            target='_blank'
                            rel='noreferrer noopener'
                            className=' relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48'
                        >
                            <Image
                                src={fileUrl}
                                alt={content}
                                fill
                                className=' object-cover'
                            />
                        </a>
                    )}
                    {isPdf && (
                        <div
                            className=' relative flex items-center p-2 mt-2 rounded-md  bg-background/10'
                        >
                            <FileIcon className=' h-10 w-10 fill-indigo-200 stroke-indigo-400' />
                            <a href={fileUrl}
                                target='_blank'
                                rel="noreferrer noopener"
                                className='ml-2 text-indigo-500
                            dark:text-indigo-400 text-sm
                            hover:underline'
                            >PDF File</a>
                        </div>
                    )}
                    {!fileUrl && !isEditing && (
                        <p
                            className={cn(' text-zinc-600 dark:text-zinc-300 text-sm',
                                deleted && ' italic text-zinc-500 dark:text-zinc-400 text-xs mt-1'
                            )}
                        >
                            {content}
                            {isUpdated && !deleted && (
                                <span
                                    className=' text-[10px] text-zinc-500 dark:text-zinc-400'
                                >
                                    (edited)
                                </span>
                            )}
                        </p>
                    )}
                    {!fileUrl && isEditing && (
                        <Form {...form}>
                                <form 
                                onSubmit={form.handleSubmit(onSubmit)}
                                className='flex items-center w-full gap-x-2 pt-2'
                                >
                                    <FormField
                                    control={form.control}
                                    name='content'
                                    render={({ field }) => (
                                        <FormItem className='flex-1'>
                                            <FormControl>
                                                <div
                                                className=' relative w-full'
                                                >
                                                    <Input
                                                    {...field}
                                                    disabled={isLoading} 
                                                    className='w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0
                                                    focus:outline-none text-zinc-600 dark:text-zinc-200'
                                                    placeholder='Edited Message'
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                    
                                    />
                                    <Button disabled={isLoading} size={'sm'} variant={'primary'}>Save</Button>
                                </form>
                                <span className=' text-[10px] mt-1 text-zinc-400'>
                                    Press escape to cancel, enter to save
                                </span>
                        </Form>
                    )}
                </div>
            </div>
            {canDeletedMessage && (
                <div
                    className=' hidden group-hover:flex items-center gap-x-2 absolute top-2
                p-1 right-5 bg-white dark:bg-zinc-800 border rounded-sm
                '
                >
                    {canEditMessage && (
                        <ActionTooltip label='Edit'>
                            <Edit
                                onClick={() => setIsEditing(true)}
                                className=' cursor-pointer ml-auto w-4 h-4 text-zinc-500
                            hover:text-zinc-600  dark:hover:text-zinc-300 transition'
                            />
                        </ActionTooltip>
                    )}
                    <ActionTooltip label='Delete'>
                        <Trash 
                         onClick={() => onOpen('deleteMessage', { 
                            apiUrl: `${socketUrl}/${id}`,
                            query: socketQuery
                        })}
                        className=' cursor-pointer ml-auto w-4 h-4 text-zinc-500
                            hover:text-zinc-600  dark:hover:text-zinc-300 transition'
                        />
                    </ActionTooltip>
                </div>
            )}
        </div>
    )
}
