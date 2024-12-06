import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import Notification from './pages/Notification'
import MessagePage from './pages/MessagePage'
import LoginSignUpPage from './pages/LoginSignUpPage'
import EditProfilePage from './pages/EditProfilePage'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotifaction } from './redux/rtnSlice'
import ProtectRoute from './components/component/ProtectRoute'


const App = () => {
  const dispatch = useDispatch()
  const { socket } = useSelector(store => store.socketio)
  const { user } = useSelector(store => store.auth)

  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:5000", {
        query: {
          userId: user?._id
        },
        transports: ["websocket"]
      })
      dispatch(setSocket(socketio))

      socketio.on('getOnlineUsers', (onlineUser) => {
        dispatch(setOnlineUsers(onlineUser))
      })

      socketio.on('notifation', (notifation) => {
        dispatch(setLikeNotifaction(notifation))
      })


      return () => {
        socketio.close();
        dispatch(setSocket(null))
      }

    } else if (socket) {
      socket.close()
      dispatch(setSocket(null))
    }
  }, [user, dispatch])

  return (
    <div>
      <Routes>
        <Route path='/' element= {<ProtectRoute><HomePage /></ProtectRoute>}></Route>
        {/* <Route path='/notification' element={<Notification />}></Route> */}
        <Route path='/message' element={ <ProtectRoute><MessagePage /></ProtectRoute> }></Route>
        <Route path='/auth' element={<ProtectRoute><LoginSignUpPage /></ProtectRoute>}></Route>
        <Route path='/profile/:id' element={<ProtectRoute><ProfilePage /></ProtectRoute>}></Route>
        <Route path='/profile/edit' element={<ProtectRoute><EditProfilePage /></ProtectRoute>}></Route>s
      </Routes>
    </div>
  )
}

export default App