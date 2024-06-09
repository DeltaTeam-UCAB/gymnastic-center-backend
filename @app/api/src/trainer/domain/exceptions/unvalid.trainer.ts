import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_TRAINER = 'UNVALID_TRAINER'

export const unvalidTrainer = makeDomainErrorFactory({
    name: UNVALID_TRAINER,
    message: 'Unvalid trainer',
})
