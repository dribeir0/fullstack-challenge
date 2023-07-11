import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    CreateProjectDto,
    DeleteProjectResult,
    Project,
    UpdateProjectDto,
    UpdateProjectResult,
} from '../interfaces/project.interface'
import ProjectsService from '../services/ProjectsService'
import { ListResponse } from '../interfaces/list.interface'
import { GenericError } from '../interfaces/generic-error.interface'
import { translate } from '../utils/language.utils'

export const fetchProjects = createAsyncThunk<
    ListResponse<Project>,
    { page: number; searchTerm: string },
    { rejectValue: string }
>('fetchProjects', async ({ page, searchTerm }, { rejectWithValue }) => {
    try {
        const resp = await ProjectsService.fetchProjects(page, searchTerm)
        if (!resp) {
            return rejectWithValue(translate('DEFAULT_ERROR'))
        }
        if ((resp as GenericError).statusCode) {
            return rejectWithValue((resp as GenericError).message)
        }
        return resp as ListResponse<Project>
    } catch (e) {
        return rejectWithValue(translate('DEFAULT_ERROR'))
    }
})

export const createProject = createAsyncThunk<
    Project,
    CreateProjectDto,
    { rejectValue: string }
>('createProject', async (project, { rejectWithValue }) => {
    try {
        const resp = await ProjectsService.createProject(project)
        if (!resp) {
            return rejectWithValue(translate('DEFAULT_ERROR'))
        }
        if ((resp as GenericError).statusCode) {
            return rejectWithValue((resp as GenericError).message)
        }
        return resp as Project
    } catch (e) {
        return rejectWithValue(translate('DEFAULT_ERROR'))
    }
})

export const updateProject = createAsyncThunk<
    UpdateProjectResult,
    UpdateProjectDto,
    { rejectValue: string }
>('updateProject', async (project, { rejectWithValue }) => {
    try {
        const resp = await ProjectsService.updateProject(project)
        if (!resp) {
            return rejectWithValue(translate('DEFAULT_ERROR'))
        }
        if ((resp as GenericError).statusCode) {
            return rejectWithValue((resp as GenericError).message)
        }
        return resp as UpdateProjectResult
    } catch (e) {
        return rejectWithValue(translate('DEFAULT_ERROR'))
    }
})

export const deleteProject = createAsyncThunk<
    DeleteProjectResult,
    string,
    { rejectValue: string }
>('deleteProject', async (id, { rejectWithValue }) => {
    try {
        const resp = await ProjectsService.deleteProject(id)
        if (!resp) {
            return rejectWithValue(translate('DEFAULT_ERROR'))
        }
        if ((resp as GenericError).statusCode) {
            return rejectWithValue((resp as GenericError).message)
        }
        return resp as DeleteProjectResult
    } catch (e: any) {
        return rejectWithValue(translate('DEFAULT_ERROR'))
    }
})

export interface ProjectsState {
    projects: ListResponse<Project> | undefined
    searchTerm: string
    isLoading: boolean
    error?: string
}

const initialState: ProjectsState = {
    projects: undefined,
    searchTerm: '',
    isLoading: false,
    error: undefined,
}

export const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        search: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.isLoading = true
                state.error = undefined
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
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
            .addCase(fetchProjects.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(createProject.pending, (state) => {
                state.isLoading = true
                state.error = undefined
            })
            .addCase(createProject.fulfilled, (state, action) => {
                if (action.payload) {
                    state.projects?.data.unshift(action.payload)
                }
                state.isLoading = false
            })
            .addCase(createProject.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(updateProject.pending, (state) => {
                state.isLoading = true
                state.error = undefined
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                if (action.payload && state.projects) {
                    state.projects.data = state.projects.data.map((project) =>
                        project.id === action.meta.arg.id
                            ? (action.meta.arg as Project)
                            : project
                    )
                }
                state.isLoading = false
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(deleteProject.pending, (state) => {
                state.isLoading = true
                state.error = undefined
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                if (action.payload && state.projects) {
                    state.projects.data = state.projects?.data.filter(
                        (project) => project.id !== action.meta.arg
                    )
                }
                state.isLoading = false
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    },
})

export const { search } = projectsSlice.actions

export default projectsSlice.reducer
