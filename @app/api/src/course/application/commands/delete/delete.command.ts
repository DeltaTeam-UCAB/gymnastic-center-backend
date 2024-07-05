import { ApplicationService } from 'src/core/application/service/application.service'
import { DeleteCourseDTO } from './types/dto'
import { DeleteCourseResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CourseRepository } from '../../repositories/course.repository'
import { EventPublisher } from 'src/core/application/event-handler/event.handler'
import { CourseID } from 'src/course/domain/value-objects/course.id'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { courseNotExistError } from '../../errors/course.not.exist'

export class DeleteCourseCommand
implements ApplicationService<DeleteCourseDTO, DeleteCourseResponse>
{
    constructor(
        private courseRepository: CourseRepository,
        private eventPublisher: EventPublisher,
    ) {}
    async execute(
        data: DeleteCourseDTO,
    ): Promise<Result<DeleteCourseResponse>> {
        const course = await this.courseRepository.getById(
            new CourseID(data.id),
        )
        if (!isNotNull(course)) return Result.error(courseNotExistError())
        course.delete()
        const res = await this.courseRepository.delete(course)
        if (res.isError()) return res.convertToOther()
        this.eventPublisher.publish(course.pullEvents())
        return Result.success({
            id: course.id.id,
        })
    }
}
