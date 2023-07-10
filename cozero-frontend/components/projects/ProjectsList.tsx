import { Container, Flex, Stack, Text, calc, useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { ProjectsEmptyState } from "./ProjectsEmptyState"
import { Project } from "../../interfaces/project.interface";
import ProjectsService from "../../services/ProjectsService";
import { translate } from "../../utils/language.utils";
import ProjectItem from "./ProjectItem";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { AppDispatch, RootState, useAppDispatch } from "../../store/store";
import { fetchProjects } from "../../store/projectsSlice";
import InfiniteScroll from 'react-infinite-scroll-component';

export default function ProjectsList() {
    const dispatch: AppDispatch = useAppDispatch();

    const projectList = useSelector((state: RootState) => state.projectsState.projects)
    const isLoading  = useSelector((state: RootState) => state.projectsState.isLoading)
    const page = useSelector((state: RootState) => state.projectsState.projects?.page)

    const navigate = useNavigate()
    const toast = useToast();

    useEffect(() => {
        dispatch(fetchProjects(1))
    }, [dispatch]);

    const fetchMore = () => {
        dispatch(fetchProjects(+(page ?? 0) + 1))
    }

    const onDelete = async (projectId: string) => {
        const deletedProject = await ProjectsService.deleteProject(projectId)

        toast({
            title: translate(deletedProject ? 'PROJECT_DELETED' : 'PROJECTED_DELETE_ERROR'),
            description: translate(deletedProject ? "PROJECT_DELETED_DESCRIPTION" : "PROJECT_DELETE_ERROR_DESCRIPTION"),
            status: deletedProject ? 'success' : 'error',
            duration: 9000,
            isClosable: true,
        })

        // if (deletedProject) {
        //     setProjectList(projectList.filter(project => project.id !== projectId))
        // }
    }

    if (projectList?.totalItems === 0 && !isLoading) {
        return <ProjectsEmptyState />
    }

    return (
        <Container>
            <InfiniteScroll
                dataLength={projectList?.totalItems ?? 0} //This is important field to render the next data
                next={fetchMore}
                hasMore={(projectList?.page ?? 0) < (projectList?.totalPages ?? 0)}
                loader={<h4>Loading...</h4>}
                style={{
                    padding: '16px'
                }}
                endMessage={
                <Flex marginTop={8} gap={2} justifyContent='center'>
                    <Text>{translate('PROJECTS_FOOTER_CTA')}</Text>
                    <Text
                        onClick={() => navigate(`/projects/create`)}
                        cursor='pointer'
                        fontWeight='bold'
                        color='green.500'
                        textAlign='center'
                    >
                        {translate('PROJECTS_FOOTER_CTA_BUTTON')}
                    </Text>
                </Flex>
                }
            >
                <Stack spacing={8}>
                    {projectList?.data?.map(project => (
                        <ProjectItem key={project.id} project={project} onDelete={onDelete} />
                    ))}
                </Stack>
            </InfiniteScroll>
        </Container>
    )
}