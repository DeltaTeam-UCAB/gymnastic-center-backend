import { ApplicationService } from 'src/core/application/service/application.service'
import { AddLessonDTO } from './types/dto'
import { AddLessonResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CourseRepository } from '../../repositories/course.repository'
import { VideoRepository } from '../../repositories/video.repository'
import { EventPublisher } from 'src/core/application/event-handler/event.handler'
import { CourseID } from 'src/course/domain/value-objects/course.id'
import { courseNotExistError } from '../../errors/course.not.exist'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { Lesson } from 'src/course/domain/entities/lesson'
import { LessonID } from 'src/course/domain/value-objects/lesson.id'
import { LessonTitle } from 'src/course/domain/value-objects/lesson.title'
import { LessonContent } from 'src/course/domain/value-objects/lesson.content'
import { LessonVideo } from 'src/course/domain/value-objects/lesson.video'
import { videoNotExistError } from '../../errors/video.not.exist'

export class AddLessonCommand
    implements ApplicationService<AddLessonDTO, AddLessonResponse>
{
    constructor(
        private idGenerator: IDGenerator<string>,
        private courseRepository: CourseRepository,
        private videoRepository: VideoRepository,
        private eventPublisher: EventPublisher,
    ) {}
    async execute(data: AddLessonDTO): Promise<Result<AddLessonResponse>> {
        const course = await this.courseRepository.getById(
            new CourseID(data.courseId),
        )
        if (!course) return Result.error(courseNotExistError())
        if (
            !(await this.videoRepository.existById(new LessonVideo(data.video)))
        )
            return Result.error(videoNotExistError())
        course.addLesson(
            new Lesson(new LessonID(this.idGenerator.generate()), {
                title: new LessonTitle(data.title),
                content: new LessonContent(data.content),
                video: new LessonVideo(data.video),
            }),
        )
        const result = await this.courseRepository.save(course)
        if (result.isError()) return result.convertToOther()
        this.eventPublisher.publish(course.pullEvents())
        return Result.success({
            id: course.id.id,
        })
    }
}
