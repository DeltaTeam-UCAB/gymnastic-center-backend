import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const CLIENT_NOT_AUTHOR = 'CLIENT_NOT_AUTHOR'

export const clientNotAuthor = makeApplicationErrorFactory({
    name: CLIENT_NOT_AUTHOR,
    message: 'Client is not the author',
})
