import { ApplicationService } from 'src/core/application/service/application.service'
import { RecomendCoursePolicyDTO } from './types/dto'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CreateNotificationDTO } from '../../commands/create/types/dto'
import { CreateNotificationResponse } from '../../commands/create/types/response'
import { CourseRepository } from '../../repositories/course.repository'
import { SubscriptionRepository } from '../../repositories/subscription.repository'
import { CategoryRepository } from '../../repositories/category.repository'
import { courseNotExist } from '../../errors/course.not.exist'
import { categoryNotExistError } from '../../errors/category.not.exist'

export class CourseRecomendationPolicy
    implements ApplicationService<RecomendCoursePolicyDTO, void>
{
    constructor(
        private notificationService: ApplicationService<
            CreateNotificationDTO,
            CreateNotificationResponse
        >,
        private courseRepository: CourseRepository,
        private subscriptionRepository: SubscriptionRepository,
        private categoryRepository: CategoryRepository,
    ) {}
    async execute(data: RecomendCoursePolicyDTO): Promise<Result<void>> {
        const course = await this.courseRepository.getById(data.courseId)
        if (!course) return Result.error(courseNotExist())
        const category = await this.categoryRepository.getById(data.categoryId)
        if (!category) return Result.error(categoryNotExistError())
        const subscribers = Object.keys(
            (
                await this.subscriptionRepository.getManyByCategory(
                    data.categoryId,
                )
            ).groupBy((e) => e.client),
        )
        const results = await subscribers.asyncMap((s) =>
            this.notificationService.execute({
                client: s,
                title: 'Course recomendation',
                body: `We have updates in the category: ${category.name} with the course ${course.title}`,
            }),
        )
        const error = results.find((e) => e.isError())
        if (error) return error.convertToOther()
        return Result.success(undefined)
    }
}
