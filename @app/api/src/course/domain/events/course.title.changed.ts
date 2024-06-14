import { domainEventFactory } from 'src/core/domain/events/event'
import { CourseID } from '../value-objects/course.id'
import { CourseTitle } from '../value-objects/course.title'

export const COURSE_TITLE_CHANGED = 'COURSE_TITLE_CHANGED'

export const courseTitleChanged = domainEventFactory<{
    id: CourseID
    title: CourseTitle
}>(COURSE_TITLE_CHANGED)
