'use client'
import { X } from 'lucide-react';

import { UploadDropzone } from '@/lib/uploadthing';

import "@uploadthing/react/styles.css"
import Image from 'next/image';



interface fileUIploadProps{
    onChange: (url?:string)=>void;
    value: string;
    endpoint: 'messageFile' | 'serverImage';
}

function FileUpload({
    onChange,
    value,
    endpoint
}: fileUIploadProps) {

    const fileType = value.split('.').pop();

    if(value && fileType !='pdf'){
        console.log(value);
        
        return (
            <div className=' relative h-20 w-20'>
                <Image 
                fill
                src={value}
                alt="upload"
                className=' rounded-full'
                />
                <button 
                onClick={()=>onChange("")}
                className='
                 bg-rose-500 text-white
                  rounded-full  p-1
                  absolute top-0 right-0
                  shadow-sm z-[1000] cursor-pointer
                '
                type='button'
                >
                    <X  className=' h-4 w-4'/>
                </button>
            </div>
        )
    }

  return (
    <UploadDropzone
    endpoint={endpoint}
    onClientUploadComplete={(res)=>{
        onChange(res?.[0].url);
    }}
    onUploadError={(error: Error)=>{
        console.log(error);
    }}
    />
  )
}

export default FileUpload