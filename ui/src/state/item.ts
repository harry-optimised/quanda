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

interface SetItemPayload {
  item: Item | null;
  updateBackend: boolean;
}

const initialState: ItemState = {
  item: null
};

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setItem: (state, action: PayloadAction<SetItemPayload>) => {
      const { item, updateBackend } = action.payload;
      state.item = item;
      if (updateBackend) {
        fetch(`${BASE_URL}/${item?.id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(item)
        });
      }
    }
  }
});

export const { setItem } = itemSlice.actions;
export default itemSlice;
