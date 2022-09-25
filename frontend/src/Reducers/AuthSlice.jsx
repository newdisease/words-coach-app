import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const INC = "inc";
export const DEC = "dec";

const reHydrateState = () => {
  if (localStorage.getItem("authTokens") !== null) {
    axios.defaults.headers.common["Authorization"] =
      "Token " + localStorage.getItem("authTokens");
    return {
      isAuthenticated: true,
      token: localStorage.getItem("authTokens"),
      user: {},
    };
  }
  return {
    isAuthenticated: false,
    token: null,
    user: {},
  };
};

export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async () => {
    const response = await axios.get("/accounts/user/");
    return response.data;
  }
);

export const UserReducer = createSlice({
  name: "user",
  initialState: reHydrateState(),
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
      switch (action.payload) {
        case INC:
          state.user.words_in_progress += 1;
          break;
        case DEC:
          state.user.words_in_progress -= 1;
          break;
        default:
          break;
      }
    },
    changeCountOfWordsInDictionary: (state, action) => {
      switch (action.payload) {
        case INC:
          state.user.words_in_dictionary += 1;
          break;
        case DEC:
          state.user.words_in_dictionary -= 1;
          break;
        default:
          break;
      }
    },
    addWordsFromCollection: (state, action) => {
      state.user.words_in_dictionary += action.payload;
      state.user.words_in_progress += action.payload;
    },
    removeWordsFromCollectionInDict: (state, action) => {
      state.user.words_in_dictionary -= action.payload;
    },
    removeWordsFromCollectionInProgress: (state, action) => {
      state.user.words_in_progress -= action.payload;
    },
  },
  extraReducers: {
    [fetchUserInfo.fulfilled]: (state, action) => {
      state.user = action.payload;
    },
    [fetchUserInfo.rejected]: (state) => {
      state.token = "";
      state.isAuthenticated = false;
      state.user = {};
      localStorage.removeItem("authTokens");
    },
  },
});

export const {
  loginSetToken,
  loginSetUser,
  loginUnsetUser,
  changeCountOfWordsInProgress,
  changeCountOfWordsInDictionary,
  addWordsFromCollection,
  removeWordsFromCollectionInDict,
  removeWordsFromCollectionInProgress,
} = UserReducer.actions;

export default UserReducer.reducer;
