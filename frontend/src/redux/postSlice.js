import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name : "post",
    initialState : {
        allPost : [],
        selectedPost : null
    },
    reducers : {
        setAllPosts : (state , action)=>{
            state.allPost = action.payload
        },
        setSelectedPost : (state , action)=>{
            state.selectedPost = action.payload
        },
    }
})

export const {setAllPosts , setSelectedPost} = postSlice.actions
export default postSlice.reducer