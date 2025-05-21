import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { gameID: null, roomID: null, nbRound: 10, players: [] },
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    newGame: (state, action) => {
      state.value.gameID = action.payload.gameID;
      state.value.roomID = action.payload.roomID;
      state.value.nbRound = action.payload.nbRound;
    },
    updatePlayers: (state, action) => {
      state.value.players = action.payload.players;
    },
    resetGame: (state) => {
      state.value.gameID = null;
      state.value.roomID = null;
      state.value.nbRound = 10;
      state.value.players = [];
    },
  },
});

export const { newGame, updatePlayers, resetGame } = gameSlice.actions;
export default gameSlice.reducer;
