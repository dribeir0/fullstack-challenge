import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AppDispatch, useAppDispatch, RootState } from '../../store/store'
import {
    fetchDeletedProjects,
    restoreProject,
} from '../../store/deletedProjectsSlice'
import ProjectsList from '../../components/projects/ProjectsList'

export default function DeletedProjectsList() {
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
        <ProjectsList
            projects={projects}
            error={error}
            isLoading={isLoading}
            isDeleted={true}
            fetchMore={fetchMore}
            onAction={onRestoreProject}
        />
    )
}
