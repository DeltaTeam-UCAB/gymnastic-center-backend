import { domainEventFactory } from 'src/core/domain/events/event'
import { CourseID } from './value-objects/course.id'
import { LessonID } from './value-objects/lesson.id'

export const COURSE_LESSON_REMOVED = 'COURSE_LESSON_REMOVED'

export const courseLessonRemoved = domainEventFactory<{
    id: CourseID
    lesson: LessonID
}>(COURSE_LESSON_REMOVED)
