import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    isAuthenticated: false,
    user: {},
    token: "",
}

export const LoginReducer = createSlice({
    name: 'login',
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
        }
    }
},
)

export const {
    loginSetToken,
    loginSetUser,
    loginUnsetUser,
} = LoginReducer.actions

export default LoginReducer.reducer