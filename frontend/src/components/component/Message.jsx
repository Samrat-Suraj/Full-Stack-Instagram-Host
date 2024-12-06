import React, { useEffect, useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '@/redux/authSlice';
import { ArrowLeftIcon } from 'lucide-react';
import axios from 'axios';
import { MESSAGE_API_ENDPOINT } from '@/utils/constant';
import { toast } from 'sonner';
import { setMessages } from '@/redux/chatSlice';
import useGetMessage from '@/hooks/useGetMessage';
import useGetRealTimeMessage from '@/hooks/useGetRealTimeMessage';
import useGetAllUser from '@/hooks/useGetAllUser';

const Message = () => {
    useGetMessage();
    useGetRealTimeMessage();

    const [message, setMessage] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const dispatch = useDispatch();
    const { selectedUser, suggestedUser, user, allUser } = useSelector(store => store.auth);
    const { onlineUsers, messages } = useSelector(store => store.chat);
    const isOnline = onlineUsers?.includes(selectedUser?._id);

    // Reference to the message container
    const messageEndRef = useRef(null);

    const OnclickHander = async () => {
        try {
            const res = await axios.post(`${MESSAGE_API_ENDPOINT}/send/${selectedUser?._id}`, { message }, {
                withCredentials: true
            });

            if (res) {
                setMessage("");
                dispatch(setMessages([...messages, res?.data?.newMessage]));
            }
        } catch (error) {
            toast.error(error?.response?.data?.success);
        }
    }

    const handleBackClick = () => {
        dispatch(setSelectedUser(null));
    }

    useEffect(() => {
        // Scroll to the bottom when a new message is received or selectedUser is changed
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, selectedUser]);

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        }
    }, []);

    return (
        <div className="w-full h-screen flex flex-col lg:flex-row">
            {/* Sidebar */}
            <div className={`lg:w-[35vw] w-full p-4 border-b lg:border-r lg:h-screen overflow-y-auto bg-white ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
                <h1 className="text-center text-2xl font-semibold text-gray-800 mb-4">Messages</h1>
                <h2 className="text-center text-lg font-medium text-gray-600 mb-8">{user?.username?.toUpperCase()}</h2>
                <hr className="mb-6" />

                {/* Suggested Users List */}
                {allUser?.filter(selected => selected?._id !== user?._id).map((selected, index) => {
                    const isOnline = onlineUsers?.includes(selected?._id);
                    return (
                        <div
                            key={index}
                            onClick={() => {
                                dispatch(setSelectedUser(selected));
                                setSidebarOpen(false);
                            }}
                            className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                        >
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={selected?.profilePicture} />
                                <AvatarFallback>cn</AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                                <p className="font-semibold text-gray-900 text-base">{selected?.username}</p>
                                <p className={`text-gray-500 font-bold ${isOnline ? "text-green-500" : "text-red-600"} text-xs`}>
                                    {isOnline ? 'Online' : 'Offline'}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Message Content */}
            <div className="flex-1 p-6 lg:p-8 bg-gray-50 overflow-hidden flex flex-col h-screen">
                {selectedUser ? (
                    <>
                        {/* Back Arrow and Selected User Info */}
                        <div className="flex items-center gap-4 p-4 hover:bg-gray-100 rounded-lg cursor-pointer mb-6">
                            <button onClick={handleBackClick} className="text-gray-600">
                                <ArrowLeftIcon size={20} />
                            </button>
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={selectedUser?.profilePicture} />
                                <AvatarFallback>Suraj</AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                                <p className="font-semibold text-gray-900 text-base">{selectedUser?.username}</p>
                                <p className={`text-gray-500 font-bold ${isOnline ? "text-green-500" : "text-red-600"} text-xs`}>
                                    {isOnline ? 'Online' : 'Offline'}
                                </p>
                            </div>
                        </div>

                        {/* Message History */}
                        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-4 max-h-[calc(100vh-200px)] lg:max-h-[calc(100vh-240px)]">
                            {messages?.map((msg, index) => (
                                <div key={index} className={`flex ${msg?.senderId === user?._id ? "justify-end" : "justify-start"} gap-3`}>
                                    <div className={`text-gray-800 ${msg?.senderId === user?._id ? "bg-blue-500" : "bg-gray-200"} p-4 rounded-lg max-w-[80%] lg:max-w-[70%] xl:max-w-[60%]`}>
                                        <p className="text-sm">
                                            {msg?.message}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {/* This div will serve as the scroll target */}
                            <div ref={messageEndRef} />
                        </div>

                        {/* Input & Send Button */}
                        <div className="flex items-center gap-4 mt-4 pt-4">
                            <Input onChange={(e) => setMessage(e?.target?.value)} className="flex-1 focus-visible:ring-transparent py-3 px-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Type a message..." />
                            <Button onClick={OnclickHander} className="bg-blue-500 text-white hover:bg-blue-600 py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                                Send
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full w-full text-center">
                        <div className="flex flex-col items-center">
                            {/* <MessageCircleCodeIcon size={200} /> */}
                            <h1 className="mt-4 text-lg font-semibold text-gray-700">Send A Message To Start A Conversation</h1>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Message;
