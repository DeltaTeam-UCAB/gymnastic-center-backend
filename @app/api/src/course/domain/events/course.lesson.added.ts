import { domainEventFactory } from 'src/core/domain/events/event'
import { CourseID } from '../value-objects/course.id'
import { Lesson } from '../entities/lesson'

export const COURSE_LESSON_ADDED = 'COURSE_LESSON_ADDED'

export const courseLessonAdded = domainEventFactory<{
    id: CourseID
    lesson: Lesson
}>(COURSE_LESSON_ADDED)
