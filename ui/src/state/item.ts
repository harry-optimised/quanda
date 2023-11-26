import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { Item } from '../types';
import { RootState } from './store';

const BASE_URL = 'http://localhost:8000/api/items';

type ItemAPIResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Item[];
};

type ItemState = {
  item: Item | null;
};

const initialState: ItemState = {
  item: null
};

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setItem: (state, action: PayloadAction<Item | null>) => {
      state.item = action.payload;
      fetch(`${BASE_URL}/${action.payload?.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(action.payload)
      });
    }
  }
});

export const { setItem } = itemSlice.actions;
export default itemSlice;
