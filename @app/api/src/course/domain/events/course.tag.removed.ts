import { domainEventFactory } from 'src/core/domain/events/event'
import { CourseID } from '../value-objects/course.id'
import { CourseTag } from '../value-objects/course.tag'

export const COURSE_TAG_REMOVED = 'COURSE_TAG_REMOVED'

export const courseTagRemoved = domainEventFactory<{
    id: CourseID
    tag: CourseTag
}>(COURSE_TAG_REMOVED)
