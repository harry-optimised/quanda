import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { Tag, Project } from '../types';
import { RootState } from './store';

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
}

const initialState: ProjectsState = {
  projects: [],
  currentProject: null
};

const projects = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<Project[]>) {
      state.projects = action.payload;
    },
    setCurrentProject(state, action: PayloadAction<Project>) {
      state.currentProject = action.payload;
    }
  }
});

export default projects;
export const { setProjects, setCurrentProject } = projects.actions;
export const selectProjects = (state: RootState) => state.projects.projects;
export const selectCurrentProject = (state: RootState) =>
  state.projects.currentProject;
