import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Project } from "../interfaces/project.interface";
import ProjectsService from "../services/ProjectsService";
import { ListResponse } from "../interfaces/list.interface";

export const fetchProjects = createAsyncThunk<ListResponse<Project> | undefined, number, {rejectValue: string}>(
  'fetchProjects',
  async (page, {rejectWithValue}) => {
    try {
      return await ProjectsService.fetchProjects(page)
    } catch(e) {
      return rejectWithValue('Failed to fetch projects')
    }
  }
)


export interface ProjectsState {
  projects: ListResponse<Project> | undefined;
  isLoading: boolean;
  error?: string;
}

const initialState: ProjectsState = {
  projects: undefined,
  isLoading: false,
  error: undefined
}

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        if(action.payload) {
          const { data, page, perPage, totalItems, totalPages } = action.payload;
          state.projects = {
            data: state.projects ? state.projects.data.concat(data) : data,
            page,
            perPage,
            totalItems,
            totalPages
          }
        }
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Something went wrong';
      })
  }
})
export default projectsSlice.reducer