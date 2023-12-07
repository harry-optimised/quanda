import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Item } from '../types';

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
    setItem: (state, action: PayloadAction<ItemState>) => {
      state.item = action.payload.item;
    }
  }
});

export const { setItem } = itemSlice.actions;
export default itemSlice;
