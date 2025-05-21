import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    playerID: null,
    isAdmin: null,
    playerName: null,
    score: 0,
    scoreHistory: [],
  }, // Valeur initiale du reducer
};

export const playerSlice = createSlice({
  name: "player", // Nom du reducer à exporter
  initialState,
  // Fonctions à importer dans les composants pour agir sur le reducer
  reducers: {
    initPlayer: (state, action) => {
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

export const { initPlayer, resetPlayer } = playerSlice.actions;
export default playerSlice.reducer;
