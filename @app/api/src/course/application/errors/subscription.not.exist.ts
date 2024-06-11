import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const SUBSCRIPTION_NOT_EXIST = 'SUBSCRIPTION_NOT_EXIST' as const

export const subscriptionNotExistError = makeApplicationErrorFactory({
    name: SUBSCRIPTION_NOT_EXIST,
    message: 'Subscription not exist',
})
