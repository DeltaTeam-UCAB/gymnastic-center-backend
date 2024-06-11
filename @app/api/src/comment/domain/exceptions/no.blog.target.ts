import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const NO_BLOG_TARGET = 'NO_BLOG_TARGET'

export const noBlogTarget = makeDomainErrorFactory({
    name: NO_BLOG_TARGET,
    message: 'Target is not blog type',
})
