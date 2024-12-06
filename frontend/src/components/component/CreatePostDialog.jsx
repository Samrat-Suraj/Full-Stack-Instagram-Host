import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2} from 'lucide-react'
import axios from 'axios'
import { POST_API_ENDPOINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setAllPosts } from '@/redux/postSlice'
import { setUser } from '@/redux/authSlice'


const CreatePostDialog = ({ open, setOpen }) => {
    const dispatch = useDispatch()
    const [image, setImage] = useState("")
    const [caption , setCaption] = useState("")
    const {user} = useSelector(store => store.auth)
    const {allPost} = useSelector(store => store.post)

    const [loading , setLoading] = useState(false)

    const ImageChangehander = (e) => {
        setImage(e?.target?.files[0])
    }
    const captionHander = (e)=>{
        setCaption(e?.target?.value)
    }

    const onInteractOutside = (e) => {
        setOpen(false)
        setImage("")
    }

    const onSubmitHander = async () =>{
        const form = new FormData()
        if(caption){
            form.append("caption" , caption)
        }
        if(image){
            form.append("image" , image)
        }

        try {
            setLoading(true)
            const res = await axios.post(`${POST_API_ENDPOINT}/addpost`,form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            });

            if (res?.data?.success) {
                setCaption("")
                setImage("")
                setOpen(false)
                dispatch(setAllPosts([res?.data?.post , ...allPost]))
                toast?.success(res?.data?.message);
            }
        } catch (error) {
            toast?.error(error?.response?.data?.message);
        }finally{
            setLoading(false)
        }
    }

    return (

        <Dialog open={open}>
            <DialogContent className="w-fit" onInteractOutside={onInteractOutside}>
                <div className='w-full'>
                    <div className='bg-white rounded-lg shadow-lg m-auto'>
                        <div className='text-center'>
                            <p className='font-semibold'>Create Post</p>
                        </div>
                        <hr className="my-2" />

                        {image ? (
                            <>
                                <div className='h-[390px] w-[350px]'>
                                    <div className='flex items-center gap-2 p-2'>
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={user?.profilePicture} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>

                                        <p>{user?.username}</p>
                                    </div>
                                    <textarea onChange={captionHander} className='h-[20%] w-full outline-none p-2' placeholder='Write Something ......'></textarea>

                                    <div className='flex justify-center'>
                                        <img className='h-64 w-[80%] object-contain' src={URL.createObjectURL(image)} alt="Selected content" />
                                    </div>
                                </div>
                                <button onClick={onSubmitHander} className='bg-blue-500 w-full p-2 text-white font-semibold flex items-center justify-center gap-2'>
                                    {
                                        loading ? <Loader2 className='h-5 w-5 animate-spin ' /> : <></>
                                    }
                                    Post</button>
                                <button  className='bg-red-500 w-full p-2 text-white font-semibold mt-2'>Remove Image</button>
                            </>
                        ) : (
                            <div className='h-[390px] w-[350px] bg-white flex justify-center items-center'>
                                <div className='flex flex-col gap-3 items-center'>
                                    <img className='h-20 w-25' src="./gallery.png" alt="" />
                                    <p className='text-xl'>Drag photos and videos here</p>
                                    <div>
                                        <label htmlFor="image" className='bg-blue-500 p-2 text-[12px] text-white font-semibold rounded-md cursor-pointer'>Select from Your Computer</label>
                                        <input type="file" onChange={ImageChangehander} id='image' hidden accept="image/*" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    )
}

export default CreatePostDialog