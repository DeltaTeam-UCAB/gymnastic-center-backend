import { domainEventFactory } from 'src/core/domain/events/event'
import { CourseID } from '../value-objects/course.id'
import { Category } from '../entities/category'

export const COURSE_CATEGORY_CHANGED = 'COURSE_CATEGORY_CHANGED'

export const courseCategoryChanged = domainEventFactory<{
    id: CourseID
    category: Category
}>(COURSE_CATEGORY_CHANGED)
