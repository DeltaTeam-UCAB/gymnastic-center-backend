import { LessonID } from 'src/comment/domain/value-objects/lesson.id'

export interface LessonRepository {
    existsById(id: LessonID): Promise<boolean>
}
