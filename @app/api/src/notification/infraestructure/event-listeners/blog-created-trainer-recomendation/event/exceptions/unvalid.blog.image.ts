import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_BLOG_IMAGE = 'UNVALID_BLOG_IMAGE'

export const unvalidBlogImage = makeDomainErrorFactory({
    name: UNVALID_BLOG_IMAGE,
    message: 'Unvalid blog image',
})
