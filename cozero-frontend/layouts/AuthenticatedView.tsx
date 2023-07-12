import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

interface Props {
    children: React.ReactNode
}

export default function AuthenticatedView({ children }: Props) {
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate('/sign-in')
        }
    }, [user])

    if (user) {
        return <>{children}</>
    }

    // Session is being fetched, or no user.
    // If no user, useEffect() will redirect.
    return <div>Loading...</div>
}
