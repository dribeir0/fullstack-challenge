import { Heading, Stack } from '@chakra-ui/react'
import AuthenticatedView from '../../layouts/AuthenticatedView'
import { translate } from '../../utils/language.utils'
import DeletedProjectsList from '../../components/projects/DeletedProjectsList'

const DeletedProjectsPage = () => {
    return (
        <AuthenticatedView>
            <Stack spacing={8}>
                <Heading>{translate('DELETED_PROJECTS')}</Heading>
                <DeletedProjectsList />
            </Stack>
        </AuthenticatedView>
    )
}

export default DeletedProjectsPage
