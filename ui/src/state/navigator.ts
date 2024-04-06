import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Entry } from '../types';
import { RootState } from './store';

type NavigatorState = {
  searchTerm: string;
  entries: ReturnType<typeof entriesAdapter.getInitialState>;
};

const entriesAdapter = createEntityAdapter<Entry>({
  sortComparer: (a, b) => a.id.localeCompare(b.id)
});

const initialState: NavigatorState = {
  searchTerm: '',
  entries: entriesAdapter.getInitialState()
};

const navigatorState = createSlice({
  name: 'navigator',
  initialState,
  reducers: {
    updateEntry: (state, action: PayloadAction<Entry>) => {
      entriesAdapter.updateOne(state.entries, {
        id: action.payload.id,
        changes: action.payload
      });
    },
    updateSearchTerm: (state, action: PayloadAction<string>) => {
      console.log('updateSearchTerm');
      state.searchTerm = action.payload;
    },
    removeEntry: (state, action: PayloadAction<string>) => {
      entriesAdapter.removeOne(state.entries, action.payload);
    },
    setEntries(state, action: PayloadAction<Entry[]>) {
      entriesAdapter.setAll(state.entries, action.payload);
    }
  }
});

export const { selectAll: selectAllItems } = entriesAdapter.getSelectors((state: RootState) => state.navigator.entries);
export const selectSearchTerm = (state: RootState) => state.navigator.searchTerm;

export const { updateEntry, updateSearchTerm, removeEntry, setEntries } = navigatorState.actions;
export default navigatorState;
