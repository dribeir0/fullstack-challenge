import { Container, Flex, Stack, Text, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { ProjectsEmptyState } from './ProjectsEmptyState'
import { DeletedProjectsEmptyState } from './DeletedProjectsEmptyState'
import { ProjectsEmptySearchState } from './ProjectsEmptySearchState'
import { translate } from '../../utils/language.utils'
import ProjectItem from './ProjectItem'
import { useNavigate } from 'react-router'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Project } from '../../interfaces/project.interface'
import { ListResponse } from '../../interfaces/list.interface'
import { deleteProjectResponseTranslation } from '../../utils/project.utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

export default function ProjectsList({
    projects,
    isLoading,
    error,
    fetchMore,
    onAction,
    isDeleted,
}: {
    projects: ListResponse<Project> | undefined
    isLoading: boolean
    error: string | undefined
    fetchMore: () => void
    onAction: (projectId: string) => void
    isDeleted: boolean
}) {
    const [isProcessing, setIsProcessing] = useState<boolean>(false)

    const navigate = useNavigate()
    const toast = useToast()

    const searchTerm = useSelector(
        (state: RootState) => state.projectsState.searchTerm
    )

    useEffect(() => {
        if (isProcessing && !isLoading) {
            const { title, description } = deleteProjectResponseTranslation(
                !error,
                isDeleted
            )
            toast({
                title: title,
                description: description,
                status: !error ? 'success' : 'error',
                duration: 9000,
                isClosable: true,
            })
            setIsProcessing(false)
        }
    }, [isProcessing, isLoading, error])

    if (projects?.totalItems === 0 && !isLoading) {
        if (isDeleted) {
            return <DeletedProjectsEmptyState />
        }

        if (searchTerm !== '') {
            return <ProjectsEmptySearchState />
        }
        return <ProjectsEmptyState />
    }

    return (
        <Container>
            <InfiniteScroll
                dataLength={projects?.totalItems ?? 0}
                next={fetchMore}
                hasMore={(projects?.page ?? 0) < (projects?.totalPages ?? 0)}
                loader={<h4>Loading...</h4>}
                style={{
                    padding: '16px',
                }}
                endMessage={
                    !isDeleted ? (
                        <Flex marginTop={8} gap={2} justifyContent="center">
                            <Text>{translate('PROJECTS_FOOTER_CTA')}</Text>
                            <Text
                                onClick={() => navigate(`/projects/create`)}
                                cursor="pointer"
                                fontWeight="bold"
                                color="green.500"
                                textAlign="center"
                            >
                                {translate('PROJECTS_FOOTER_CTA_BUTTON')}
                            </Text>
                        </Flex>
                    ) : (
                        <></>
                    )
                }
            >
                <Stack spacing={8}>
                    {projects?.data?.map((project, i) => (
                        <ProjectItem
                            key={i}
                            project={project}
                            isDeleted={isDeleted}
                            onAction={() => {
                                setIsProcessing(true)
                                onAction(project.id)
                            }}
                        />
                    ))}
                </Stack>
            </InfiniteScroll>
        </Container>
    )
}
