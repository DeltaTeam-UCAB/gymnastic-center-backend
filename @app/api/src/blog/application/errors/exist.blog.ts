import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const EXIST_BLOG = 'EXIST_BLOG'

export const existBlogError = makeApplicationErrorFactory({
    name: EXIST_BLOG,
    message: 'Existing blog',
})
