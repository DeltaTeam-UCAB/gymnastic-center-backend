import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_BLOG_TITLE = 'UNVALID_BLOG_TITLE'

export const unvalidBlogTitle = makeDomainErrorFactory({
    name: UNVALID_BLOG_TITLE,
    message: 'Unvalid blog title',
})
