import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const SUBSCRIPTION_NOT_FOUND = 'SUBSCRIPTION_NOT_FOUND'

export const subscriptionNotFound = makeApplicationErrorFactory({
    name: SUBSCRIPTION_NOT_FOUND,
    message: 'Subscription not found',
})
