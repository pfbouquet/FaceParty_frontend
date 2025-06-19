import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    playerID: null,
    isAdmin: null,
    playerName: null,
    score: 0,
    scoreHistory: [],
    portraitFilePath: null,
  },
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    newPlayer: (state, action) => { // Initialise un nouveau joueur
      state.value.playerID = action.payload.playerID;
      state.value.isAdmin = action.payload.isAdmin;
      state.value.playerName = action.payload.playerName;
    },
    resetPlayer: (state, action) => { // Réinitialise toutes les infos du joueur
      state.value.playerID = null;
      state.value.isAdmin = null;
      state.value.playerName = null;
      state.value.score = 0;
      state.value.scoreHistory = [];
      state.value.portraitFilePath = null;
    },
    updatePortrait: (state, action) => { // Met à jour le portrait du joueur
      state.value.portraitFilePath = action.payload;
    },
    updatePlayerName: (state, action) => { // Met à jour le nom du joueur
      state.value.playerName = action.payload;
    },
  },
});

export const { newPlayer, resetPlayer, updatePortrait, updatePlayerName } =
  playerSlice.actions;
export default playerSlice.reducer;
