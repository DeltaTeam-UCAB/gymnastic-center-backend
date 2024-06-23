import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_TRAINER_NAME = 'UNVALID_TRAINER_NAME'

export const unvalidTrainerName = makeDomainErrorFactory({
    name: UNVALID_TRAINER_NAME,
    message: 'Unvalid trainer name',
})
