import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const TRAINER_NOT_EXIST = 'TRAINER_NOT_EXIST' as const

export const trainerNotExistError = makeApplicationErrorFactory({
    name: TRAINER_NOT_EXIST,
    message: 'Trainer not exist',
})
