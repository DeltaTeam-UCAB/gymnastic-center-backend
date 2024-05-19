import { Result } from 'src/core/application/result-handler/result.handler'
import { course } from '../models/course'

export interface CourseRepository {
    paginate(): Promise<Result<course>>
}
