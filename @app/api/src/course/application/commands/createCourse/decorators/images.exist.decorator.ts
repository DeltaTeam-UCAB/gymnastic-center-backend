import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateCourseDTO } from '../types/dto'
import { CreateCourseResponse } from '../types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { ImageRepository } from 'src/course/application/repositories/image.repository'
import { imageNotExistError } from 'src/course/application/errors/image.not.exist'

export class ImagesExistDecorator
implements ApplicationService<CreateCourseDTO, CreateCourseResponse>
{
    constructor(
        private service: ApplicationService<
            CreateCourseDTO,
            CreateCourseResponse
        >,
        private imageRepository: ImageRepository,
    ) {}
    async execute(
        data: CreateCourseDTO,
    ): Promise<Result<CreateCourseResponse>> {
        const imageExist = await this.imageRepository.existById(data.image)
        const imagesExist = await data.lessons
            .filter((e) => e.image)
            .asyncMap(async (lesson) =>
                this.imageRepository.existById(lesson.image!),
            )
        if (!imageExist || imagesExist.some((e) => !e))
            return Result.error(imageNotExistError())
        return this.service.execute(data)
    }
}
