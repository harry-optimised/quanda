import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { Item } from '../types';

const defaultItem: Item = {
  id: -1,
  name: 'Default',
  description: 'Default Description'
};

const initialState = {
  item: { ...defaultItem }
};

const BASE_URL = 'http://localhost:8000/api/items';

export const fetchItem = createAsyncThunk('item/fetch', async (id: number) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  return (await response.json()) as Item;
});

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    updateItem(state, action: PayloadAction<Item>) {
      state.item = action.payload;
      fetch(`https://api.example.com/items/${action.payload.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(action.payload)
      });
    },
    createItem(state, action: PayloadAction<Omit<Item, 'id'>>) {
      state.item = { ...action.payload, id: -1 };
      fetch(`https://api.example.com/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(action.payload)
      });
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchItem.fulfilled,
      (state, action: PayloadAction<Item>) => {
        state.item = action.payload;
      }
    );
  }
});

export default itemSlice;

export const useFetchItem = () => {
  const dispatch = useDispatch<AppDispatch>();
  return (id: number) => dispatch(fetchItem(id));
};

export const useUpdateItem = () => {
  const dispatch = useDispatch();
  return (item: Item) => dispatch(itemSlice.actions.updateItem(item));
};

export const useCreateItem = () => {
  const dispatch = useDispatch();
  return (item: Omit<Item, 'id'>) =>
    dispatch(itemSlice.actions.createItem(item));
};
