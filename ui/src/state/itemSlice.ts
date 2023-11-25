import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
  PayloadAction
} from '@reduxjs/toolkit';

import { Item } from '../types';
import { RootState } from './store';

const BASE_URL = 'http://localhost:8000/api/items';

type ItemAPIResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Item[];
};

export const refreshItems = createAsyncThunk('item/fetch', async () => {
  const response = await fetch(`${BASE_URL}/`);
  return (await response.json()) as ItemAPIResponse;
});

export const itemsAdapter = createEntityAdapter<Item>({
  sortComparer: (a, b) => a.primary.localeCompare(b.primary)
});

const itemSlice = createSlice({
  name: 'items',
  initialState: {
    ...itemsAdapter.getInitialState(),
    active: null as number | null
  },
  reducers: {
    updateItem: itemsAdapter.updateOne,
    createItem: itemsAdapter.addOne,
    setActiveItem: (state, action: PayloadAction<number>) => {
      state.active = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      refreshItems.fulfilled,
      (state, action: PayloadAction<ItemAPIResponse>) => {
        const positionedItems = action.payload.results.map((item) => ({
          ...item,
          position: { x: Math.random() * 1000, y: Math.random() * 500 }
        }));

        itemsAdapter.setAll(state, positionedItems);
        if (positionedItems.length > 0) {
          state.active = positionedItems[8].id;
        }
      }
    );
  }
});

export const { updateItem, createItem, setActiveItem } = itemSlice.actions;
export default itemSlice;
