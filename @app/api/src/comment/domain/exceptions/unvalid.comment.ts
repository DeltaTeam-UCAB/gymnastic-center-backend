import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_COMMENT_ID = 'UNVALID_COMMENT_ID'

export const unvalidComment = makeDomainErrorFactory({
    name: UNVALID_COMMENT_ID,
    message: 'Unvalid comment',
})
