import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        suggestedUser: [],
        getUserProfile : null,
        selectedUser : null,
        allUser : []
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setSuggestedUser: (state, action) => {
            state.suggestedUser = action.payload
        },
        setGetUserProfile: (state, action) => {
            state.getUserProfile = action.payload
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
        },
        setAllUser: (state, action) => {
            state.allUser = action.payload
        }
    }
})

export const { setUser, setSuggestedUser ,setAllUser, setGetUserProfile ,setSelectedUser } = authSlice.actions
export default authSlice.reducer