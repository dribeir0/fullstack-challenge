import { Heading, Container } from '@chakra-ui/react'
import { translate } from '../../utils/language.utils'
import { TbMoodEmpty } from 'react-icons/tb'

export const ProjectsEmptySearchState = () => {
    return (
        <Container
            gap={5}
            display={'flex'}
            alignItems="center"
            justifyContent={'center'}
            flexDirection="column"
        >
            <TbMoodEmpty size={60} />
            <Heading size="lg" textAlign="center">
                {translate('NO_PROJECTS_FOUND_TITLE')}
            </Heading>
        </Container>
    )
}
