import Feeds from '@/components/component/Feeds'
import RightSideBar from '@/components/component/RightSideBar'
import SideBar from '@/components/component/SideBar'
import useGetAllPosts from '@/hooks/useGetAllPosts'
import useGetSuggestedUser from '@/hooks/useGetSuggestedUser'
import React from 'react'

const HomePage = () => {
  useGetAllPosts()
  useGetSuggestedUser()
  return (
    <div className=''>
      <div className='flex justify-between h-screen w-screen' >
        <SideBar />
        <Feeds />
        <RightSideBar />
      </div>
    </div>
  )
}

export default HomePage