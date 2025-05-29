import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    gameID: null,
    roomID: null,
    nbRound: 5,
    players: [],
    characters: [],
  },
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
    updateGame: (state, action) => {
      state.value.gameID = action.payload.gameID;
      state.value.roomID = action.payload.roomID;
      state.value.nbRound = action.payload.nbRound;
      state.value.players = action.payload.players;
      state.value.characters = action.payload.characters;
    },
    updatePlayers: (state, action) => {
      state.value.players = action.payload;
    },
    updateCharacters: (state, action) => {
      state.value.characters = action.payload;
    },
    resetGame: (state) => {
      state.value.gameID = null;
      state.value.roomID = null;
      state.value.nbRound = 5;
      state.value.players = [];
      state.value.characters = [];
    },
  },
});

export const {
  newGame,
  updatePlayers,
  updateCharacters,
  resetGame,
  updateGame,
} = gameSlice.actions;
export default gameSlice.reducer;
