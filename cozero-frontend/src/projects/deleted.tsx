import { Heading, Stack } from '@chakra-ui/react'
import AuthenticatedView from '../../layouts/AuthenticatedView'
import { translate } from '../../utils/language.utils'
import { useSelector } from 'react-redux'
import { AppDispatch, useAppDispatch, RootState } from '../../store/store'
import {
    fetchDeletedProjects,
    restoreProject,
} from '../../store/deletedProjectsSlice'
import { useEffect } from 'react'
import ProjectsList from '../../components/projects/ProjectsList'

const DeletedProjectsPage = () => {
    const dispatch: AppDispatch = useAppDispatch()

    const projects = useSelector(
        (state: RootState) => state.deletedProjectsState.projects
    )
    const isLoading = useSelector(
        (state: RootState) => state.deletedProjectsState.isLoading
    )
    const error = useSelector(
        (state: RootState) => state.deletedProjectsState.error
    )
    const page = useSelector(
        (state: RootState) => state.deletedProjectsState.projects?.page
    )

    useEffect(() => {
        if (!projects) {
            dispatch(fetchDeletedProjects(1))
        }
    }, [projects])

    const fetchMore = () => {
        dispatch(fetchDeletedProjects(+(page ?? 0) + 1))
    }

    const onRestoreProject = (id: string) => {
        dispatch(restoreProject(id))
    }

    return (
        <AuthenticatedView>
            <Stack spacing={8}>
                <Heading>{translate('DELETED_PROJECTS')}</Heading>
                <ProjectsList
                    projects={projects}
                    error={error}
                    isLoading={isLoading}
                    isDeleted={true}
                    fetchMore={fetchMore}
                    onAction={onRestoreProject}
                />
            </Stack>
        </AuthenticatedView>
    )
}

export default DeletedProjectsPage
