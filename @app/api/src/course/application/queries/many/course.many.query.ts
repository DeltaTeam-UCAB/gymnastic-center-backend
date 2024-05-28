import { ApplicationService } from 'src/core/application/service/application.service'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CategoryRepository } from '../../repositories/category.repository'
import { TrainerRepository } from '../../repositories/trainer.repository'
import { ImageRepository } from '../../repositories/image.repository'
import { GetCoursesManyResponse } from './types/response'
import { GetCoursesManyDTO } from './types/dto'
import { CourseRepository } from '../../repositories/course.repository'

export class GetCoursesManyQuery
    implements ApplicationService<GetCoursesManyDTO, GetCoursesManyResponse>
{
    constructor(
        private courseRepo: CourseRepository,
        private categoryRepository: CategoryRepository,
        private trainerRepository: TrainerRepository,
        private imageRepository: ImageRepository,
    ) {}
    async execute(
        data: GetCoursesManyDTO,
    ): Promise<Result<GetCoursesManyResponse>> {
        const courses = await this.courseRepo.many(data)

        return Result.success(
            await courses.asyncMap(async (course) => ({
                id: course.id,
                title: course.title,
                description: course.description,
                date: course.date,
                category: (await this.categoryRepository.getById(
                    course.category,
                ))!.name,
                trainer: (await this.trainerRepository.getById(course.trainer))!
                    .name,
                image: (await this.imageRepository.getById(course.image))!.src,
            })),
        )
    }
}
