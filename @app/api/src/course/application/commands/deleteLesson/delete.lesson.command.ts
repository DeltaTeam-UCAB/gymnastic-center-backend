import { ApplicationService } from 'src/core/application/service/application.service'
import { DeleteLessonResponse } from './types/response'
import { LessonRepository } from '../../repositories/lesson.repository'
import { Result } from 'src/core/application/result-handler/result.handler'
import { lessonNotExistError } from '../../errors/lesson.not.exist'

export class DeleteLessonCommand
implements ApplicationService<string, DeleteLessonResponse>
{
    constructor(private lessonRepository: LessonRepository) {}
    async execute(id: string): Promise<Result<DeleteLessonResponse>> {
        const lesson = await this.lessonRepository.getById(id)
        if (!lesson) return Result.error(lessonNotExistError())
        const result = await this.lessonRepository.erase(lesson)
        if (result.isError()) return result.convertToOther()
        return Result.success({
            id: lesson.id,
        })
    }
}
