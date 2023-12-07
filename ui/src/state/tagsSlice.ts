import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { Tag } from '../types';
import { RootState } from './store';

const defaultTags: Tag[] = [];

const initialState = defaultTags;

// export const fetchTags = createAsyncThunk(
//   'tags/fetch',
//   async (_, { getState }) => {
//     const state = getState() as RootState;

//     if (!state.profile.token) {
//       console.error('No token available');
//       return [];
//     }

//     const url = `${process.env.REACT_APP_API_BASE_URL}/tags/`;
//     const response = await fetch(`${url}`, {
//       headers: { Authorization: `Bearer ${state.profile.token}` }
//     });
//     return (await response.json()) as Tag[];
//   }
// );

const tagSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    setTags: (state, action: PayloadAction<Tag[]>) => {
      return action.payload;
    },
    addTag: (state, action: PayloadAction<Tag>) => {
      state.push(action.payload);
    },
    removeTag: (state, action: PayloadAction<number>) => {
      return state.filter((tag) => tag.id !== action.payload);
    }
  }
});

export default tagSlice;
export const { setTags, addTag, removeTag } = tagSlice.actions;
export const selectTags = (state: RootState) => state.tags;
