import { ApplicationService } from 'src/core/application/service/application.service'
import { RecomendTrainerCoursePolicyDTO } from './types/dto'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CreateNotificationDTO } from '../../commands/create/types/dto'
import { CreateNotificationResponse } from '../../commands/create/types/response'
import { CourseRepository } from '../../repositories/course.repository'
import { courseNotExist } from '../../errors/course.not.exist'
import { TrainerRepository } from '../../repositories/trainer.repository'
import { trainerNotFoundError } from '../../errors/trainer.not.found'

export class TrainerCourseRecomendationPolicy
    implements ApplicationService<RecomendTrainerCoursePolicyDTO, void>
{
    constructor(
        private notificationService: ApplicationService<
            CreateNotificationDTO,
            CreateNotificationResponse
        >,
        private courseRepository: CourseRepository,
        private trainerRepository: TrainerRepository,
    ) {}
    async execute(data: RecomendTrainerCoursePolicyDTO): Promise<Result<void>> {
        const course = await this.courseRepository.getById(data.courseId)
        if (!course) return Result.error(courseNotExist())
        const trainer = await this.trainerRepository.getById(data.trainerId)
        if (!trainer) return Result.error(trainerNotFoundError())
        const results = await trainer.followers.asyncMap((s) =>
            this.notificationService.execute({
                client: s,
                title: `News for ${trainer.name}`,
                body: `We have updates : ${trainer.name} has news in the course ${course.title}`,
            }),
        )
        const error = results.find((e) => e.isError())
        if (error) return error.convertToOther()
        return Result.success(undefined)
    }
}
