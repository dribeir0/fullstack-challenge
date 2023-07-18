import {
    CreateProjectDto,
    ProjectForm,
    UpdateProjectDto,
} from '../interfaces/project.interface'
import { translate } from './language.utils'

export const getProjectResponseTranslation = (
    isSuccess: boolean,
    isUpdate: boolean
) => {
    if (isSuccess) {
        return {
            title: translate(isUpdate ? 'PROJECT_UPDATED' : 'PROJECT_CREATED'),
            description: translate(
                isUpdate
                    ? 'PROJECT_UPDATED_DESCRIPTION'
                    : 'PROJECT_CREATED_DESCRIPTION'
            ),
        }
    }

    return {
        title: translate(
            isUpdate ? 'PROJECT_UPDATED_ERROR' : 'PROJECT_CREATED_ERROR'
        ),
        description: translate(
            isUpdate
                ? 'PROJECT_UPDATED_ERROR_DESCRIPTION'
                : 'PROJECT_CREATED_ERROR_DESCRIPTION'
        ),
    }
}

export const projectFormToProjectDTO = (
    project: ProjectForm,
    userEmail: string
): CreateProjectDto | UpdateProjectDto => ({
    ...project,
    listing: project.listing.map((item) => item.name),
    co2EstimateReduction: [
        project.co2EstimateReduction.min,
        project.co2EstimateReduction.max,
    ],
    owner: userEmail,
})

export const deleteProjectResponseTranslation = (
    isSuccess: boolean,
    isDelete: boolean
) => {
    if (isSuccess) {
        return {
            title: translate(isDelete ? 'PROJECT_RESTORED' : 'PROJECT_DELETED'),
            description: translate(
                isDelete
                    ? 'PROJECT_RESTORED_DESCRIPTION'
                    : 'PROJECT_DELETED_DESCRIPTION'
            ),
        }
    }

    return {
        title: translate(
            isDelete ? 'PROJECTED_RESTORED_ERROR' : 'PROJECTED_DELETE_ERROR'
        ),
        description: translate(
            isDelete
                ? 'PROJECT_RESTORED_ERROR_DESCRIPTION'
                : 'PROJECT_DELETE_ERROR_DESCRIPTION'
        ),
    }
}
