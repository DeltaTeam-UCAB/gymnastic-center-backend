import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const BLOG_NOT_FOUND = 'BLOG_NOT_FOUND'

export const blogNotFoundError = makeApplicationErrorFactory({
    name: BLOG_NOT_FOUND,
    message: 'Blog not found',
})
