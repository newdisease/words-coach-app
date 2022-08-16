import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    isAuthenticated: false,
    user: {},
    token: "",
}

export const UserReducer = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSetToken: (state, action) => {
            state.token = action.payload;
            state.isAuthenticated = true;
        },
        loginSetUser: (state, action) => {
            state.user = action.payload;
        },
        loginUnsetUser: (state) => {
            state.isAuthenticated = false;
            state.user = {};
            state.token = "";
        },
        changeCountOfWordsInProgress: (state, action) => {
            state.user.words_in_progress = action.payload;
        }
    },
})

export const {
    loginSetToken,
    loginSetUser,
    loginUnsetUser,
    changeCountOfWordsInProgress
} = UserReducer.actions

export default UserReducer.reducer