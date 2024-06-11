import { Optional } from '@mono/types-utils'
import { Course } from 'src/subscription/domain/entities/course'
import { CourseID } from 'src/subscription/domain/value-objects/course.id'

export interface CourseRepository {
    getById(id: CourseID): Promise<Optional<Course>>
}
