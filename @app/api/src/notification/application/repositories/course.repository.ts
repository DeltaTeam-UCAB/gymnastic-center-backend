import { Optional } from '@mono/types-utils'
import { Course } from '../models/course'

export interface CourseRepository {
    getById(id: string): Promise<Optional<Course>>
}
