import { createContext } from 'react'
import { UserLoginDTO } from '../interfaces/user.dto'

export type Auth = {
    user: UserLoginDTO | undefined
}

export type AuthContextType = {
    context: Auth | undefined
    setContext: (context: Auth) => void
}

export const AuthContext = createContext<AuthContextType>({
    context: {
        user: undefined,
    },
    setContext: () => {},
})
