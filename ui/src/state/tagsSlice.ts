import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { Tag } from '../types';

const defaultTags: Tag[] = [];

const initialState = defaultTags;

const BASE_URL = 'http://localhost:8000/api/tags';

export const fetchTags = createAsyncThunk('tags/fetch', async () => {
  const response = await fetch(`${BASE_URL}/`);
  return (await response.json()) as Tag[];
});

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
