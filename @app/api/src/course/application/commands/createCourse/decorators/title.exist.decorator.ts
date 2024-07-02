import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateCourseDTO } from '../types/dto'
import { CreateCourseResponse } from '../types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CourseRepository } from 'src/course/application/repositories/course.repository'
import { courseTitleExistError } from 'src/course/application/errors/course.title.exist'
import { CourseTitle } from 'src/course/domain/value-objects/course.title'

export class CourseTitleNotExistDecorator
    implements ApplicationService<CreateCourseDTO, CreateCourseResponse>
{
    constructor(
        private service: ApplicationService<
            CreateCourseDTO,
            CreateCourseResponse
        >,
        private courseRepository: CourseRepository,
    ) {}
    async execute(
        data: CreateCourseDTO,
    ): Promise<Result<CreateCourseResponse>> {
        const isTitleExist = await this.courseRepository.existByTitle(
            new CourseTitle(data.title),
        )
        if (
            isTitleExist ||
            Object.values(data.lessons.groupBy((e) => e.title)).some(
                (e) => e.length > 1,
            )
        )
            return Result.error(courseTitleExistError())
        return this.service.execute(data)
    }
}
