import { createSlice } from "@reduxjs/toolkit";

export const DictReducer = createSlice({
  name: "dict",
  initialState: { addedWords: [], wordsFromAddedCollections: [] },
  reducers: {
    dictSetWord: (state, action) => {
      state.addedWords.push(action.payload);
    },
    dictUnsetWord: (state, action) => {
      state.addedWords = state.addedWords.filter(
        (item) => item.id !== action.payload
      );
    },
    dictResetWords: (state) => {
      state.addedWords = [];
    },
    dictSetWordsFromCollection: (state, action) => {
      state.wordsFromAddedCollections.push(action.payload);
    },
    dictUnsetWordFromCollection: (state, action) => {
      state.wordsFromAddedCollections = state.wordsFromAddedCollections.filter(
        (collection) => collection.set_of_words !== action.payload
      );
    },
  },
});

export const {
  dictSetWord,
  dictUnsetWord,
  dictResetWords,
  dictSetWordsFromCollection,
  dictUnsetWordFromCollection,
} = DictReducer.actions;

export default DictReducer.reducer;
