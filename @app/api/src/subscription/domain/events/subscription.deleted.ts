import { domainEventFactory } from 'src/core/domain/events/event'
import { SubscriptionID } from '../value-objects/subscription.id'

export const SUBSCRIPTION_DELETED = 'SUBSCRIPTION_DELETED'

export const subscriptionDeleted = domainEventFactory<{
    id: SubscriptionID
}>(SUBSCRIPTION_DELETED)
