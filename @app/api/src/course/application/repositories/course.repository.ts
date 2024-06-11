import { Result } from 'src/core/application/result-handler/result.handler'
import { Course } from '../models/course'
import { Optional } from '@mono/types-utils'

export type GetManyCoursesData = {
    page: number
    perPage: number
    category?: string
    trainer?: string
}

export interface CourseRepository {
    save(course: Course): Promise<Result<Course>>
    getById(id: string): Promise<Optional<Course>>
    existByTitle(title: string): Promise<boolean>
    many(data: GetManyCoursesData): Promise<Course[]>
}
