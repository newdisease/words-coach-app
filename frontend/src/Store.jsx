import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./Reducers/AuthSlice";
import DictReducer from "./Reducers/DictSlice";

export const store = configureStore(
  {
    reducer: {
      user: UserReducer,
      dict: DictReducer,
    },
  },
  {
    devTools: process.env.NODE_ENV !== "production",
  }
);
