import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_TARGET_BLOG_ID = 'UNVALID_TARGET_BLOG_ID'

export const unvalidTargetBlogId = makeDomainErrorFactory({
    name: UNVALID_TARGET_BLOG_ID,
    message: 'Unvalid target blog id',
})
