import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ProfileState = {
  token: string | null;
};

const initialState: ProfileState = {
  token: null
};

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    }
  }
});

export const { setToken } = itemSlice.actions;
export default itemSlice;
