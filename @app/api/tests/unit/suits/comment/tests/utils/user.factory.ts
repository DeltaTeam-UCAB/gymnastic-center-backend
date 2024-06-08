import { User } from '../../../../../../src/comment/application/models/user'

export const createUser = (data?: { id?: string; name?: string }): User => ({
    id: data?.id ?? '1234567890',
    name: data?.name ?? 'test user',
})
