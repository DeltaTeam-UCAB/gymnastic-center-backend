import {
    User,
    UserType,
} from '../../../../../../src/user/application/models/user'

export const createUser = (data?: {
    id?: string
    email?: string
    password?: string
    type?: UserType
    name?: string
}): User => ({
    id: data?.id ?? '1234567890',
    email: data?.email ?? 'test@mail.com',
    password: data?.password ?? '123',
    type: data?.type ?? 'CLIENT',
    name: data?.name ?? 'test user',
    phone: '111111111',
    verified: true,
})
