import Message from '@/components/component/Message'
import SideBar from '@/components/component/SideBar'
import useGetAllUser from '@/hooks/useGetAllUser'
import React from 'react'

const MessagePage = () => {
  useGetAllUser()
  return (
    <div className='flex gap-2' >
        <SideBar/>
        <Message/>
    </div>
  )
}

export default MessagePage