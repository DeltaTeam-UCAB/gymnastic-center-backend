import { domainEventFactory } from 'src/core/domain/events/event'
import { SubscriptionID } from '../value-objects/subscription.id'
import { LessonID } from '../value-objects/lesson.id'

export const SUBSCRIPTION_LESSON_REMOVED = 'SUBSCRIPTION_LESSON_REMOVED'

export const lessonRemoved = domainEventFactory<{
    id: SubscriptionID
    lesson: LessonID
}>(SUBSCRIPTION_LESSON_REMOVED)
