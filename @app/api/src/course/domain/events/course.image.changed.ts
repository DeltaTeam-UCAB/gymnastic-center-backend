import { domainEventFactory } from 'src/core/domain/events/event'
import { CourseID } from '../value-objects/course.id'
import { CourseImage } from '../value-objects/course.image'

export const COURSE_IMAGE_CHANGED = 'IMAGE_CHANGED'

export const courseImageChanged = domainEventFactory<{
    id: CourseID
    image: CourseImage
}>(COURSE_IMAGE_CHANGED)
