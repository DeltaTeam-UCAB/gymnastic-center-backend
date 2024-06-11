import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_CLIENT_ID = 'UNVALID_CLIENT_ID'

export const unvalidClientId = makeDomainErrorFactory({
    name: UNVALID_CLIENT_ID,
    message: 'Unvalid client id',
})