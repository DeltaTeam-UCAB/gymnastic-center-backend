import { domainEventFactory } from 'src/core/domain/events/event'
import { SubscriptionID } from './value-objects/subscription.id'
import { LessonID } from './value-objects/lesson.id'
import { LessonProgress } from './value-objects/lesson.progress'

export const LESSON_PROGRESS_CHANGED = 'LESSON_PROGRESS_CHANGED'

export const lessonProgressChanged = domainEventFactory<{
    id: SubscriptionID
    lessonId: LessonID
    progress: LessonProgress
}>(LESSON_PROGRESS_CHANGED)
