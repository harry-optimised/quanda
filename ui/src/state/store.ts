import { configureStore } from '@reduxjs/toolkit';
import navigatorState from './navigator';
import tagSlice from './tagsSlice';
import item from './item';
import profile from './profile';
import projects from './projects';

export const store = configureStore({
  reducer: {
    item: item.reducer,
    navigator: navigatorState.reducer,
    tags: tagSlice.reducer,
    profile: profile.reducer,
    projects: projects.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectItem = (state: RootState) => state.item.item;
