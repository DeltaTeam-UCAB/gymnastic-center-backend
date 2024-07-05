import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_BLOG_DATE = 'UNVALID_BLOG_DATE'

export const unvalidBlogDate = makeDomainErrorFactory({
    name: UNVALID_BLOG_DATE,
    message: 'Unvalid blog date',
})
