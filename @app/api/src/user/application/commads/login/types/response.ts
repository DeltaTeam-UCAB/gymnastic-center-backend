import { UserType } from 'src/user/application/models/user'

export type LoginResponse = {
    token: string
    type: UserType
}
