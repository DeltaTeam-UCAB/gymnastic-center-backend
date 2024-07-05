import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_BLOG_BODY = 'UNVALID_BLOG_BODY'

export const unvalidBlogBody = makeDomainErrorFactory({
    name: UNVALID_BLOG_BODY,
    message: 'Unvalid blog body',
})
