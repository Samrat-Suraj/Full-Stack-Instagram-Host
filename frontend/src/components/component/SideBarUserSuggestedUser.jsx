import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { setUser } from "@/redux/authSlice"
import { USER_API_ENDPOINT } from "@/utils/constant"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const SideBarUserSuggestedUser = ({ suggestUser }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector(store => store.auth)
    const isFollowing = user?.following?.includes(suggestUser?._id)

    const followHander = async () => {
        try {
            const res = await axios.post(`${USER_API_ENDPOINT}/followorunfollow/${suggestUser?._id}`, {}, { withCredentials: true })
            if (res?.data?.success) {
                const updatefollowing = isFollowing ?
                    user?.following?.filter((id) => id !== suggestUser?._id) :
                    [...user.following, suggestUser?._id]

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
        <div className='flex justify-between items-center' >
            <div className='flex items-center gap-2'>
                <Avatar>
                    <AvatarImage className=" cursor-pointer " onClick={() => navigate(`/profile/${suggestUser?._id}`)} src={suggestUser?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0 text-sm font-semibold" >
                    <p className="text-[13px] cursor-pointer " onClick={() => navigate(`/profile/${suggestUser?._id}`)} >{suggestUser?.username}</p>
                    <p className="text-[10px] font-semibold text-gray-500" >Developer recommended</p>
                </div>
            </div>
            <div onClick={followHander} className=" cursor-pointer text-blue-500 text-[12px] font-semibold">
                {isFollowing ? "Following" : "Follow"}
            </div>
        </div>
    )
}

export default SideBarUserSuggestedUser