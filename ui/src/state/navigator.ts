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

type NavigatorState = {
  searchTerm: string;
  items: ReturnType<typeof itemsAdapter.getInitialState>;
};

export const refreshItems = createAsyncThunk(
  'navigator/refreshItems',
  async (_, { getState }) => {
    const state = getState() as RootState;
    console.log(state.navigator);
    const response = await fetch(
      `${BASE_URL}/?search=${state.navigator.searchTerm}`
    );
    return (await response.json()) as ItemAPIResponse;
  }
);

const itemsAdapter = createEntityAdapter<Item>({
  sortComparer: (a, b) => a.primary.localeCompare(b.primary)
});

const initialState: NavigatorState = {
  searchTerm: '',
  items: itemsAdapter.getInitialState()
};

// Nagivator Slice
//---------------

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

        itemsAdapter.setAll(state.items, positionedItems);
      }
    );
  }
});

export const { selectAll: selectAllItems } = itemsAdapter.getSelectors(
  (state: RootState) => state.navigator.items
);
export const selectSearchTerm = (state: RootState) =>
  state.navigator.searchTerm;

export const { updateItem, updateSearchTerm } = navigatorState.actions;
export default navigatorState;
