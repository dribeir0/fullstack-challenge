import { ListResponse } from '../interfaces/list.interface'
import {
    CreateProjectDto,
    DeleteProjectResult,
    Project,
    UpdateProjectDto,
    UpdateProjectResult,
} from '../interfaces/project.interface'
import HTTPService from './HTTPService'
import LocalStorageService from './LocalStorageService'

class ProjectsService {
    public async fetchProjects(
        page: number,
        searchTerm: string = ''
    ): Promise<ListResponse<Project> | undefined> {
        try {
            const projects = await HTTPService.get<ListResponse<Project>>(
                `projects?page=${page}&searchTerm=${searchTerm}`
            )

            return projects
        } catch (e) {
            console.log('Error fetching projects', e)
            throw Error()
        }
    }

    public async fetchProjectById(id: string): Promise<Project | undefined> {
        try {
            return HTTPService.get<Project>(`projects/${id}`)
        } catch (e) {
            console.log('Error fetching project', e)
            throw Error()
        }
    }

    public async updateProject(
        updatedProject: UpdateProjectDto
    ): Promise<UpdateProjectResult | undefined> {
        try {
            const jwtToken = LocalStorageService.getJwtToken()
            return HTTPService.put(
                `projects/${updatedProject.id}`,
                updatedProject,
                jwtToken
            )
        } catch (e) {
            console.log('Error deleting project', e)
            throw Error()
        }
    }

    public async createProject(
        createProjectDto: CreateProjectDto
    ): Promise<Project | undefined> {
        try {
            const jwtToken = LocalStorageService.getJwtToken()
            return HTTPService.post<Project>(
                `projects/create`,
                createProjectDto,
                jwtToken
            )
        } catch (e) {
            console.log('Error creating project', e)
            throw Error()
        }
    }

    public async deleteProject(
        id: string
    ): Promise<DeleteProjectResult | undefined> {
        try {
            const jwtToken = LocalStorageService.getJwtToken()
            return HTTPService.delete(`projects/${id}`, jwtToken)
        } catch (e) {
            console.log('Error deleting project', e)
        }
    }

    public async restoreProject(
        id: string
    ): Promise<DeleteProjectResult | undefined> {
        try {
            const jwtToken = LocalStorageService.getJwtToken()
            return HTTPService.patch(`projects/${id}`, jwtToken)
        } catch (e) {
            console.log('Error deleting project', e)
        }
    }

    public async fetchDeletedProjects(
        page: number
    ): Promise<ListResponse<Project> | undefined> {
        try {
            const jwtToken = LocalStorageService.getJwtToken()
            return await HTTPService.get<ListResponse<Project>>(
                `projects/deleted?page=${page}`,
                jwtToken
            )
        } catch (e) {
            console.log('Error fetching deleted projects', e)
            throw Error()
        }
    }
}

export default new ProjectsService()
