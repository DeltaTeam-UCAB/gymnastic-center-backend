import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_LAST_TIME = 'UNVALID_LAST_TIME'

export const unvalidLastTime = makeDomainErrorFactory({
    name: UNVALID_LAST_TIME,
    message: 'Unvalid last time',
})
