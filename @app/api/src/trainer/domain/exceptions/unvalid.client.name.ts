import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_CLIENT_NAME = 'UNVALID_CLIENT_NAME'

export const unvalidClientName = makeDomainErrorFactory({
    name: UNVALID_CLIENT_NAME,
    message: 'Unvalid client name',
})
