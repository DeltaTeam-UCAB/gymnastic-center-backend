import { ApplicationService } from 'src/core/application/service/application.service'
import { Result } from 'src/core/application/result-handler/result.handler'
import { ImageRepository } from '../../repositories/image.repository'
import { GetCoursesManyResponse } from './types/response'
import { GetCoursesManyDTO } from './types/dto'
import { CourseRepository } from '../../repositories/course.repository'
import { CategoryID } from 'src/course/domain/value-objects/category.id'
import { TrainerID } from 'src/course/domain/value-objects/trainer.id'

export class GetCoursesManyQuery
    implements ApplicationService<GetCoursesManyDTO, GetCoursesManyResponse>
{
    constructor(
        private courseRepo: CourseRepository,
        private imageRepository: ImageRepository,
    ) {}
    async execute(
        data: GetCoursesManyDTO,
    ): Promise<Result<GetCoursesManyResponse>> {
        const courses = await this.courseRepo.many({
            page: data.page,
            perPage: data.perPage,
            category: data.category ? new CategoryID(data.category) : undefined,
            trainer: data.trainer ? new TrainerID(data.trainer) : undefined,
        })

        return Result.success(
            await courses.asyncMap(async (course) => ({
                id: course.id.id,
                title: course.title.title,
                description: course.description.description,
                date: course.creationDate.date,
                category: course.category.name.name,
                trainer: course.trainer.name.name,
                image: (await this.imageRepository.getById(course.image))!.src,
            })),
        )
    }
}
