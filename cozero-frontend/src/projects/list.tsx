import { Input, Stack } from '@chakra-ui/react'
import ProjectsList from '../../components/projects/ProjectsList'
import { useSelector } from 'react-redux'
import { AppDispatch, useAppDispatch, RootState } from '../../store/store'
import { useEffect, useState } from 'react'
import { deleteProject, fetchProjects } from '../../store/projectsSlice'
import { DebounceInput } from 'react-debounce-input'

const ProjectListPage = () => {
    const dispatch: AppDispatch = useAppDispatch()

    const projects = useSelector(
        (state: RootState) => state.projectsState.projects
    )
    const isLoading = useSelector(
        (state: RootState) => state.projectsState.isLoading
    )
    const error = useSelector((state: RootState) => state.projectsState.error)

    const page = useSelector(
        (state: RootState) => state.projectsState.projects?.page
    )

    const [searchTerm, setSearchTerm] = useState<string>('')

    const fetchMore = () => {
        dispatch(fetchProjects({ page: +(page ?? 0) + 1, searchTerm }))
    }

    const onDelete = (projectId: string) => {
        dispatch(deleteProject(projectId))
    }

    const onSearch = (searchTerm: string) => {
        setSearchTerm(searchTerm)
        dispatch(fetchProjects({ page: 1, searchTerm }))
    }

    useEffect(() => {
        if (!projects) {
            dispatch(fetchProjects({ page: 1, searchTerm }))
        }
    }, [projects])

    return (
        <Stack spacing={8}>
            <DebounceInput
                element={Input}
                placeholder="Search by title or description"
                onChange={(e) => {
                    onSearch(e.target.value)
                }}
                minLength={3}
                debounceTimeout={300}
            />
            <ProjectsList
                projects={projects}
                error={error}
                isLoading={isLoading}
                fetchMore={fetchMore}
                onAction={onDelete}
                isDeleted={false}
            />
        </Stack>
    )
}

export default ProjectListPage
