import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from 'react';
import CreatePostDialog from './CreatePostDialog';
import { useNavigate } from 'react-router-dom';
import SearchDialog from './SearchDialog';
import axios from 'axios';
import { toast } from 'sonner';
import { USER_API_ENDPOINT } from '@/utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser, setUser } from '@/redux/authSlice';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '../ui/button';
import { setLikeNotifaction } from '@/redux/rtnSlice';

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [notificationPopoverOpen, setNotificationPopoverOpen] = useState(false);  // New state to control popover visibility
  const { user } = useSelector(store => store.auth);
  const { likeNotifaction } = useSelector(store => store.rtn);

  const leftSideBarItem = [
    { icon: <Home />, text: "Home" },
    // { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notification" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="h-6 w-6">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile"
    },
    { icon: <LogOut />, text: "LogOut" }
  ];

  const LogOutHander = async (e) => {
    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/logout`, {}, { withCredentials: true });
      if (res?.data?.success) {
        navigate("/auth");
        dispatch(setUser(null));
        dispatch(setSelectedUser(null));
        toast?.success(res?.data?.message);
      }
    } catch (error) {
      toast?.error(error?.response?.data?.message);
    }
  }

  const texthander = (textType) => {
    setText(textType);
    if (textType === "LogOut") {
      LogOutHander();
    }
    if (textType === "Create") {
      setOpen(true);
    }
    if (textType === "Search") {
      setOpenSearch(true);
    }
    if (textType === "Notification") {
      setNotificationPopoverOpen(!notificationPopoverOpen);
    }
    if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    }
    if (textType === "Messages") {
      navigate("/message");
    }
    if (textType === "Home") {
      navigate("/");
    }
  };

  return (
    <div className="w-[50px] md:w-[190px] lg:w-[20%] h-screen border">
      <div>
        <h1 className="text-xl font-semibold mt-3 p-3 hidden md:flex lg:flex">Instagram</h1>
        <img className="lg:hidden md:hidden h-7 mt-4 mb-2 w-15" src="https://logos-world.net/wp-content/uploads/2020/04/Instagram-Emblem.png" alt="Instagram Logo" />
        <div className="flex flex-col gap-5">
          {leftSideBarItem.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => texthander(item?.text)}
                className={`flex gap-3 items-center p-3 cursor-pointer hover:bg-gray-200 ${text === item.text ? "bg-gray-300" : ""}`}
              >
                <div className="flex items-center relative">
                  <p className="text-xl">{item?.icon}</p>

                  {item?.text === "Notification" && likeNotifaction.length > 0 && (
                    <Popover asChild open={notificationPopoverOpen} onOpenChange={setNotificationPopoverOpen}>
                      <PopoverTrigger>
                        <div className="relative bottom-3">
                          <div className="bg-red-500 h-4 w-4 absolute right-[-4px] top-[-2px] flex justify-center items-center rounded-full text-xs text-white font-semibold">
                            {likeNotifaction.length}
                          </div>
                        </div>
                      </PopoverTrigger>

                      <PopoverContent className="w-[320px] p-2 rounded-lg bg-white shadow-lg max-h-[300px] overflow-y-auto">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                          {likeNotifaction.length === 0 ? (
                            <p className="text-sm text-gray-500">No new notifications.</p>
                          ) : (
                            likeNotifaction.map((notifcation) => (
                              <div key={notifcation?._id} className="flex gap-3 items-center p-2 hover:bg-gray-100 rounded-lg transition-all">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={notifcation?.userDetails?.profilePicture} />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col">
                                  <p className="text-sm font-semibold">
                                    <span className="font-bold">{notifcation?.userDetails?.username}</span> {notifcation?.type} your post
                                  </p>
                                  <p className="text-xs font-semibold text-gray-400">{notifcation?.post?.caption}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                <p className="hidden md:block">{item.text}</p>
              </div>
            );
          })}
        </div>
        <SearchDialog openSearch={openSearch} setOpenSearch={setOpenSearch} />
        <CreatePostDialog open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

export default SideBar;
