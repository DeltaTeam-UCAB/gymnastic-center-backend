import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const INVALID_CREDENTIALS = 'INVALID_CREDENTIALS' as const

export const invalidCredentialsError = makeApplicationErrorFactory({
    name: INVALID_CREDENTIALS,
    message: 'Invalid credentials',
})
