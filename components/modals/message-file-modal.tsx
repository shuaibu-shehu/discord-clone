'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import axios from 'axios'

import { Dialog, DialogDescription, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Button } from '../ui/button'

import FileUpload from '../file-upload'
import { useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'

import qs from 'query-string'

const formSchema = z.object({
    fileUrl: z.string().min(1, { message: "Attachment is required." }),
})


function MessageFileModal() {
    const { isOpen, onClose, type, data} = useModal()
    const router = useRouter()
    
    const {apiUrl, query } = data
    const isModalOpen = isOpen && type==='messageFile' 
      const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: ''
        }
    })

    const handleClose = () => {
        form.reset()
        onClose()
    }

    const isLoading = form.formState.isSubmitting

    const onsubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || '',
                query
            })

            await axios.post(url, {
                ...values,
                content: values.fileUrl
            });
            form.reset();
            router.refresh();
            console.log('reloading');
            
            handleClose();
        } catch (error) {
            console.log('from client ', error);
        }

    }



    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className=' text=2xl text-center font-bold'>
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription className=' text-center'>
                        Send a file as a message
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onsubmit)}
                        className=' space-y-8'
                    >
                        <div className=' space-y-8 px-6'>
                            <div
                                className='flex items-center justify-center text-center'
                            >

                                <FormField 
                                control={form.control}
                                name='fileUrl'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload
                                            endpoint={'messageFile'}
                                            value={field.value}
                                            onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                                />
                            </div>
                            
                        </div>
                        <DialogFooter
                        className=' bg-gray-100 px-6 py-4'
                        >
                        <Button
                        variant={"primary"}
                        disabled={isLoading}
                         className=''>
                                    send
                        </Button>
                        </DialogFooter>

                    </form>

                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default MessageFileModal

