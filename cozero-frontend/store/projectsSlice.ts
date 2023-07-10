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

export const fetchProjects = createAsyncThunk<
    ListResponse<Project> | undefined,
    { page: number; searchTerm: string },
    { rejectValue: string }
>('fetchProjects', async ({ page, searchTerm }, { rejectWithValue }) => {
    try {
        return await ProjectsService.fetchProjects(page, searchTerm)
    } catch (e) {
        return rejectWithValue('Failed to fetch projects')
    }
})

export const createProject = createAsyncThunk<
    Project | undefined,
    CreateProjectDto,
    { rejectValue: string }
>('createProject', async (project, { rejectWithValue }) => {
    try {
        return await ProjectsService.createProject(project)
    } catch (e) {
        return rejectWithValue('Failed to create project')
    }
})

export const updateProject = createAsyncThunk<
    UpdateProjectResult | undefined,
    UpdateProjectDto,
    { rejectValue: string }
>('updateProject', async (project, { rejectWithValue }) => {
    try {
        return await ProjectsService.updateProject(project)
    } catch (e) {
        return rejectWithValue('Failed to update project')
    }
})

export const deleteProject = createAsyncThunk<
    DeleteProjectResult | undefined,
    string,
    { rejectValue: string }
>('deleteProject', async (id, { rejectWithValue }) => {
    try {
        return await ProjectsService.deleteProject(id)
    } catch (e) {
        return rejectWithValue('Failed to delete project')
    }
})

export interface ProjectsState {
    projects: ListResponse<Project> | undefined
    isLoading: boolean
    error?: string
}

const initialState: ProjectsState = {
    projects: undefined,
    isLoading: false,
    error: undefined,
}

export const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {},
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
                state.error = action.error.message || 'Something went wrong'
            })
            .addCase(createProject.fulfilled, (state, action) => {
                if (action.payload) {
                    state.projects?.data.unshift(action.payload)
                }
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                if (action.payload && state.projects) {
                    state.projects.data = state.projects.data.map((project) =>
                        project.id === action.meta.arg.id
                            ? (action.meta.arg as Project)
                            : project
                    )
                }
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                if (action.payload && state.projects) {
                    state.projects.data = state.projects?.data.filter(
                        (project) => project.id !== action.meta.arg
                    )
                }
            })
    },
})
export default projectsSlice.reducer
