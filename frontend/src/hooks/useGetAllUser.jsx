import { setAllUser } from '@/redux/authSlice'
import { USER_API_ENDPOINT } from '@/utils/constant'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllUser = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const featchAllUserData = async () => {
            try {
                const res = await axios.get(`${USER_API_ENDPOINT}/getall`, { withCredentials: true })
                if (res?.data) {
                    dispatch(setAllUser(res?.data?.users))
                }
            } catch (error) {
                console.log(error)
            }
        }
        featchAllUserData()
    }, [dispatch , setAllUser])
}

export default useGetAllUser