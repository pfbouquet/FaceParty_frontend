import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    index: 0,
    goodAnswers: [""],
    possibleAnswers: [""],
    imageURL: "",
  },
};

export const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    newQuestion: (state, action) => {
      state.value.index = action.payload.index;
      state.value.goodAnswers = action.payload.goodAnswers;
      state.value.possibleAnswers = action.payload.possibleAnswers;
      state.value.imageURL = action.payload.imageURL;
    },
  },
});

export const { newQuestion } = questionSlice.actions;
export default questionSlice.reducer;
