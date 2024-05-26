import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateLessonDTO } from './types/dto'
import { DeleteLessonResponse } from './types/response'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { LessonRepository } from '../../repositories/lesson.repository'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Lesson } from '../../models/lesson'
import { lessonNotExistError } from '../../errors/lesson.not.exist'

export class DeleteLessonCommand
implements ApplicationService<string, DeleteLessonResponse>
{
    constructor(
        private lessonRepository: LessonRepository,
    ) {}
    async execute(
        id: string,
    ): Promise<Result<DeleteLessonResponse>> {
        const lesson = await this.lessonRepository.getById(id)
        if (!lesson) return Result.error(lessonNotExistError())
        const result = await this.lessonRepository.erase(lesson)
        if (result.isError()) return result.convertToOther()
        return Result.success({
            id: lesson.id,
        })
    }
}
