import { configureStore } from '@reduxjs/toolkit';
import navigatorState from './navigator';
import systemSlice from './systemsSlice';
import tagSlice from './tagsSlice';
import item from './item';
import profile from './profile';

export const store = configureStore({
  reducer: {
    item: item.reducer,
    navigator: navigatorState.reducer,
    systems: systemSlice.reducer,
    tags: tagSlice.reducer,
    profile: profile.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectItem = (state: RootState) => state.item.item;
