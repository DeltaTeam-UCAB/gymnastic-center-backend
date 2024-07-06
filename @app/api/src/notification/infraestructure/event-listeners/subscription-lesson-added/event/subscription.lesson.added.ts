import { domainEventFactory } from 'src/core/domain/events/event'
import { SubscriptionID } from './value-objects/subscription.id'
import { Lesson } from './entities/lesson'

export const SUBSCRIPTION_LESSON_ADDED = 'SUBSCRIPTION_LESSON_ADDED'

export const lessonAdded = domainEventFactory<{
    id: SubscriptionID
    lesson: Lesson
}>(SUBSCRIPTION_LESSON_ADDED)
