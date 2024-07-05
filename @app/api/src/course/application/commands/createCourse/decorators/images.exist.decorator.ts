import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateCourseDTO } from '../types/dto'
import { CreateCourseResponse } from '../types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { ImageRepository } from 'src/course/application/repositories/image.repository'
import { imageNotExistError } from 'src/course/application/errors/image.not.exist'
import { CourseImage } from 'src/course/domain/value-objects/course.image'

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
        const imageExist = await this.imageRepository.existById(
            new CourseImage(data.image),
        )

        if (!imageExist) return Result.error(imageNotExistError())
        return this.service.execute(data)
    }
}
