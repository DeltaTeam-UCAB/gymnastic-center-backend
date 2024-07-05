import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_BLOG = 'UNVALID_BLOG'

export const unvalidBlog = makeDomainErrorFactory({
    name: UNVALID_BLOG,
    message: 'Unvalid blog',
})
