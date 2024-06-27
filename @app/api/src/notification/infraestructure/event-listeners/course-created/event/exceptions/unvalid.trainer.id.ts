import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_TRAINER_ID = 'UNVALID_TRAINER_ID'

export const unvalidTrainerId = makeDomainErrorFactory({
    name: UNVALID_TRAINER_ID,
    message: 'Unvalid trainer id',
})
