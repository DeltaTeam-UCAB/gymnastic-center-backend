import { domainEventFactory } from 'src/core/domain/events/event'
import { CourseID } from '../value-objects/course.id'
import { CourseDescription } from '../value-objects/course.description'

export const COURSE_DESCRIPTION_CHANGED = 'COURSE_DESCRIPTION_CHANGED'

export const courseDescriptionChanged = domainEventFactory<{
    id: CourseID
    description: CourseDescription
}>(COURSE_DESCRIPTION_CHANGED)
