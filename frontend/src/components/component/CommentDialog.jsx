import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { POST_API_ENDPOINT } from '@/utils/constant';
import { setAllPosts, setSelectedPost } from '@/redux/postSlice';
import Comments from './Comments';

const CommentDialog = ({ open, setOpen }) => {
    const dispatch = useDispatch()
    
    const { selectedPost, allPost } = useSelector(store => store.post)
    const [com, setCommemt] = useState([])
    const [text, setText] = useState("")

    useEffect(() => {
        if (selectedPost) {
            setCommemt(selectedPost?.comment);
        }
    }, [selectedPost]);

    const onChangeHander = (e) => {
        const text = e.target.value
        if (text.trim()) {
            setText(text)
        } else {
            setText("")
        }
    }


    const commentHander = async () => {
        try {
            const res = await axios.post(`${POST_API_ENDPOINT}/${selectedPost._id}/comment`, { text }, { withCredentials: true })
            if (res?.data?.success) {
                const updateComment = [...com, res?.data?.comment]
                setCommemt(updateComment)

                const updatedPostData = allPost.map(p =>
                    p._id === selectedPost?._id ?
                        { ...p, comment: updateComment }
                        : p
                )

                setText("")
                dispatch(setAllPosts(updatedPostData))
                toast.success(res?.data?.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen} className="relative">
            <DialogContent onInteractOutside={() => setOpen(false)} className="p-0 max-w-[90%] sm:max-w-2xl lg:max-w-[90%] lg:max-h-[90%]">
                <DialogHeader className="p-4">
                    <div className="flex flex-col sm:flex-row sm:gap-4 w-full h-full">

                        <div className="w-full sm:w-1/2 relative">
                            <img
                                className="w-full h-[250px] sm:h-[400px] object-cover rounded-lg"
                                src={selectedPost?.image}
                                alt="Comment Dialog"
                            />
                        </div>

                        <div className='h-full w-[1px] bg-gray-600 sm:block hidden'></div>

                        <div className="w-full sm:w-1/2 mt-4 sm:mt-0 flex flex-col justify-between h-full">

                            <div className='flex justify-between'>
                                <div className='flex items-center gap-2'>
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={selectedPost?.author?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <p className="text-sm font-semibold">{selectedPost?.author?.username}</p>
                                </div>

                                <Dialog>
                                    <DialogTrigger><MoreHorizontal className="text-gray-600 cursor-pointer" /></DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <Button variant="ghost" className="text-sm text-[14px] font-semibold" >Follow</Button>
                                            <Button variant="ghost" className="text-sm text-[14px] font-semibold">Add to Favorites</Button>
                                            <Button variant="ghost" className="text-sm text-[14px] text-red-600 font-semibold">Delete</Button>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <hr className='mt-2' />


                            <div className="flex flex-col mt-5 gap-2 overflow-y-auto max-h-[250px] sm:max-h-[300px] scrollbar-thin scrollbar-thumb-gray-400">
                                {
                                    com?.map((commentss) => {
                                        return (
                                            <Comments key={commentss?._id} comment={commentss} />
                                        )
                                    })
                                }
                            </div>


                            <div className="flex items-center justify-between mt-auto">
                                {/* <div className="flex items-center gap-2">
                                    <Heart className="cursor-pointer hover:text-gray-400" />
                                    <MessageCircle onClick={() => setOpen(true)} className="cursor-pointer hover:text-gray-400" />
                                    <Send className="cursor-pointer hover:text-gray-400" />
                                </div>
                                <BookMarkedIcon className="cursor-pointer hover:text-gray-400" /> */}
                            </div>


                            <div className="flex items-center gap-2 mt-4">
                                <input
                                    placeholder="Write a Comment"
                                    onChange={onChangeHander}
                                    value={text}
                                    className="w-full text-sm outline-none border p-2 rounded-md"
                                    type="text"
                                />
                                <p onClick={commentHander} className="text-xs text-blue-500 font-bold cursor-pointer">Post</p>
                            </div>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default CommentDialog;
