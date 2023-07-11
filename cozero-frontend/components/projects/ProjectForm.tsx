import {
    Box,
    Button,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    List,
    ListIcon,
    ListItem,
    RangeSlider,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    RangeSliderTrack,
    Stack,
    Text,
    Textarea,
    useToast,
} from '@chakra-ui/react'
import { FaLeaf } from 'react-icons/fa'
import { BsFillTrashFill } from 'react-icons/bs'
import { TbLeaf } from 'react-icons/tb'
import { useForm, useFieldArray } from 'react-hook-form'
import {
    CreateProjectDto,
    ProjectForm as IProjectForm,
    Project,
    UpdateProjectDto,
} from '../../interfaces/project.interface'
import { useCallback, useContext, useEffect, useState } from 'react'
import { createProjectDefaultValues } from '../../constants/project.constants'
import ProjectsService from '../../services/ProjectsService'
import { translate } from '../../utils/language.utils'
import { ProjectInformation } from '../../enums/projectInformation.enum'
import {
    getProjectResponseTranslation,
    projectFormToProjectDTO,
} from '../../utils/project.utils'
import { useNavigate, useParams } from 'react-router'
import { AuthContext } from '../../context/auth'
import { AppDispatch, RootState, useAppDispatch } from '../../store/store'
import { createProject, updateProject } from '../../store/projectsSlice'
import { fetchProjectById } from '../../store/projectDetailsSlice'
import { useSelector } from 'react-redux'

export default function ProjectForm() {
    const dispatch: AppDispatch = useAppDispatch()

    const { id } = useParams()
    const projectDetails = useSelector(
        (state: RootState) => state.projectDetailsState.projectDetails
    )

    // TODO: add loading
    const isDetailLoading = useSelector(
        (state: RootState) => state.projectDetailsState.isLoading
    )
    const isMutationLoading = useSelector(
        (state: RootState) => state.projectsState.isLoading
    )
    const isMutationError = useSelector(
        (state: RootState) => state.projectsState.error
    )

    const [listItem, setListItem] = useState<string>('')
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const toast = useToast()
    const navigate = useNavigate()
    const { register, handleSubmit, watch, control, setValue, reset } =
        useForm<IProjectForm>({
            defaultValues: createProjectDefaultValues,
        })
    const { context } = useContext(AuthContext)

    const { append, remove } = useFieldArray({
        control,
        name: 'listing',
    })

    useEffect(() => {
        if (projectDetails) {
            reset({
                ...projectDetails,
                listing: projectDetails.listing.map((item) => {
                    return {
                        id: Date.now().toString() + Math.random().toString(),
                        name: item,
                    }
                }),
                co2EstimateReduction: {
                    min: projectDetails.co2EstimateReduction[0],
                    max: projectDetails.co2EstimateReduction[1],
                },
            })
        }
    }, [projectDetails])

    useEffect(() => {
        if (id) {
            dispatch(fetchProjectById(id))
        }
    }, [id])

    useEffect(() => {
        if (isProcessing && !isMutationLoading) {
            const isSuccess = !isMutationError

            const { title, description } = getProjectResponseTranslation(
                isSuccess,
                !!id
            )

            toast({
                title,
                description,
                status: isSuccess ? 'success' : 'error',
                duration: 9000,
                isClosable: true,
            })

            if (isSuccess) {
                navigate('/projects')
            }
        }
    }, [isProcessing, isMutationLoading, isMutationError])

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !!listItem) {
            append({
                name: listItem,
                id: Date.now().toString() + Math.random(), // Not the best way to do this, but it works for this example
            })
            setListItem('')
            e.preventDefault()
        }
    }

    const onSubmitForm = async (projectForm: IProjectForm) => {
        const project: CreateProjectDto | UpdateProjectDto =
            projectFormToProjectDTO(projectForm, context?.user?.email as string)
        id
            ? dispatch(updateProject(project as UpdateProjectDto))
            : dispatch(createProject(project))
        setIsProcessing(true)
    }

    const {
        co2EstimateReduction: { min, max },
        listing,
        name,
    } = watch()

    return (
        <form onSubmit={handleSubmit(onSubmitForm)}>
            <Stack spacing={8}>
                <FormControl>
                    <FormLabel>{translate('PROJECT_NAME')}</FormLabel>
                    <Input
                        type="text"
                        placeholder="Amazonas forestation"
                        {...register('name', { required: true })}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>{translate('PROJECT_DESCRIPTION')}</FormLabel>
                    <Textarea
                        rows={5}
                        placeholder="Plant 12.000 autochthonous trees"
                        {...register('description', { required: true })}
                    />
                    <FormHelperText>
                        {translate('PROJECT_DESCRIPTION_HELPER')}
                    </FormHelperText>
                </FormControl>
                <FormControl>
                    <FormLabel>{translate('CO2_EMISSIONS_SAVED')}</FormLabel>
                    <Box>
                        <RangeSlider
                            defaultValue={[120, 240]}
                            value={[min, max]}
                            step={100}
                            min={0}
                            max={1000}
                            onChange={(val) =>
                                setValue('co2EstimateReduction', {
                                    min: val[0],
                                    max: val[1],
                                })
                            }
                        >
                            <RangeSliderTrack bg="green.100">
                                <RangeSliderFilledTrack bg="green.700" />
                            </RangeSliderTrack>
                            <RangeSliderThumb boxSize={6} index={0}>
                                <Box color="green.600" as={FaLeaf} />
                            </RangeSliderThumb>
                            <RangeSliderThumb boxSize={6} index={1}>
                                <Box color="green.600" as={FaLeaf} />
                            </RangeSliderThumb>
                        </RangeSlider>
                        <Text textAlign="right" color="green.600">
                            {min} - {max} {translate('CO2e')}
                        </Text>
                    </Box>
                    <FormHelperText
                        onClick={() => {
                            window.open(ProjectInformation.WikiLink, '_blank')
                        }}
                        cursor="pointer"
                        color="blue.300"
                    >
                        {translate('CO2E_CALCULATION_C2A')}
                    </FormHelperText>
                </FormControl>
                <FormControl>
                    <FormLabel>{translate('LISTING_PROPOSALS')}</FormLabel>
                    <Input
                        type="text"
                        id="listing-proposal-input"
                        value={listItem}
                        onChange={(e) => setListItem(e.target.value)}
                        onKeyDown={onKeyDown}
                    />
                    <FormHelperText>
                        {translate('ADD_PROPOSAL_ENTER')}
                    </FormHelperText>
                </FormControl>
                <List spacing={3} id="listing-proposals">
                    {listing.map((item, index) => (
                        <ListItem key={index}>
                            <Flex gap={4} alignItems="center">
                                <ListIcon as={TbLeaf} color="green.500" />
                                {item.name}
                                <BsFillTrashFill
                                    size={16}
                                    onClick={() =>
                                        remove(
                                            listing.findIndex(
                                                (listItem) =>
                                                    listItem.id === item.id
                                            )
                                        )
                                    }
                                    cursor="pointer"
                                />
                            </Flex>
                        </ListItem>
                    ))}
                </List>

                <Button
                    colorScheme="green"
                    type="submit"
                    isLoading={isMutationLoading}
                >
                    {translate(id ? 'UPDATE' : 'CREATE')} {translate('PROJECT')}
                </Button>
                <Button
                    isLoading={isMutationLoading}
                    onClick={() => navigate(-1)}
                >
                    {translate('GO_BACK')}
                </Button>
            </Stack>
        </form>
    )
}
