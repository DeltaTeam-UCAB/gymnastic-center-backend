import { domainEventFactory } from 'src/core/domain/events/event'
import { CourseID } from './value-objects/course.id'
import { CourseTitle } from './value-objects/course.title'
import { CourseDescription } from './value-objects/course.description'
import { CourseDuration } from './value-objects/course.duration'
import { CourseLevel } from './value-objects/course.level'
import { CourseTag } from './value-objects/course.tag'
import { Lesson } from './entities/lesson'
import { Trainer } from './entities/trainer'
import { Category } from './entities/category'
import { CourseImage } from './value-objects/course.image'

export const COURSE_CREATED = 'COURSE_CREATED'

export const courseCreated = domainEventFactory<{
    id: CourseID
    title: CourseTitle
    description: CourseDescription
    duration: CourseDuration
    level: CourseLevel
    tags: CourseTag[]
    lessons: Lesson[]
    trainer: Trainer
    category: Category
    image: CourseImage
}>(COURSE_CREATED)
