import { GetCourseDetailsResponse } from './types/response'
import { GetCourseDetailsDTO } from './types/dto'
import { ApplicationService } from 'src/core/application/service/application.service'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CourseRepository } from '../../repositories/course.repository'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { imageNotFoundError } from 'src/category/application/errors/image.not.found'
import { courseNotExistError } from '../../errors/course.not.exist'
import { VideoRepository } from '../../repositories/video.repository'
import { TrainerRepository } from '../../repositories/trainer.repository'
import { CategoryRepository } from '../../repositories/category.repository'
import { ImageRepository } from '../../repositories/image.repository'

export class GetCourseDetailsQuery
    implements
        ApplicationService<GetCourseDetailsDTO, GetCourseDetailsResponse>
{
    constructor(
        private courseRepository: CourseRepository,
        private imageRepository: ImageRepository,
        private videoRepository: VideoRepository,
        private trainerRepository: TrainerRepository,
        private categoryRepository: CategoryRepository,
    ) {}
    async execute(
        data: GetCourseDetailsDTO,
    ): Promise<Result<GetCourseDetailsResponse>> {
        const course = await this.courseRepository.getById(data.id)
        if (!isNotNull(course)) return Result.error(courseNotExistError())
        const image = await this.imageRepository.getById(course.image)
        if (!isNotNull(image)) return Result.error(imageNotFoundError())
        const category = await this.categoryRepository.getById(course.category)
        const trainer = await this.trainerRepository.getById(course.trainer)

        const getOptionalImage = async (image?: string) =>
            image ? (await this.imageRepository.getById(image))?.src : undefined

        const getOptionalVideo = async (video?: string) =>
            video ? (await this.videoRepository.getById(video))?.src : undefined

        return Result.success({
            tags: course.tags,
            level: course.level,
            id: course.id,
            title: course.title,
            description: course.description,
            trainer: trainer!,
            category: category!.name,
            image: image.src,
            lessons: await course.lessons.asyncMap(async (lesson) => ({
                ...lesson,
                image: await getOptionalImage(lesson.image),
                video: await getOptionalVideo(lesson.video),
            })),
        })
    }
}
