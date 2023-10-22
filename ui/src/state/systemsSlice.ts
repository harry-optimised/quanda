import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { System } from '../types';

const defaultSystems: System[] = [];

const initialState = defaultSystems;

const BASE_URL = 'http://localhost:8000/api/systems';

export const fetchSystems = createAsyncThunk('system/fetch', async () => {
  const response = await fetch(`${BASE_URL}/`);
  return (await response.json()) as System[];
});

const systemSlice = createSlice({
  name: 'systems',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchSystems.fulfilled,
      (state, action: PayloadAction<System[]>) => {
        return action.payload;
      }
    );
  }
});

export default systemSlice;
