import { UserType } from '../../user'

export type CurrentUserResponse = {
    id: string
    name: string
    email: string
    type: UserType
}
