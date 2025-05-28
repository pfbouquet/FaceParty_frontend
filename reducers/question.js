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
    resetQuestion: (state) => {
      state.value.index = 0;
      state.value.goodAnswers = [""];
      state.value.possibleAnswers = [""];
      state.value.imageURL = "";
    },
  },
});

export const { newQuestion, resetQuestion } = questionSlice.actions;
export default questionSlice.reducer;
