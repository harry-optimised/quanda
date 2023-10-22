import { configureStore } from '@reduxjs/toolkit';
import itemSlice from './itemSlice';

export const store = configureStore({
  reducer: {
    item: itemSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
