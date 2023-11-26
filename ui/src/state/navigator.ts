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

type RefreshItemsResponse = {
  items: Item[];
  resetItem: boolean;
};

type NavigatorState = {
  searchTerm: string;
  items: ReturnType<typeof itemsAdapter.getInitialState>;
};

export const refreshItems = createAsyncThunk(
  'navigator/refreshItems',
  async (resetItem: boolean, { getState }) => {
    const state = getState() as RootState;
    const response = await fetch(
      `${BASE_URL}/?search=${state.navigator.searchTerm}`
    );
    const data = (await response.json()) as ItemAPIResponse;
    return { items: data.results, resetItem };
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
    },
    removeItem: (state, action: PayloadAction<number>) => {
      itemsAdapter.removeOne(state.items, action.payload);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      refreshItems.fulfilled,
      (state, action: PayloadAction<RefreshItemsResponse>) => {
        const positionedItems = action.payload.items.map((item) => ({
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

export const { updateItem, updateSearchTerm, removeItem } =
  navigatorState.actions;
export default navigatorState;
