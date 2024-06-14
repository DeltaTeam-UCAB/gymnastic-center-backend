import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const SUBSCRIPTION_EXIST = 'SUBSCRIPTION_EXIST'

export const subscriptionExist = makeApplicationErrorFactory({
    name: SUBSCRIPTION_EXIST,
    message: 'Subscription already exist',
})
