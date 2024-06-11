import { Optional } from '@mono/types-utils'
import { CourseRepository } from '../../../../../../src/subscription/application/repositories/course.repository'
import { CourseID } from '../../../../../../src/subscription/domain/value-objects/course.id'
import { Course } from '../../../../../../src/subscription/domain//entities/course'

export class CourseRepositoryMock implements CourseRepository {
    constructor(private courses: Course[] = []) {}
    async getById(id: CourseID): Promise<Optional<Course>> {
        return this.courses.find((e) => e.id == id)
    }
}
