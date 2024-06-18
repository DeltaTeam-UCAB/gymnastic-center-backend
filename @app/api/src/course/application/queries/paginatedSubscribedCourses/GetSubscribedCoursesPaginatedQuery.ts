import { ApplicationService } from 'src/core/application/service/application.service'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CategoryRepository } from '../../repositories/category.repository'
import { CourseRepository } from '../../repositories/course.repository'
import { ImageRepository } from '../../repositories/image.repository'
import { SubscriptionRepository } from '../../repositories/subscription.repository'
import { TrainerRepository } from '../../repositories/trainer.repository'
import { GetSubscribedCoursesDTO } from './types/dto'
import { GetSubscribedCoursesResponse } from './types/response'
import { isNotNull } from 'src/utils/null-manager/null-checker'

export class GetSubscribedCoursesPaginatedQuery
    implements
        ApplicationService<
            GetSubscribedCoursesDTO,
            GetSubscribedCoursesResponse
        >
{
    constructor(
        private courseRepo: CourseRepository,
        private trainerRepository: TrainerRepository,
        private categoryRepo: CategoryRepository,
        private imageRepository: ImageRepository,
        private suscriptionRepo: SubscriptionRepository,
    ) {}
    async execute(
        data: GetSubscribedCoursesDTO,
    ): Promise<Result<GetSubscribedCoursesResponse>> {
        const subscriptions = await this.suscriptionRepo.getManyByClientID(data)

        const courses = await subscriptions
            .asyncMap((subscription) =>
                this.courseRepo.getById(subscription.course),
            )
            .filter((e) => isNotNull(e))

        return Result.success(
            await courses.asyncMap(async (course) => ({
                id: course!.id,
                title: course!.title,
                description: course!.description,
                date: course!.date,
                category: (await this.categoryRepo.getById(course!.category))!
                    .name,
                trainer: (await this.trainerRepository.getById(
                    course!.trainer,
                ))!.name,
                image: (await this.imageRepository.getById(course!.image))!.src,
                progress: (await this.suscriptionRepo.getByCourseID(
                    course!.id,
                ))!.progress,
            })),
        )
    }
}
