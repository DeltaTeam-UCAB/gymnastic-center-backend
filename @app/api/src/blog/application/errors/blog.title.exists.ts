import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const BLOG_TITLE_EXIST = 'BLOG_TITLE_EXIST' as const

export const blogTitleExistError = makeApplicationErrorFactory({
    name: BLOG_TITLE_EXIST,
    message: 'Blog title exist',
})
