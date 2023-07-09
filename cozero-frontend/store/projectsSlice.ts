import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Project } from "../interfaces/project.interface";
import ProjectsService from "../services/ProjectsService";

export const fetchProjects = createAsyncThunk<Project[], void, {rejectValue: string}>(
  'fetchProjects',
  async (_, thunkAPI) => {
    try {
      return await ProjectsService.fetchProjects()
    } catch(e) {
      return thunkAPI.rejectWithValue('Failed to fetch projects')
    }
  }
)


export interface ProjectsState {
  data: Project[];
  isLoading: boolean;
  error?: string;
}

const initialState: ProjectsState = {
  data: [],
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
        state.data = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Something went wrong';
      })
  }
})
export default projectsSlice.reducer