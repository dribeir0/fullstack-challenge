import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Project, RestoreProjectResult } from '../interfaces/project.interface'
import ProjectsService from '../services/ProjectsService'
import { ListResponse } from '../interfaces/list.interface'
import { GenericError } from '../interfaces/generic-error.interface'
import { translate } from '../utils/language.utils'

export const fetchDeletedProjects = createAsyncThunk<
    ListResponse<Project> | undefined,
    number,
    { rejectValue: string }
>('fetchDeletedProjects', async (page, { rejectWithValue }) => {
    try {
        const resp = await ProjectsService.fetchDeletedProjects(page)
        if (!resp) {
            return rejectWithValue(translate('DEFAULT_ERROR'))
        }
        if ((resp as GenericError).statusCode) {
            return rejectWithValue((resp as GenericError).message)
        }
        return resp as ListResponse<Project>
    } catch (e) {
        return rejectWithValue('Failed to fetch projects')
    }
})

export const restoreProject = createAsyncThunk<
    RestoreProjectResult,
    string,
    { rejectValue: string }
>('restoreProject', async (id, { rejectWithValue }) => {
    try {
        const resp = await ProjectsService.restoreProject(id)
        if (!resp) {
            return rejectWithValue(translate('DEFAULT_ERROR'))
        }
        if ((resp as GenericError).statusCode) {
            return rejectWithValue((resp as GenericError).message)
        }
        return resp as RestoreProjectResult
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
