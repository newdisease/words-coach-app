import { configureStore } from '@reduxjs/toolkit'
import axios from 'axios';
import UserReducer from './Components/Auth/AuthSlice';

const reHydrateStore = () => {
    if (localStorage.getItem("authTokens") !== null && localStorage.getItem("user") !== null) {
        axios.defaults.headers.common["Authorization"] = "Token " + localStorage.getItem("authTokens");
        return {
            user: {
                isAuthenticated: true,
                user: JSON.parse(localStorage.getItem("user")),
                token: localStorage.getItem("authTokens")
            }
        }
    }
};

export const store = configureStore(
    {
        reducer: {
            user: UserReducer,

        },
        preloadedState: reHydrateStore(),
    },
    {
        devTools: process.env.NODE_ENV !== 'production'
    }
);
