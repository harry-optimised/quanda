import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Entry } from '../types';

type EntryState = {
  entry: Entry | null;
};

const initialState: EntryState = {
  entry: null
};

const entrySlice = createSlice({
  name: 'entries',
  initialState,
  reducers: {
    setEntry: (state, action: PayloadAction<EntryState>) => {
      state.entry = action.payload.entry;
    }
  }
});

export const { setEntry } = entrySlice.actions;
export default entrySlice;
