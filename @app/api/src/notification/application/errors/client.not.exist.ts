import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const CLIENT_NOT_EXIST = 'CLIENT_NOT_EXIST'

export const clientNotExist = makeApplicationErrorFactory({
    name: CLIENT_NOT_EXIST,
    message: 'Client not exist',
})
