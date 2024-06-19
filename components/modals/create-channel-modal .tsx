'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import axios from 'axios'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

import { useParams, useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'
import { ChannelType } from '@prisma/client'
import { channel } from 'diagnostics_channel'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import qs from 'query-string'
import { useEffect } from 'react'


const formSchema = z.object({
    name: z.string().min(1, {
        message: "channel name is require."
    }).refine(
        name => name !== 'general',
        { message: 'Channel name cannot be general' }
    ),
    type: z.nativeEnum(ChannelType)
})


function CreateChannelModal() {
    const router = useRouter()
    const params = useParams();
    const { isOpen, onClose, type, data } = useModal()

    const { channelType } = data

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            type: channelType || ChannelType.TEXT,
        }
    })

    useEffect(() => {
        if (channelType) {
            form.setValue('type', channelType)
        } else {
            form.setValue('type', ChannelType.TEXT)
        }
    }, [channelType, form])
    const isModalOpen = isOpen && type === "createChannel";


    const isLoading = form.formState.isSubmitting

    const onsubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: '/api/channels',
                query: {
                    serverId: params.serverId
                }
            })

            console.log(url);

            await axios.post(url, values);
            form.reset();
            router.refresh();
            onClose();

        } catch (error) {
            console.log('from client ', error);
        }

    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className=' text=2xl text-center font-bold'>
                        Create a new channel
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onsubmit)}
                        className=' space-y-8'
                    >
                        <div className=' space-y-8 px-6'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className=' uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                                            Channel name

                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className=' bg-zinc-300/50 
                                            border-0 
                                            focus-visible:ring-0
                                            text-blank 
                                            focus-visible:ring-offset-0
                                            '
                                                placeholder='Enter channel name'
                                                {...field}

                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='type'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className=' uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                                            Channel type
                                        </FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className=' bg-zinc-300/50 border-0
                                          focus:ring-0 text-black
                                          ring-offset-0 focus:ring-offset-0
                                          capitalize outline-none
                                          '
                                                >
                                                    <SelectValue
                                                        placeholder='Select a channel type'
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(ChannelType).map((type) => (
                                                    <SelectItem
                                                        key={type}
                                                        value={type}
                                                        className='capitalize'
                                                    >
                                                        {type.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter
                            className=' bg-gray-100 px-6 py-4'
                        >
                            <Button
                                variant={"primary"}
                                disabled={isLoading}
                                className=''>
                                Create
                            </Button>
                        </DialogFooter>

                    </form>

                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateChannelModal

