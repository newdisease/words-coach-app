import { configureStore } from '@reduxjs/toolkit'
import UserReducer from './Components/Auth/AuthSlice';


export const store = configureStore(
    {
        reducer: {
            user: UserReducer
        }
    },
    {
        devTools: process.env.NODE_ENV !== 'production'
    }
);
