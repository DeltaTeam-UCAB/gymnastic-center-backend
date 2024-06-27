import { Course } from '../models/course'

export type SearchCoursesCriteria = {
    page: number
    perPage: number
    term?: string
    tags?: string[]
}

export interface CourseRepository {
    getMany(criteria: SearchCoursesCriteria): Promise<Course[]>
}
