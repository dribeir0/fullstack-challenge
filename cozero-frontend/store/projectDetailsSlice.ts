import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Project } from '../interfaces/project.interface'
import ProjectsService from '../services/ProjectsService'
import { GenericError } from '../interfaces/generic-error.interface'
import { translate } from '../utils/language.utils'

export const fetchProjectById = createAsyncThunk<
    Project,
    string,
    { rejectValue: string }
>('fetchProjectById', async (id, { rejectWithValue }) => {
    try {
        const resp = await ProjectsService.fetchProjectById(id)
        if (!resp) {
            return rejectWithValue(translate('DEFAULT_ERROR'))
        }
        if ((resp as GenericError).statusCode) {
            return rejectWithValue((resp as GenericError).message)
        }
        return resp as Project
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
                state.error = action.payload
            })
    },
})
export default projectDetailsSlice.reducer
