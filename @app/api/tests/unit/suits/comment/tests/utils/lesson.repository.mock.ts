import { LessonRepository } from '../../../../../../src/comment/application/repositories/lesson.repository'

export class LessonRepositoryMock implements LessonRepository {
    constructor(private lessons: string[] = []) {}

    async existsById(id: string): Promise<boolean> {
        const exists = this.lessons.includes(id)
        return exists
    }
}
