import { UserType } from 'src/user/application/models/user'

export type UpdateUserDTO = {
    id: string
    name?: string
    email?: string
    password?: string
    phone?: string
    type?: UserType
}
