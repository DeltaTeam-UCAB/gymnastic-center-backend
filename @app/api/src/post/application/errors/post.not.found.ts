import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const POST_NOT_FOUND = 'POST_NOT_FOUND'

export const postNotFoundError = makeApplicationErrorFactory({
    name: POST_NOT_FOUND,
    message: 'Post not found',
})
