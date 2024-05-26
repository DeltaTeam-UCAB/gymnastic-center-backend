import { Lesson } from '../../../../../../src/course/application/models/lesson'
import { LessonRepository } from '../../../../../../src/course/application/repositories/lesson.repository'
import { Result } from '../../../../../../src/core/application/result-handler/result.handler'
import { Optional } from '@mono/types-utils'

export class LessonRepositoryMock implements LessonRepository {
    constructor(private lessons: Lesson[] = []) {}

    async save(lesson: Lesson): Promise<Result<Lesson>> {
        this.lessons = this.lessons.filter((e) => e.id !== lesson.id)
        this.lessons.push(lesson)
        return Result.success(lesson)
    }

    async erase(lesson: Lesson): Promise<Result<Lesson>> {
        this.lessons = this.lessons.filter((e) => e.id !== lesson.id)
        this.lessons.pop()
        return Result.success(lesson)
    }

    async getById(id: string): Promise<Optional<Lesson>> {
        return this.lessons.find((e) => e.id === id)
    }

    async existByName(name: string): Promise<boolean> {
        return this.lessons.some((e) => e.name === name)
    }

}
