import { Course } from '../../../../../../src/course/domain/course'
import { CourseRepository } from '../../../../../../src/course/application/repositories/course.repository'
import { Result } from '../../../../../../src/core/application/result-handler/result.handler'
import { Optional } from '@mono/types-utils'
import { CourseID } from '../../../../../../src/course/domain/value-objects/course.id'
import { CourseTitle } from '../../../../../../src/course/domain/value-objects/course.title'
import { TrainerID } from '../../../../../../src/course/domain/value-objects/trainer.id'
import { CategoryID } from '../../../../../../src/course/domain/value-objects/category.id'

export class CourseRepositoryMock implements CourseRepository {
    constructor(private courses: Course[] = []) {}

    async save(course: Course): Promise<Result<Course>> {
        this.courses = this.courses.filter((e) => e.id != course.id)
        this.courses.push(course)
        return Result.success(course)
    }

    async getById(id: CourseID): Promise<Optional<Course>> {
        return this.courses.find((e) => e.id == id)
    }

    async existByTitle(title: CourseTitle): Promise<boolean> {
        return this.courses.some((e) => e.title == title)
    }

    async many(): Promise<Course[]> {
        return this.courses
    }

    async countByTrainer(id: TrainerID): Promise<number> {
        let count = 0
        this.courses.forEach((c) => {
            if (c.trainer.id == id) count++
        })
        return count
    }

    async countByCategory(id: CategoryID): Promise<number> {
        let count = 0
        this.courses.forEach((c) => {
            if (c.category.id == id) count++
        })
        return count
    }

    async delete(course: Course): Promise<Result<Course>> {
        this.courses = this.courses.filter((e) => e.id != course.id)
        return Result.success(course)
    }

    async getAllByTrainer(id: TrainerID): Promise<Course[]> {
        return this.courses.filter((c) => c.trainer.id == id)
    }
}
