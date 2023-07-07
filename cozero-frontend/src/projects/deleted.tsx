import { Heading, Stack } from '@chakra-ui/react'
import AuthenticatedView from '../../layouts/AuthenticatedView'
import { translate } from '../../utils/language.utils'

const DeletedProjectsPage = () => (
  <AuthenticatedView>
    <Stack spacing={8}>
      <Heading>
        Deleted Projects
      </Heading>
    </Stack>
  </AuthenticatedView>
)

export default DeletedProjectsPage