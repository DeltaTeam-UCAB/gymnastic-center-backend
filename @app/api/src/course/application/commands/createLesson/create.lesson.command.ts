import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateLessonDTO } from './types/dto'
import { CreateLessonResponse } from './types/response'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { LessonRepository } from '../../repositories/lesson.repository'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Lesson } from '../../models/lesson'
import { lessonNameExistError } from '../../errors/lesson.name.exist'

export class CreateLessonCommand
implements ApplicationService<CreateLessonDTO, CreateLessonResponse>
{
    constructor(
        private idGenerator: IDGenerator<string>,
        private lessonRepository: LessonRepository,
    ) {}
    async execute(
        data: CreateLessonDTO,
    ): Promise<Result<CreateLessonResponse>> {
        const isNameExist = await this.lessonRepository.existByName(
            data.name,
        )
        if (isNameExist) return Result.error(lessonNameExistError())
        const lessonId = this.idGenerator.generate()
        const lesson = {
            ...data,
            id: lessonId,
        } satisfies Lesson
        const result = await this.lessonRepository.save(lesson)
        if (result.isError()) return result.convertToOther()
        return Result.success({
            id: lessonId,
        })
    }
}
