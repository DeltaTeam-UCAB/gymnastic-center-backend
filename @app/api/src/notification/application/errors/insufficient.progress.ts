import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const INSUFFICIENT_PROGRESS = 'INSUFFICIENT_PROGRESS'

export const insufficientProgress = makeApplicationErrorFactory({
    name: INSUFFICIENT_PROGRESS,
    message: 'Insufficient progress',
})
