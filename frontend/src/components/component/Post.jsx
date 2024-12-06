import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import CommentDialog from "./CommentDialog";
import { useState } from "react";
import axios from "axios";
import { POST_API_ENDPOINT, USER_API_ENDPOINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { FaHeart, FaBookmark } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { setAllPosts, setSelectedPost } from "@/redux/postSlice";
import { useNavigate } from "react-router-dom";
import { setUser } from "@/redux/authSlice";

const Post = ({ post }) => {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store.auth);
    const { allPost } = useSelector((store) => store.post);

    const isBookMarked = post?.bookmarks?.includes(user?._id);
    const isLiked = post?.likes?.includes(user?._id);

    const [comment, setCommemt] = useState(post?.comment)
    const isFollowing = user?.following?.includes(post?.author?._id)


    const handleLike = async () => {
        try {
            const action = isLiked ? "dislike" : "like";
            const res = await axios.get(`${POST_API_ENDPOINT}/${post?._id}/${action}`, { withCredentials: true });
            if (res?.data?.success) {
                const updatedPosts = allPost?.map((p) =>
                    p?._id === post?._id
                        ? { ...p, likes: isLiked ? p?.likes?.filter((id) => id !== user._id) : [...p?.likes, user?._id] }
                        : p
                );
                dispatch(setAllPosts(updatedPosts));
                toast.success(res?.data?.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    const handleBookmark = async () => {
        try {
            const res = await axios.get(`${POST_API_ENDPOINT}/${post?._id}/bookmark`, { withCredentials: true });
            if (res?.data?.success) {
                const updatedPosts = allPost?.map((p) =>
                    p?._id === post?._id
                        ? { ...p, bookmarks: isBookMarked ? p?.bookmarks?.filter((id) => id !== user?._id) : [...p?.bookmarks, user?._id] }
                        : p
                );
                dispatch(setAllPosts(updatedPosts));
                toast.success(res?.data?.type);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    const handleDeletePost = async () => {
        try {
            setLoading(true);
            const res = await axios.delete(`${POST_API_ENDPOINT}/delete/${post?._id}`, { withCredentials: true });
            if (res?.data?.success) {
                const updatedPosts = allPost?.filter((p) => p?._id !== post?._id);
                dispatch(setAllPosts(updatedPosts));
                toast.success(res?.data?.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

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
            const res = await axios.post(`${POST_API_ENDPOINT}/${post._id}/comment`, { text }, { withCredentials: true })
            if (res?.data?.success) {
                const updateComment = [...comment, res?.data?.comment]
                setCommemt(updateComment)

                const updatedPostData = allPost?.map(p =>
                    p?._id === post?._id ?
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

    const followHander = async () => {
        try {
            const res = await axios.post(`${USER_API_ENDPOINT}/followorunfollow/${post?.author?._id}`, {}, { withCredentials: true })
            if (res?.data?.success) {
                const updatefollowing = isFollowing
                    ? user?.following?.filter(id => id !== post?.author?._id)
                    : [...user?.following, post?.author?._id]

                dispatch(setUser({
                    ...user,
                    following: updatefollowing
                }))
                toast.success(res?.data?.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    return (
        <div className="flex  mt-2 justify-center px-4 lg:px-10">
            <div className="flex flex-col w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage className=" cursor-pointer " onClick={() => navigate(`/profile/${post?.author?._id}`)} src={post?.author?.profilePicture} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <p onClick={() => navigate(`/profile/${post?.author?._id}`)} className="text-sm font-medium text-gray-800 cursor-pointer ">{post?.author?.username}</p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <MoreHorizontal className="text-gray-600 cursor-pointer" />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                {user?._id !== post?.author?._id && (
                                    <Button onClick={followHander} variant="ghost" className="text-sm text-[14px] font-semibold">
                                        {isFollowing ? "Following" : "Follow"}
                                    </Button>
                                )}
                                <Button onClick={handleBookmark} variant="ghost" className="text-sm text-[14px] font-semibold">
                                    Add to Favorites
                                </Button>
                                {user?._id === post?.author?._id && (
                                    <Button onClick={handleDeletePost} variant="ghost" className="text-sm text-[14px] text-red-600 font-semibold">
                                        {loading ? "Deleting..." : "Delete"}
                                    </Button>
                                )}
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="relative w-full max-w-lg overflow-hidden rounded-lg">
                    <img className="w-full h-auto object-cover" src={post?.image} alt="Post" />
                </div>

                <div className="p-2 mt-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div onClick={handleLike} className="cursor-pointer">
                                {isLiked ? <FaHeart size={24} className="text-red-600" /> : <Heart size={24} className="hover:text-gray-400" />}
                            </div>

                            <MessageCircle onClick={() => {
                                dispatch(setSelectedPost(post))
                                setOpen(true)
                            }}

                                className="cursor-pointer hover:text-gray-400" />
                            <Send className="cursor-pointer hover:text-gray-400" />
                        </div>
                        <div onClick={handleBookmark} className="cursor-pointer">
                            {isBookMarked ? <FaBookmark size={21} /> : <CiBookmark size={23} />}
                        </div>
                    </div>
                    <p className="text-[13px] mt-2">{post?.likes?.length} Likes</p>
                    <p className="text-[13px] mt-1 font-bold">@{post?.author?.username} <span className="font-normal">{post?.caption}</span></p>
                    <p onClick={() => {
                        dispatch(setSelectedPost(post))
                        setOpen(true)
                    }} className="text-gray-500 font-bold text-[14px] cursor-pointer">
                        View all {comment?.length} comments
                    </p>
                    <CommentDialog open={open} setOpen={setOpen} />
                    <div className="flex items-center mt-1">
                        <input value={text} onChange={onChangeHander} placeholder="Write a Comment" className="w-full text-[13px] outline-none" type="text" />
                        <p onClick={commentHander} className="text-[12px] text-blue-500 font-bold cursor-pointer">Post</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;
