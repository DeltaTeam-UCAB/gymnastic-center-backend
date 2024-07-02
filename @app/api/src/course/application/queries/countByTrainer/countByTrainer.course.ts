import { ApplicationService } from 'src/core/application/service/application.service'
import { CountByTrainerCourseDTO } from './types/dto'
import { CountByTrainerCourseResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CourseRepository } from '../../repositories/course.repository'
import { TrainerID } from 'src/course/domain/value-objects/trainer.id'

export class CountByTrainerCourseQuery
    implements
        ApplicationService<
            CountByTrainerCourseDTO,
            CountByTrainerCourseResponse
        >
{
    constructor(private courseRepository: CourseRepository) {}

    async execute(
        data: CountByTrainerCourseDTO,
    ): Promise<Result<CountByTrainerCourseResponse>> {
        return Result.success({
            courses: await this.courseRepository.countByTrainer(
                new TrainerID(data.trainer),
            ),
        })
    }
}
