import { domainEventFactory } from 'src/core/domain/events/event'
import { CourseID } from '../value-objects/course.id'
import { CourseTag } from '../value-objects/course.tag'

export const COURSE_TAG_ADDED = 'COURSE_TAG_ADDED'

export const courseTagAdded = domainEventFactory<{
    id: CourseID
    tag: CourseTag
}>(COURSE_TAG_ADDED)
