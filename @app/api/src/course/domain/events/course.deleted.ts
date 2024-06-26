import { domainEventFactory } from 'src/core/domain/events/event'
import { CourseID } from '../value-objects/course.id'

export const COURSE_DELETED = 'COURSE_DELETED'

export const courseDeleted = domainEventFactory<{
    id: CourseID
}>(COURSE_DELETED)
