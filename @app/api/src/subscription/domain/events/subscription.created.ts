import { domainEventFactory } from 'src/core/domain/events/event'
import { SubscriptionID } from '../value-objects/subscription.id'
import { ClientID } from '../value-objects/client.id'
import { CourseID } from '../value-objects/course.id'
import { Time } from '../value-objects/time'
import { Lesson } from '../entities/lesson'

export const SUBSCRIPTION_CREATED = 'SUBSCRIPTION_CREATED'

export const subscriptionCreated = domainEventFactory<{
    id: SubscriptionID
    client: ClientID
    course: CourseID
    startTime: Time
    lastTime: Time
    lessons: Lesson[]
}>(SUBSCRIPTION_CREATED)
