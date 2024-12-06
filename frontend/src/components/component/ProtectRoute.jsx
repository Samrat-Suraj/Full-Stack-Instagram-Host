import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ProtectRoute = ({ children }) => {
    const navigate = useNavigate()
    const { user } = useSelector(store => store.auth)
    useEffect(() => {
        if (!user) {
            navigate("/auth")
        }else if(user){
            navigate("/")
        }
    },[])

    return <>{children}</>
}

export default ProtectRoute