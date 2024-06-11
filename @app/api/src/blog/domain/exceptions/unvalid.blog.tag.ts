import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_BLOG_TAG = 'UNVALID_BLOG_TAG'

export const unvalidBlogTag = makeDomainErrorFactory({
    name: UNVALID_BLOG_TAG,
    message: 'Unvalid blog tag',
})
