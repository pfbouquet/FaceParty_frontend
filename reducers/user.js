import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    email: null,
    picture: [],
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
  },
});

export const { updateEmail, addPitcure } = userSlice.actions;
export default userSlice.reducer;
