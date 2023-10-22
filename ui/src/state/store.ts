import { configureStore } from '@reduxjs/toolkit';
import itemSlice from './itemSlice';
import systemSlice from './systemsSlice';
import tagSlice from './tagsSlice';

export const store = configureStore({
  reducer: {
    item: itemSlice.reducer,
    systems: systemSlice.reducer,
    tags: tagSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
