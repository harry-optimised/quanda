import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Item } from '../types';
import { RootState } from './store';

type NavigatorState = {
  searchTerm: string;
  items: ReturnType<typeof itemsAdapter.getInitialState>;
};

const itemsAdapter = createEntityAdapter<Item>({
  sortComparer: (a, b) => a.primary.localeCompare(b.primary)
});

const initialState: NavigatorState = {
  searchTerm: '',
  items: itemsAdapter.getInitialState()
};

const navigatorState = createSlice({
  name: 'navigator',
  initialState,
  reducers: {
    updateItem: (state, action: PayloadAction<Item>) => {
      itemsAdapter.updateOne(state.items, {
        id: action.payload.id,
        changes: action.payload
      });
    },
    updateSearchTerm: (state, action: PayloadAction<string>) => {
      console.log('updateSearchTerm');
      state.searchTerm = action.payload;
    },
    removeItem: (state, action: PayloadAction<number>) => {
      itemsAdapter.removeOne(state.items, action.payload);
    },
    setItems(state, action: PayloadAction<Item[]>) {
      itemsAdapter.setAll(state.items, action.payload);
    }
  }
});

export const { selectAll: selectAllItems } = itemsAdapter.getSelectors((state: RootState) => state.navigator.items);
export const selectSearchTerm = (state: RootState) => state.navigator.searchTerm;

export const { updateItem, updateSearchTerm, removeItem, setItems } = navigatorState.actions;
export default navigatorState;
