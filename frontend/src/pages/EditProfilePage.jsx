import EditProfile from '@/components/component/EditProfile'
import SideBar from '@/components/component/SideBar'
import React from 'react'

const EditProfilePage = () => {
  return (
    <div className='flex gap-2'>
        <SideBar/>
        <EditProfile/>
    </div>
  )
}

export default EditProfilePage