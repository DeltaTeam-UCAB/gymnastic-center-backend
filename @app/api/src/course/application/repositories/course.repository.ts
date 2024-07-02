import { Result } from 'src/core/application/result-handler/result.handler'
import { Optional } from '@mono/types-utils'
import { Course } from 'src/course/domain/course'
import { CourseID } from 'src/course/domain/value-objects/course.id'
import { CourseTitle } from 'src/course/domain/value-objects/course.title'
import { CategoryID } from 'src/course/domain/value-objects/category.id'
import { TrainerID } from 'src/course/domain/value-objects/trainer.id'

export type GetManyCoursesData = {
    page: number
    perPage: number
    category?: CategoryID
    trainer?: TrainerID
}

export interface CourseRepository {
    save(course: Course): Promise<Result<Course>>
    getById(id: CourseID): Promise<Optional<Course>>
    existByTitle(title: CourseTitle): Promise<boolean>
    many(data: GetManyCoursesData): Promise<Course[]>
    countByTrainer(id: TrainerID): Promise<number>
}
