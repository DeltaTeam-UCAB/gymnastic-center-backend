import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const TRAINER_NAME_INVALID = 'TRAINER_NAME_INVALID' as const

export const trainerNameInvalidError = makeApplicationErrorFactory({
    name: TRAINER_NAME_INVALID,
    message: 'Trainer name already exists',
})
