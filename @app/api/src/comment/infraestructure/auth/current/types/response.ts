import { UserType } from 'src/user/application/models/user'

export type CurrentUserResponse = {
    id: string
    name: string
    email: string
    type: UserType
}
