import { Result } from 'src/core/application/result-handler/result.handler'
import { Course } from '../models/course'

export interface CourseRepository {
    save(course: Course): Promise<Result<Course>>
    existByTitle(title: string): Promise<boolean>
}
