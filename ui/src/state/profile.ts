import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ProfileState = {
  token: string | null;
  username: string | null;
};

const initialState: ProfileState = {
  token: null,
  username: null
};

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    }
  }
});

export const { setToken, setUsername } = itemSlice.actions;
export const selectToken = (state: { profile: ProfileState }) => state.profile.token;
export const selectUsername = (state: { profile: ProfileState }) => state.profile.username;
export default itemSlice;
