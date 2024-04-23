import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const INVALID_TOKEN = 'INVALID_TOKEN'
export const invalidTokenError = makeApplicationErrorFactory({
    name: INVALID_TOKEN,
    message: 'The token is not valid',
})
