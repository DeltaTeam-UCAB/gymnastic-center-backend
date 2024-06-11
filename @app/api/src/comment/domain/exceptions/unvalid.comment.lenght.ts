import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_COMMENT_LENGTH = 'UNVALID_COMMENT_LENGTH'

export const unvalidCommentLength = makeDomainErrorFactory({
    name: UNVALID_COMMENT_LENGTH,
    message: 'Unvalid comment length',
})
