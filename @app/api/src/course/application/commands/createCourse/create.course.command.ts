import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateCourseDTO } from './types/dto'
import { CreateCourseResponse } from './types/response'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { CourseRepository } from '../../repositories/course.repository'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Course } from '../../models/course'
import { DateProvider } from 'src/core/application/date/date.provider'

export class CreateCourseCommand
    implements ApplicationService<CreateCourseDTO, CreateCourseResponse>
{
    constructor(
        private idGenerator: IDGenerator<string>,
        private courseRepository: CourseRepository,
        private dateProvider: DateProvider,
    ) {}
    async execute(
        data: CreateCourseDTO,
    ): Promise<Result<CreateCourseResponse>> {
        const courseId = this.idGenerator.generate()
        const course = {
            ...data,
            id: courseId,
            date: this.dateProvider.current,
            lessons: data.lessons.map((e) => ({
                ...e,
                id: this.idGenerator.generate(),
            })),
        } satisfies Course
        const result = await this.courseRepository.save(course)
        if (result.isError()) return result.convertToOther()
        return Result.success({
            id: courseId,
        })
    }
}
