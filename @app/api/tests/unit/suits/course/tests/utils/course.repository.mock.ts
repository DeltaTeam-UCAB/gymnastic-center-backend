import { Course } from '../../../../../../src/course/application/models/course'
import { CourseRepository } from '../../../../../../src/course/application/repositories/course.repository'
import { Result } from '../../../../../../src/core/application/result-handler/result.handler'
import { Optional } from '@mono/types-utils'

export class CourseRepositoryMock implements CourseRepository {
    constructor(private courses: Course[] = []) {}

    async save(course: Course): Promise<Result<Course>> {
        this.courses = this.courses.filter((e) => e.id !== course.id)
        this.courses.push(course)
        return Result.success(course)
    }

    async getById(id: string): Promise<Optional<Course>> {
        return this.courses.find((e) => e.id === id)
    }

    async existByTitle(title: string): Promise<boolean> {
        return this.courses.some((e) => e.title === title)
    }

    async many(): Promise<Course[]> {
        return this.courses
    }
}
