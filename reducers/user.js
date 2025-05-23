import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    email: null,
    picture: [],
    playerID: null, // ✅ Ajouté ici
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateEmail: (state, action) => {
      state.value.email = action.payload;
    },
    addPitcure: (state, action) => {
      state.value.picture.push(action.payload);
    },
    setPlayerID: (state, action) => {
      state.value.playerID = action.payload; // ✅ Nouvelle action
    },
  },
});

export const { updateEmail, addPitcure, setPlayerID } = userSlice.actions;
export default userSlice.reducer;