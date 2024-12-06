

import { setMessages } from '@/redux/chatSlice'
import { MESSAGE_API_ENDPOINT } from '@/utils/constant'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetMessage = () => {
    const dispatch = useDispatch()
    const { selectedUser } = useSelector(store => store.auth)

    useEffect(() => {
        const featchAllMessage = async () => {
            try {
                const res = await axios.get(`${MESSAGE_API_ENDPOINT}/all/${selectedUser?._id}`, { withCredentials: true })
                if (res?.data?.success) {
                    dispatch(setMessages(res?.data?.messages))
                }
            } catch (error) {
                console.log(error)
            }
        }
        featchAllMessage()
    }, [dispatch , selectedUser])
}

export default useGetMessage