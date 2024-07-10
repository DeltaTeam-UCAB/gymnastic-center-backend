import { ApplicationService } from 'src/core/application/service/application.service'
import { Result } from 'src/core/application/result-handler/result.handler'
import { ImageRepository } from '../../repositories/image.repository'
import { GetCoursesManyResponse } from './types/response'
import { GetCoursesManyDTO } from './types/dto'
import { CourseRepository } from '../../repositories/course.repository'

export class SearchCoursesQuery
implements ApplicationService<GetCoursesManyDTO, GetCoursesManyResponse>
{
    constructor(
        private courseRepo: CourseRepository,
        private imageRepository: ImageRepository,
    ) {}
    async execute(
        data: GetCoursesManyDTO,
    ): Promise<Result<GetCoursesManyResponse>> {
        const courses = await this.courseRepo.getMany(data)

        return Result.success(
            await courses.asyncMap(async (course) => ({
                id: course.id,
                title: course.title,
                date: course.date,
                category: course.category,
                trainer: course.trainer,
                image: (await this.imageRepository.getById(course.image))!.src,
            })),
        )
    }
}
