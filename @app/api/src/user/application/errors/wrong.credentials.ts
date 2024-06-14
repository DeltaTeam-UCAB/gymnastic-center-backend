import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const WRONG_CREDENTIALS = 'WRONG_CREDENTIALS' as const

export const wrongCredentialsError = makeApplicationErrorFactory({
    name: WRONG_CREDENTIALS,
    message: 'Wrong credentials',
})
