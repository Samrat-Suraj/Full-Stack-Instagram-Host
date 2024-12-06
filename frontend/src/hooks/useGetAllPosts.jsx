import { setAllPosts } from '@/redux/postSlice'
import { POST_API_ENDPOINT } from '@/utils/constant'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllPosts = () => {
    const dispatch = useDispatch()
    useEffect(()=>{
        const featchAllData = async () =>{
            try {
                const res = await axios.get(`${POST_API_ENDPOINT}/all`, {withCredentials : true})
                if(res?.data?.success){
                    dispatch(setAllPosts(res?.data?.posts))
                }
            } catch (error) {
                console.log(error)
            }
        }
        featchAllData()
    },[dispatch])
}

export default useGetAllPosts