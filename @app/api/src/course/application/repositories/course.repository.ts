import { Result } from 'src/core/application/result-handler/result.handler'
import { Course } from '../models/course'
import { Optional } from '@mono/types-utils'

export interface CourseRepository {
    save(course: Course): Promise<Result<Course>>
    getById(id: string): Promise<Optional<Course>>
    existByTitle(title: string): Promise<boolean>
    Pagination(limit?: number, offset?: number): Promise<Course[]>
}
