import { domainEventFactory } from 'src/core/domain/events/event'
import { SubscriptionID } from '../value-objects/subscription.id'
import { Time } from '../value-objects/time'

export const LAST_TIME_CHANGED = 'LAST_TIME_CHANGED'

export const lastTimeChanged = domainEventFactory<{
    id: SubscriptionID
    lastTime: Time
}>(LAST_TIME_CHANGED)
