import { LessonRepository } from '../../../../../../src/comment/application/repositories/lesson.repository'
import { LessonID } from '../../../../../../src/comment/domain/value-objects/lesson.id'

export class LessonRepositoryMock implements LessonRepository {
    constructor(private lessons: string[] = []) {}

    async existsById(id: LessonID): Promise<boolean> {
        const exists = this.lessons.includes(id.id)
        return exists
    }
}
