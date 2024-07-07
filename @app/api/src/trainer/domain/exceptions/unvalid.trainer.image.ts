import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_TRAINER_IMAGE = 'UNVALID_TRAINER_IMAGE'

export const unvalidTrainerImage = makeDomainErrorFactory({
    name: UNVALID_TRAINER_IMAGE,
    message: 'Unvalid trainer image',
})
