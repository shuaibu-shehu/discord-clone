'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import axios from 'axios'

import { Dialog, DialogDescription, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

import FileUpload from '../file-upload'
import { useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'
import { useEffect } from 'react'


const formSchema = z.object({
    name: z.string().min(1, { message: "Server name is require." }),
    imageUrl: z.string().min(1, { message: "Image URL required." }),
    })
    
    
    function EditServerModal() {
        const router = useRouter()
        const {isOpen, onClose, type, data} = useModal()
        
        const { server } = data;
        const isModalOpen = isOpen && type==="editServer";
        
        const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            imageUrl: ''
        }
    })

    useEffect(() => {

        if(server){
            form.setValue('name', server.name)
            form.setValue('imageUrl', server.imageUrl)
        }

    },[server, form])

    const isLoading = form.formState.isSubmitting

    const onsubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        try {
            await axios.patch(`/api/servers/${server?.id}`, values);
            form.reset();
            router.refresh();
             onClose();
                    
        } catch (error) {
            console.log('from client ', error);
        }

    }

    const handleClose = () =>{
        form.reset();
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className=' text=2xl text-center font-bold'>
                        Customize your server
                    </DialogTitle>
                    <DialogDescription className=' text-center'>
                     Give your server a name and upload an image to make it your own.
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
                                name='imageUrl'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload
                                            endpoint={'serverImage'}
                                            value={field.value}
                                            onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className=' uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                                            Server name

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
                                            placeholder='Enter server name'
                                            {...field}

                                            />
                                        </FormControl>
                                        <FormMessage/>
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
                                    Save
                        </Button>
                        </DialogFooter>

                    </form>

                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditServerModal

