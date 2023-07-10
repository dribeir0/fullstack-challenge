import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    CreateProjectDto,
    DeleteProjectResult,
    Project,
    UpdateProjectDto,
    UpdateProjectResult,
} from '../interfaces/project.interface'
import ProjectsService from '../services/ProjectsService'
import { ListResponse } from '../interfaces/list.interface'

export const fetchDeletedProjects = createAsyncThunk<
    ListResponse<Project> | undefined,
    number,
    { rejectValue: string }
>('fetchDeletedProjects', async (page, { rejectWithValue }) => {
    try {
        return await ProjectsService.fetchDeletedProjects(page)
    } catch (e) {
        return rejectWithValue('Failed to fetch projects')
    }
})

export const restoreProject = createAsyncThunk<
    UpdateProjectResult | undefined, // FIXME: correct type
    string,
    { rejectValue: string }
>('restoreProject', async (id, { rejectWithValue }) => {
    try {
        return await ProjectsService.restoreProject(id)
    } catch (e) {
        return rejectWithValue('Failed to delete project')
    }
})

export interface DeletedProjectsState {
    projects: ListResponse<Project> | undefined
    isLoading: boolean
    error?: string
}

const initialState: DeletedProjectsState = {
    projects: undefined,
    isLoading: false,
    error: undefined,
}

export const deletedProjectsSlice = createSlice({
    name: 'deletedProjects',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeletedProjects.pending, (state) => {
                state.isLoading = true
                state.error = undefined
            })
            .addCase(fetchDeletedProjects.fulfilled, (state, action) => {
                state.isLoading = false
                if (action.payload) {
                    const { data, page, perPage, totalItems, totalPages } =
                        action.payload
                    state.projects = {
                        data:
                            +page === 1
                                ? data
                                : state.projects
                                ? state.projects.data.concat(data)
                                : data,
                        page,
                        perPage,
                        totalItems,
                        totalPages,
                    }
                }
            })
            .addCase(fetchDeletedProjects.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message || 'Something went wrong'
            })
            .addCase(restoreProject.fulfilled, (state, action) => {
                if (action.payload && state.projects) {
                    state.projects.data = state.projects?.data.filter(
                        (project) => project.id !== action.meta.arg
                    )
                }
            })
    },
})
export default deletedProjectsSlice.reducer
