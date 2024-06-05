import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const TRAINER_NOT_FOUND = 'TRAINER_NOT_FOUND'

export const trainerNotFoundError = makeApplicationErrorFactory({
    name: TRAINER_NOT_FOUND,
    message: 'Trainer not found',
})
