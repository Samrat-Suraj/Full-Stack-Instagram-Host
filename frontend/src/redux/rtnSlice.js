import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name : "realTimeNotication",
    initialState : {
        likeNotifaction : []
    },
    reducers : {
        setLikeNotifaction : (state , action)=>{
            if(action.payload.type === "like"){
                state.likeNotifaction.push(action.payload)
            }else if(action.payload.type === "Dislike"){
                state.likeNotifaction = state.likeNotifaction.filter((item => item.userId !== action.payload.userId))
            }
        }
    }
})

export const {setLikeNotifaction} = rtnSlice.actions
export default rtnSlice.reducer