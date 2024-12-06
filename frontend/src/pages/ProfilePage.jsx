import Profile from '@/components/component/Profile'
import SideBar from '@/components/component/SideBar'
import React from 'react'

const ProfilePage = () => {
  return (
    <div className='flex'>
      <SideBar/>
      <Profile/>
    </div>
  )
}

export default ProfilePage