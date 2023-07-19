import { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { AuthContext } from '../context/auth'
import { UserLoginDTO, UserRegistrationDTO } from '../interfaces/user.dto'
import LocalStorageService from '../services/LocalStorageService'
import UserService from '../services/UserService'
import { GenericError } from '../interfaces/generic-error.interface'

export const useAuth = () => {
    const { context, setContext } = useContext(AuthContext)
    const user = context?.user
    const navigate = useNavigate()

    const signIn = async (user: UserRegistrationDTO) => {
        const loggedUser = await UserService.login(user)

        if ((loggedUser as GenericError)?.statusCode) {
            throw new Error((loggedUser as GenericError).message)
        }

        setContext({
            ...context,
            user: loggedUser as UserLoginDTO,
        })
        LocalStorageService.setItem('user', loggedUser)
        if (loggedUser) {
            navigate('/')
            return
        }

        return null
    }

    const signUp = useCallback(async (user: UserRegistrationDTO) => {
        const createdUser = await UserService.register(user)

        if ((createdUser as GenericError)?.statusCode) {
            throw new Error((createdUser as GenericError).message)
        }

        if (createdUser) {
            LocalStorageService.setItem('user', createdUser)
        }

        setContext({
            ...context,
            user: createdUser as UserLoginDTO,
        })

        navigate('/')
        return createdUser
    }, [])

    const signOut = () => {
        setContext({
            ...context,
            user: undefined,
        })

        LocalStorageService.removeItem('user')
        navigate('/')
    }

    useEffect(() => {
        const user = LocalStorageService.getItem<UserLoginDTO>('user')
        if (user) {
            setContext({
                ...context,
                user,
            })
        }
    }, [])

    useEffect(() => {
        if (!user) {
            LocalStorageService.removeItem('user')
            return
        }

        LocalStorageService.setItem('user', user)
    }, [user])

    return { user, logIn: signIn, signOut, signUp }
}
