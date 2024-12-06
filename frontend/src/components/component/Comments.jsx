import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Comments = ({ comment }) => {
    return (
        <>
            <div key={comment?._id} className='mt-1'>
                <div className='flex gap-2 items-start '>
                    <Avatar className="h-5 w-5">
                        <AvatarImage src={comment?.author?.profilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p className='font-semibold text-[13px]'>{comment?.author?.username}</p>
                    <p className='text-sm'>{comment?.text}</p>
                </div>
            </div>
        </>
    )
}

export default Comments