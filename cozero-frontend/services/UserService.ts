import { GenericError } from '../interfaces/generic-error.interface'
import { UserLoginDTO, UserRegistrationDTO } from '../interfaces/user.dto'
import HTTPService from './HTTPService'

class UserService {
    public async register(user: UserRegistrationDTO) {
        return HTTPService.post<UserLoginDTO | GenericError>(
            'users/sign-up',
            user
        )
    }

    public async login(user: UserRegistrationDTO) {
        return HTTPService.post<UserLoginDTO | GenericError>('auth/login', user)
    }
}

export default new UserService()
