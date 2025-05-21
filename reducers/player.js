import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    playerID: null,
    isAdmin: null,
    playerName: null,
    score: 0,
    scoreHistory: [],
  },
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    newPlayer: (state, action) => {
      state.value.playerID = action.payload.playerID;
      state.value.isAdmin = action.payload.isAdmin;
      state.value.playerName = action.payload.playerName;
    },
    resetPlayer: (state, action) => {
      state.value.playerID = null;
      state.value.isAdmin = null;
      state.value.playerName = null;
      state.value.score = 0;
      state.value.scoreHistory = [];
    },
  },
});

export const { newPlayer, resetPlayer } = playerSlice.actions;
export default playerSlice.reducer;
