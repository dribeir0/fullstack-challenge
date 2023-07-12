import { GenericError } from '../interfaces/generic-error.interface'
import { ListResponse } from '../interfaces/list.interface'
import {
    CreateProjectDto,
    DeleteProjectResult,
    Project,
    RestoreProjectResult,
    UpdateProjectDto,
    UpdateProjectResult,
} from '../interfaces/project.interface'
import HTTPService from './HTTPService'
import LocalStorageService from './LocalStorageService'

class ProjectsService {
    public async fetchProjects(
        page: number,
        searchTerm: string = ''
    ): Promise<ListResponse<Project> | GenericError | undefined> {
        try {
            return await HTTPService.get(
                `projects?page=${page}&searchTerm=${searchTerm}`
            )
        } catch (e) {
            console.log('Error fetching projects', e)
        }
    }

    public async fetchProjectById(
        id: string
    ): Promise<Project | GenericError | undefined> {
        try {
            return HTTPService.get(`projects/${id}`)
        } catch (e) {
            console.log('Error fetching project', e)
        }
    }

    public async updateProject(
        updatedProject: UpdateProjectDto
    ): Promise<UpdateProjectResult | GenericError | undefined> {
        try {
            const jwtToken = LocalStorageService.getJwtToken()
            return HTTPService.put(
                `projects/${updatedProject.id}`,
                updatedProject,
                jwtToken
            )
        } catch (e) {
            console.log('Error updating project', e)
        }
    }

    public async createProject(
        createProjectDto: CreateProjectDto
    ): Promise<Project | GenericError | undefined> {
        try {
            const jwtToken = LocalStorageService.getJwtToken()
            return HTTPService.post(
                `projects/create`,
                createProjectDto,
                jwtToken
            )
        } catch (e) {
            console.log('Error creating project', e)
        }
    }

    public async deleteProject(
        id: string
    ): Promise<DeleteProjectResult | GenericError | undefined> {
        try {
            const jwtToken = LocalStorageService.getJwtToken()
            return HTTPService.delete(`projects/${id}`, jwtToken)
        } catch (e) {
            console.log('Error deleting project', e)
        }
    }

    public async restoreProject(
        id: string
    ): Promise<RestoreProjectResult | GenericError | undefined> {
        try {
            const jwtToken = LocalStorageService.getJwtToken()
            return HTTPService.patch(`projects/${id}`, jwtToken)
        } catch (e) {
            console.log('Error restoring project', e)
        }
    }

    public async fetchDeletedProjects(
        page: number
    ): Promise<ListResponse<Project> | GenericError | undefined> {
        try {
            const jwtToken = LocalStorageService.getJwtToken()
            return await HTTPService.get(
                `projects/deleted?page=${page}`,
                jwtToken
            )
        } catch (e) {
            console.log('Error fetching deleted projects', e)
        }
    }
}

export default new ProjectsService()
