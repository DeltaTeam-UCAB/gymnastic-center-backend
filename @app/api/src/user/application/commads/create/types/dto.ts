import { UserType } from 'src/user/application/models/user'

export type CreateUserDTO = {
    name: string
    email: string
    password: string
    phone: string
    type: UserType
}
