import {
    Text,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Stack,
    useToast,
} from '@chakra-ui/react'
import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import UserService from '../services/UserService'
import { translate } from '../utils/language.utils'

interface Props {
    isSignUp: boolean
}

const LoginPage = ({ isSignUp }: Props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const { signUp, logIn } = useAuth()
    const toast = useToast()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.stopPropagation()
        e.preventDefault()

        try {
            isSignUp
                ? await signUp({ email, password })
                : await logIn({ email, password })
        } catch (error: any) {
            console.log('error registering user', error)
            toast({
                title: isSignUp ? 'Error creating user' : 'Error login',
                description: error.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }

    const isButtonDisabled = email.length === 0 || password.length === 0

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Stack spacing={8}>
                    <FormControl isRequired>
                        <FormLabel htmlFor="email">
                            {translate('EMAIL')}
                        </FormLabel>
                        <Input
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            placeholder="Email"
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel htmlFor="password">
                            {translate('PASSWORD')}
                        </FormLabel>
                        <Input
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                        />
                    </FormControl>
                    <Button disabled={isButtonDisabled} type="submit">
                        {translate(isSignUp ? 'CREATE_ACCOUNT' : 'SIGN_IN')}
                    </Button>
                </Stack>
            </form>
            <Flex gap={1} marginY={4}>
                <Text>
                    {translate(
                        isSignUp
                            ? 'ALREADY_HAVE_AN_ACCOUNT'
                            : 'DONT_HAVE_AN_ACCOUNT'
                    )}
                </Text>
                <Text
                    fontWeight="bold"
                    color="blue.700"
                    cursor={'pointer'}
                    onClick={() => navigate(isSignUp ? '/sign-in' : '/sign-up')}
                >
                    {translate(isSignUp ? 'SIGN_IN' : 'SIGN_UP')}
                </Text>
            </Flex>
        </>
    )
}

export default LoginPage
