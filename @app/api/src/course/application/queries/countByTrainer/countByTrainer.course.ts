import { ApplicationService } from 'src/core/application/service/application.service'
import { CountCoursesDTO } from './types/dto'
import { CountCoursesResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CourseRepository } from '../../repositories/course.repository'
import { TrainerID } from 'src/course/domain/value-objects/trainer.id'
import { CategoryID } from 'src/course/domain/value-objects/category.id'

export class CountCoursesQuery
    implements ApplicationService<CountCoursesDTO, CountCoursesResponse>
{
    constructor(private courseRepository: CourseRepository) {}

    async execute(
        data: CountCoursesDTO,
    ): Promise<Result<CountCoursesResponse>> {
        let count: number = 0

        if (data.category)
            count = await this.courseRepository.countByCategory(
                new CategoryID(data.category),
            )
        else if (data.trainer)
            count = await this.courseRepository.countByTrainer(
                new TrainerID(data.trainer),
            )

        return Result.success({
            count,
        })
    }
}
