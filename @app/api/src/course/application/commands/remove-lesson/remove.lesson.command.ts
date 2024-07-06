import { ApplicationService } from 'src/core/application/service/application.service'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CourseRepository } from '../../repositories/course.repository'
import { EventPublisher } from 'src/core/application/event-handler/event.handler'
import { CourseID } from 'src/course/domain/value-objects/course.id'
import { courseNotExistError } from '../../errors/course.not.exist'
import { LessonID } from 'src/course/domain/value-objects/lesson.id'
import { RemoveLessonDTO } from './types/dto'
import { RemoveLessonResponse } from './types/response'

export class RemoveLessonCommand
implements ApplicationService<RemoveLessonDTO, RemoveLessonResponse>
{
    constructor(
        private courseRepository: CourseRepository,
        private eventPublisher: EventPublisher,
    ) {}
    async execute(
        data: RemoveLessonDTO,
    ): Promise<Result<RemoveLessonResponse>> {
        const course = await this.courseRepository.getById(
            new CourseID(data.courseId),
        )
        if (!course) return Result.error(courseNotExistError())
        course.removeLesson(new LessonID(data.lessonId))
        const result = await this.courseRepository.save(course)
        if (result.isError()) return result.convertToOther()
        this.eventPublisher.publish(course.pullEvents())
        return Result.success({
            id: course.id.id,
        })
    }
}
