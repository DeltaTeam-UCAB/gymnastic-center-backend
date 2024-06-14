import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const USER_NOT_FOUND = 'USER_NOT_FOUND' as const

export const userNotFoundError = makeApplicationErrorFactory({
    name: USER_NOT_FOUND,
    message: 'User not found',
})
