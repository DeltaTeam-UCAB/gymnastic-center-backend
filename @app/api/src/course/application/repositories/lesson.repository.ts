import { Result } from 'src/core/application/result-handler/result.handler'
import { Lesson } from '../models/lesson'
import { Optional } from '@mono/types-utils'

export interface LessonRepository {
    save(lesson: Lesson): Promise<Result<Lesson>>
    getById(id: string): Promise<Optional<Lesson>>
    existByName(name: string): Promise<boolean>
}