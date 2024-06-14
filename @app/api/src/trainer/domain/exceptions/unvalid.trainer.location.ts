import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_TRAINER_LOCATION = 'UNVALID_CLIENT_LOCATION'

export const unvalidTrainerLocation = makeDomainErrorFactory({
    name: UNVALID_TRAINER_LOCATION,
    message: 'Unvalid trainer location',
})
