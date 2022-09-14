import { createSlice } from "@reduxjs/toolkit";

export const DictReducer = createSlice({
  name: "dict",
  initialState: { addedWords: [] },
  reducers: {
    dictSetWord: (state, action) => {
      state.addedWords.push(action.payload);
    },
    dictUnsetWord: (state, action) => {
      state.addedWords = state.addedWords.filter(
        (item) => item.id !== action.payload
      );
    },
  },
});

export const { dictSetWord, dictUnsetWord } = DictReducer.actions;

export default DictReducer.reducer;
