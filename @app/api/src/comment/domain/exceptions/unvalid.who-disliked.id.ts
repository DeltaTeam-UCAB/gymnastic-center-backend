import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_WHO_DISLIKED_ID = 'UNVALID_WHO_DISLIKED_ID'

export const unvalidWhoDislikedId = makeDomainErrorFactory({
    name: UNVALID_WHO_DISLIKED_ID,
    message: 'Unvalid who disliked id',
})
