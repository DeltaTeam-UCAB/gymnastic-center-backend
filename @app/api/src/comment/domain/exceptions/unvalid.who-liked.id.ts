import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_WHO_LIKED_ID = 'UNVALID_WHO_LIKED_ID'

export const unvalidWhoLikedId = makeDomainErrorFactory({
    name: UNVALID_WHO_LIKED_ID,
    message: 'Unvalid who liked id',
})
