import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { Tag } from '../types';
import { RootState } from './store';

const defaultTags: Tag[] = [];

const initialState = defaultTags;

const BASE_URL = 'https://api.quanda.ai/api/tags';

export const fetchTags = createAsyncThunk(
  'tags/fetch',
  async (_, { getState }) => {
    const state = getState() as RootState;

    if (!state.profile.token) {
      console.error('No token available');
      return [];
    }

    const response = await fetch(`${BASE_URL}/`, {
      headers: { Authorization: `Bearer ${state.profile.token}` }
    });
    return (await response.json()) as Tag[];
  }
);

const tagSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchTags.fulfilled,
      (state, action: PayloadAction<Tag[]>) => {
        return action.payload;
      }
    );
  }
});

export default tagSlice;
