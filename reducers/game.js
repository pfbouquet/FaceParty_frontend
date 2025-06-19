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
    newGame: (state, action) => { // Initialise une nouvelle partie avec les infos de base
      state.value.gameID = action.payload.gameID;
      state.value.roomID = action.payload.roomID;
      state.value.nbRound = action.payload.nbRound;
    },
    updateGame: (state, action) => { // Met à jour tous les champs liés à la partie
      state.value.gameID = action.payload.gameID;
      state.value.roomID = action.payload.roomID;
      state.value.nbRound = action.payload.nbRound;
      state.value.players = action.payload.players;
      state.value.characters = action.payload.characters;
    },
    updatePlayers: (state, action) => { // Met à jour la liste des joueurs
      state.value.players = action.payload;
    },
    updateCharacters: (state, action) => { // Met à jour la liste des personnages
      state.value.characters = action.payload;
    },
    resetGame: (state) => { // Réinitialise tous les champs de l'état
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
