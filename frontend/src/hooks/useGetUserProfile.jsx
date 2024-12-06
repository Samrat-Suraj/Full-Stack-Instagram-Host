import { setGetUserProfile } from '@/redux/authSlice'
import { USER_API_ENDPOINT } from '@/utils/constant'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch()
    useEffect(()=>{
        const featchUserProfile = async () =>{
            try {
                const res = await axios.get(`${USER_API_ENDPOINT}/${userId}/profile`, {withCredentials : true})
                if(res?.data){
                    dispatch(setGetUserProfile(res?.data?.user))
                }
            } catch (error) {
                console.log(error)
            }
        }
        featchUserProfile()
    },[dispatch , userId])
}

export default useGetUserProfile