import React from 'react'
import { Heading, Container, Text, Button } from '@chakra-ui/react'
import { translate } from '../../utils/language.utils'
import { useNavigate } from 'react-router'
import { MdMood } from 'react-icons/md'

export const DeletedProjectsEmptyState = () => {
    const navigate = useNavigate()

    return (
        <Container
            gap={5}
            display={'flex'}
            alignItems="center"
            justifyContent={'center'}
            flexDirection="column"
        >
            <MdMood size={60} />
            <Heading size="lg" textAlign="center">
                You don't have deleted projects
            </Heading>
        </Container>
    )
}
