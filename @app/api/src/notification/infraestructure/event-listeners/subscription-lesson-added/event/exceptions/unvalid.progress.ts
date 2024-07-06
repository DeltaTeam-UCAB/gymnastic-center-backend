import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_PROGRESS = 'UNVALID_PROGRESS'

export const unvalidProgress = makeDomainErrorFactory({
    name: UNVALID_PROGRESS,
    message: 'Unvalid progress',
})
