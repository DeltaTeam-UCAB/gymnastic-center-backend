import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_SUBSCRIPTION = 'UNVALID_SUBSCRIPTION'

export const unvalidSubscription = makeDomainErrorFactory({
    name: UNVALID_SUBSCRIPTION,
    message: 'Unvalid subscription',
})
