import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_BLOG_ID = 'UNVALID_BLOG_ID'

export const unvalidBlogId = makeDomainErrorFactory({
    name: UNVALID_BLOG_ID,
    message: 'Unvalid blog id',
})
