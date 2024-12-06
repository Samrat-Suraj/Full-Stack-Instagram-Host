import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
const sideBarUserSwitch = () => {
    const navigate = useNavigate()
    const {user} = useSelector(store => store.auth)
    return (
        <div className='flex mt-4 justify-between items-center' >
            <div className='flex items-center gap-2'>
                <Avatar>
                    <AvatarImage className=" cursor-pointer " onClick={()=>navigate(`/profile/${user?._id}`)} src={user?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0 text-sm font-semibold" >
                    <p> {user?.username} </p>
                    <p className="text-sm font-normal text-gray-500" >{user?.username}</p>
                </div>
            </div>
            <div className="text-blue-500 text-[12px] font-semibold">Switch</div>
        </div>
    )
}

export default sideBarUserSwitch