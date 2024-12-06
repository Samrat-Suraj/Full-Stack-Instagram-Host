import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Bell, MessageSquare } from "lucide-react";
import { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


const NotificationCard = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="mx-auto mt-1 w-full" >
            <div
                className={`p-4 w-full bg-white rounded-lg shadow-sm flex items-center space-x-4 transition-all duration-200 ease-in-out transform ${isHovered ? 'scale-105 shadow-lg' : ''}`}
            >
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="font-semibold text-[15px] text-gray-900">UserName</p>
                    <p className="text-[10px] text-gray-600 
                      md:text-sm lg:text-[14px]
                      line-clamp-3 sm:line-clamp-none lg:line-clamp-4">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis sequi rem, cumque asperiores libero...
                    </p>
                </div>
                <div className="flex space-x-3 text-gray-500">
                    <button className="hover:text-blue-600 transition-colors">
                        <Bell size={18} />
                    </button>
                    <button className="hover:text-blue-600 transition-colors">
                        <MessageSquare size={18} />
                    </button>
                    <button className="hover:text-blue-600 transition-colors">
                        <Popover>
                            <PopoverTrigger><MoreHorizontal size={18} /></PopoverTrigger>
                            <PopoverContent className="w-fit p-3">Delete</PopoverContent>
                        </Popover>
                    </button>
                </div>
            </div>
        </div>
    );
};





export default NotificationCard;
