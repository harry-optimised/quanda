import { configureStore } from '@reduxjs/toolkit';
import itemSlice from './itemSlice';
import systemSlice from './systemsSlice';
import tagSlice from './tagsSlice';

export const store = configureStore({
  reducer: {
    items: itemSlice.reducer,
    systems: systemSlice.reducer,
    tags: tagSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Selectors
import { itemsAdapter } from './itemSlice';

export const { selectAll: selectAllItems } = itemsAdapter.getSelectors(
  (state: RootState) => state.items
);

export const selectActiveItem = (state: RootState) => state.items.active;
