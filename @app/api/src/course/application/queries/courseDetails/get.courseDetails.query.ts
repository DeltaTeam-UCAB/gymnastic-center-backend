import { GetCourseDetailsResponse } from './types/response'
import { GetCourseDetailsDTO } from './types/dto'
import { ApplicationService } from 'src/core/application/service/application.service'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CourseRepository } from '../../repositories/course.repository'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { courseNotExistError } from '../../errors/course.not.exist'
import { VideoRepository } from '../../repositories/video.repository'
import { ImageRepository } from '../../repositories/image.repository'
import { CourseID } from 'src/course/domain/value-objects/course.id'
import { LessonVideo } from 'src/course/domain/value-objects/lesson.video'
import { Video } from 'src/course/application/models/video'
import { imageNotExistError } from '../../errors/image.not.exist'

export class GetCourseDetailsQuery
    implements
        ApplicationService<GetCourseDetailsDTO, GetCourseDetailsResponse>
{
    constructor(
        private courseRepository: CourseRepository,
        private imageRepository: ImageRepository,
        private videoRepository: VideoRepository,
    ) {}
    async execute(
        data: GetCourseDetailsDTO,
    ): Promise<Result<GetCourseDetailsResponse>> {
        const course = await this.courseRepository.getById(
            new CourseID(data.id),
        )
        if (!isNotNull(course)) return Result.error(courseNotExistError())
        const image = await this.imageRepository.getById(course.image)
        if (!isNotNull(image)) return Result.error(imageNotExistError())

        return Result.success({
            tags: course.tags.map((t) => t.tag),
            level: course.level.level,
            id: course.id.id,
            title: course.title.title,
            description: course.description.description,
            trainer: {
                id: course.trainer.id.id,
                name: course.trainer.name.name,
            },
            category: course.category.name.name,
            date: course.creationDate.date,
            image: image.src,
            durationWeeks: course.duration.weeks,
            durationMinutes: course.duration.hours,
            lessons: await course.lessons.asyncMap(async (lesson, index) => ({
                id: lesson.id.id,
                title: lesson.title.title,
                content: lesson.content.content,
                video: (
                    (await this.videoRepository.getById(
                        new LessonVideo(lesson.video.video),
                    )) as Video
                ).src,
                order: index + 1,
            })),
        })
    }
}
