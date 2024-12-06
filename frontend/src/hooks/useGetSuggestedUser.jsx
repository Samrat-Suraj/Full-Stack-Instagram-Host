import { setSuggestedUser } from '@/redux/authSlice'
import { USER_API_ENDPOINT } from '@/utils/constant'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetSuggestedUser = () => {
    const dispatch = useDispatch()
    useEffect(()=>{
        const featchSuggestedUserData = async () =>{
            try {
                const res = await axios.get(`${USER_API_ENDPOINT}/suggested`, {withCredentials : true})
                if(res?.data){
                    dispatch(setSuggestedUser(res?.data?.users))
                }
            } catch (error) {
                console.log(error)
            }
        }
        featchSuggestedUserData()
    },[dispatch])
}

export default useGetSuggestedUser