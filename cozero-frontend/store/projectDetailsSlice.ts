import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Project } from '../interfaces/project.interface'
import ProjectsService from '../services/ProjectsService'

export const fetchProjectById = createAsyncThunk<
    Project | undefined,
    string,
    { rejectValue: string }
>('fetchProjectById', async (id, { rejectWithValue }) => {
    try {
        return await ProjectsService.fetchProjectById(id)
    } catch (e) {
        return rejectWithValue('Failed to fetch projects')
    }
})

export interface ProjectDetailsState {
    projectDetails: Project | undefined
    isLoading: boolean
    error?: string
}

const initialState: ProjectDetailsState = {
    projectDetails: undefined,
    isLoading: false,
    error: undefined,
}

export const projectDetailsSlice = createSlice({
    name: 'projectDetails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjectById.pending, (state) => {
                state.isLoading = true
                state.error = undefined
            })
            .addCase(fetchProjectById.fulfilled, (state, action) => {
                state.isLoading = false
                state.projectDetails = action.payload
            })
            .addCase(fetchProjectById.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message || 'Something went wrong'
            })
    },
})
export default projectDetailsSlice.reducer
