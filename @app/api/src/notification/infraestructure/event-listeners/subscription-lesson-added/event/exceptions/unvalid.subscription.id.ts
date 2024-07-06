import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_SUBSCRIPTION_ID = 'UNVALID_SUBSCRIPTION_ID'

export const unvalidSubscriptionId = makeDomainErrorFactory({
    name: UNVALID_SUBSCRIPTION_ID,
    message: 'Unvalid subscription id',
})
