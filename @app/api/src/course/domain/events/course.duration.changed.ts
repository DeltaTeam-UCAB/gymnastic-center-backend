import { domainEventFactory } from 'src/core/domain/events/event'
import { CourseID } from '../value-objects/course.id'
import { CourseDuration } from '../value-objects/course.duration'

export const COURSE_DURATION_CHANGED = 'COURSE_DURATION_CHANGED'

export const courseDurationChanged = domainEventFactory<{
    id: CourseID
    duration: CourseDuration
}>(COURSE_DURATION_CHANGED)
