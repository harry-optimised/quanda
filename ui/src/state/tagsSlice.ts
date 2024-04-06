import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Tag } from '../types';
import { RootState } from './store';

const defaultTags: Tag[] = [];

const initialState = defaultTags;

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
    removeTag: (state, action: PayloadAction<string>) => {
      return state.filter((tag) => tag.id !== action.payload);
    }
  }
});

export default tagSlice;
export const { setTags, addTag, removeTag } = tagSlice.actions;
export const selectTags = (state: RootState) => state.tags;
