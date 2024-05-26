import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const COMMENT_NOT_FOUND = 'COMMENT_NOT_FOUND' as const

export const commentNotFoundError = makeApplicationErrorFactory({
    name: COMMENT_NOT_FOUND,
    message: 'Comment not found',
})
