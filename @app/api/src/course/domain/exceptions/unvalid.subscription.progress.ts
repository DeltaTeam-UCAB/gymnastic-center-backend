import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_SUBSCRIPTION_PROGRESS = 'UNVALID_SUBSCRIPTION_PROGRESS'

export const unvalidSubscriptionProgress = makeDomainErrorFactory({
    name: UNVALID_SUBSCRIPTION_PROGRESS,
    message: 'Unvalid subscription progress',
})