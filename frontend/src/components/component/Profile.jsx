import useGetUserProfile from '@/hooks/useGetUserProfile'
import { MessageCircle, Podcast, Save, Settings2, Tag, ThumbsUp } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { USER_API_ENDPOINT } from '@/utils/constant'
import axios from 'axios'
import { toast } from 'sonner'
import { setUser } from '@/redux/authSlice'


const Profile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const params = useParams()
    const userID = params?.id
    const { user, getUserProfile } = useSelector(store => store.auth)
    useGetUserProfile(params?.id)
    const [active, setActive] = useState("posts")
    const getBookMaksAndPostData = active === "posts" ? getUserProfile?.posts : getUserProfile?.bookmarks
    
    const isFollowing = user?.following?.includes(userID)


    const followHander = async () => {
        try {
            const res = await axios.post(`${USER_API_ENDPOINT}/followorunfollow/${userID}`, {}, { withCredentials: true })
            if (res?.data?.success) {
                const updatefollowing = isFollowing ?
                    user?.following?.filter((id) => id !== userID) :
                    [...user.following, userID]

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
        <div className='h-screen overflow-scroll max-w-screen-lg mx-auto px-4 scrollbar-hide'>
            <div className='flex flex-col sm:flex-row justify-center mt-8 gap-8 sm:gap-12'>
                <div className='flex items-start'>
                    <div className='w-[120px] sm:w-[150px]'>
                        <Avatar className="w-full h-full">
                            <AvatarImage src={getUserProfile?.profilePicture ? getUserProfile?.profilePicture : "https://th.bing.com/th/id/OIP.eK6H-dLMO-Ia8NxgddZuqwHaHa?pid=ImgDet&w=178&h=178&c=7&dpr=1.5"} />
                            <AvatarFallback className="w-full h-fu">Profile</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='flex flex-col justify-center gap-3 ml-6 sm:ml-8 md:ml-12'>
                        <div className='flex gap-4 items-center'>
                            <p className='font-semibold text-[12px] sm:text-xl'>{getUserProfile?.fullname || getUserProfile?.username}</p>
                            {
                                user?._id === getUserProfile?._id ?
                                    <div className='flex gap-2'>
                                        <button onClick={() => navigate("/profile/edit")} className='px-4 py-1 bg-[#EFEFEF] rounded font-semibold text-[7px] lg:text-[14px] md:text-[13px] hover:bg-gray-200 transition-all ease-in-out duration-300'>Edit Profile</button>
                                        <button className='px-4 py-1 bg-[#EFEFEF] rounded font-semibold text-[7px] lg:text-[14px] md:text-[13px] hover:bg-gray-200 transition-all ease-in-out duration-300'>View Archive</button>
                                        <Settings2 className='text-gray-600' size={20} />
                                    </div> :
                                    <div className='flex gap-3'>
                                        <button onClick={followHander} className='px-4 py-1 bg-[#EFEFEF] rounded font-semibold text-[7px] lg:text-[14px] md:text-[13px] hover:bg-gray-200 transition-all ease-in-out duration-300'> 
                                            {isFollowing ? "Following" : "Follow"}
                                        </button>
                                        <button className='px-4 py-1 bg-[#EFEFEF] rounded font-semibold text-[7px] lg:text-[14px] md:text-[13px] hover:bg-gray-200 transition-all ease-in-out duration-300'>Message</button>
                                    </div>
                            }
                        </div>

                        <div className='flex gap-6 items-center text-xs sm:text-sm'>
                            <p>{getUserProfile?.posts?.length} posts</p>
                            <p>{getUserProfile?.followers?.length} followers</p>
                            <p>{getUserProfile?.following?.length} following</p>
                        </div>

                        <div className='flex items-center'>
                            <div>
                                <p className='font-bold text-xs sm:text-sm'>{user?.bio}</p>
                                <p className='px-3 py-1 w-fit mt-1 text-xs bg-[#EFEFEF] rounded-full font-semibold text-gray-600'>
                                    @{user?.username}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className='mt-8 sm:mt-12 mx-4 sm:mx-16' />

            <div className='flex justify-center gap-8 mt-8 sm:mt-12 text-sm items-center text-gray-600'>
                <div onClick={() => setActive("posts")} className="flex cursor-pointer gap-2 items-center hover:bg-gray-100 p-2 rounded-full transition-all duration-300 ease-in-out">
                    <Podcast width={18} />
                    <p className={`${active === "posts" ? 'font-bold' : ""}`}>POSTS</p>
                </div>
                <div onClick={() => setActive("save")} className='flex cursor-pointer gap-2 items-center hover:bg-gray-100 p-2 rounded-full transition-all duration-300 ease-in-out'>
                    <Save width={18} />
                    <p className={`${active === "save" ? 'font-bold' : ""}`}>SAVED</p>
                </div>
                <div onClick={() => setActive("tag")} className='flex cursor-pointer gap-2 items-center hover:bg-gray-100 p-2 rounded-full transition-all duration-300 ease-in-out'>
                    <Tag width={18} />
                    <p className={`${active === "tag" ? 'font-bold' : ""}`}>TAGGED</p>
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 overflow-y-auto h-full scrollbar-hide justify-center'>
                {
                    getBookMaksAndPostData?.length === 1 ? (
                        <div key={getBookMaksAndPostData[0]._id} className='relative group mx-auto'>
                            <div className='overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
                                <img className='w-full h-64 object-cover transition-all duration-300' src={getBookMaksAndPostData[0]?.image} alt={getBookMaksAndPostData[0]?.title} />
                            </div>
                            {/* Overlay content */}
                            <div className='absolute top-0 left-0 right-0 bottom-10'>
                                <div className='flex flex-col justify-center items-center h-[260px] w-full  bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                    <p className='text-white font-semibold text-xl'>{getBookMaksAndPostData[0]?.caption}</p>

                                    <div className='flex gap-4'>
                                        <div className='flex items-center text-white'>
                                            <ThumbsUp size={18} className='mr-2' />
                                            <p className='font-semibold text-xl'>{getBookMaksAndPostData[0]?.likes?.length}</p>
                                        </div>

                                        <div className='flex items-center text-white'>
                                            <MessageCircle size={18} className='mr-2' />
                                            <p className='font-semibold text-xl'>{getBookMaksAndPostData[0]?.comment?.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        getBookMaksAndPostData?.map((post) => (
                            <div key={post._id} className='relative group'>
                                <div className='overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
                                    <img className='w-full h-64 object-cover transition-all duration-300' src={post?.image} alt={post?.title} />
                                </div>
                                {/* Overlay content */}
                                <div className='absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                    <div className='flex flex-col justify-center items-center h-full w-full'>
                                        <p className='text-white font-semibold text-xl'>{post?.caption}</p>

                                        <div className='flex gap-4'>
                                            <div className='flex items-center text-white'>
                                                <ThumbsUp size={18} className='mr-2' />
                                                <p className='font-semibold text-xl'>{post?.likes?.length}</p>
                                            </div>

                                            <div className='flex items-center text-white'>
                                                <MessageCircle size={18} className='mr-2' />
                                                <p className='font-semibold text-xl'>{post?.comment?.length}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                }
            </div>
        </div>
    );
}

export default Profile;
