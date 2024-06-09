import { domainEventFactory } from 'src/core/domain/events/event'
import { SubscriptionID } from '../value-objects/subscription.id'
import { LessonID } from '../value-objects/lesson.id'
import { LessonLastTime } from '../value-objects/lesson.last.time'

export const LESSON_LAST_TIME_CHANGED = 'LESSON_LAST_TIME_CHANGED'

export const lessonLastTimeChanged = domainEventFactory<{
    id: SubscriptionID
    lessonId: LessonID
    lastTime: LessonLastTime
}>(LESSON_LAST_TIME_CHANGED)
