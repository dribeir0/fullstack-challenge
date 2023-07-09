import { useEffect } from "react"
import LocalStorageService from "../services/LocalStorageService"
import { useNavigate } from "react-router"

interface Props {
    children: React.ReactNode
}

export default function AuthenticatedView({ children }: Props) {
    const isUser = LocalStorageService.getJwtToken()
    const navigate = useNavigate()

    useEffect(() => {
      if (!isUser) {
        navigate("/sign-in")
      }
    }, [])

    if (isUser) {
      return <>{children}</>
    }

    // Session is being fetched, or no user.
    // If no user, useEffect() will redirect.
    return <div>Loading...</div>
  }
