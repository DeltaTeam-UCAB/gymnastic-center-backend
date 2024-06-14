import { domainEventFactory } from 'src/core/domain/events/event'
import { CourseID } from '../value-objects/course.id'
import { CourseLevel } from '../value-objects/course.level'

export const COURSE_LEVEL_CHANGED = 'COURSE_LEVEL_CHANGED'

export const courseLevelChanged = domainEventFactory<{
    id: CourseID
    level: CourseLevel
}>(COURSE_LEVEL_CHANGED)
