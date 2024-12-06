import NotificationCard from '@/components/component/NotificationCard'
import SideBar from '@/components/component/SideBar'
import React from 'react'


const Notification = () => {
    return (
        <div className='flex gap-2'>
            <SideBar />
            <div className='w-[80%] p-4 h-screen overflow-scroll scrollbar-hide'>
                {
                    [1, 2, 3, 4, 5, 6].map((item, index) => {
                        return (
                            <NotificationCard />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Notification