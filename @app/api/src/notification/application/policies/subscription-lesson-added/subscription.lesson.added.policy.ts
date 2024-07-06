import { Result } from 'src/core/application/result-handler/result.handler'
import { ApplicationService } from 'src/core/application/service/application.service'
import { SubscriptionRepository } from '../../repositories/subscription.repository'
import { CourseRepository } from '../../repositories/course.repository'
import { subscriptionNotFound } from '../../errors/subscription.not.found'
import { courseNotExist } from '../../errors/course.not.exist'
import { CreateNotificationDTO } from '../../commands/create/types/dto'
import { CreateNotificationResponse } from '../../commands/create/types/response'

export class SubscriptionLessonAddedPolicy
    implements ApplicationService<string, void>
{
    constructor(
        private service: ApplicationService<
            CreateNotificationDTO,
            CreateNotificationResponse
        >,
        private subscriptionRepository: SubscriptionRepository,
        private courseRepository: CourseRepository,
    ) {}
    async execute(data: string): Promise<Result<void>> {
        const subscription = await this.subscriptionRepository.getById(data)
        if (!subscription) return Result.error(subscriptionNotFound())
        const course = await this.courseRepository.getById(subscription.course)
        if (!course) return Result.error(courseNotExist())
        const result = await this.service.execute({
            client: subscription.client,
            title: 'New challengs',
            body: `The course: ${course.title} has a new lesson`,
        })
        if (result.isError()) return result.convertToOther()
        return Result.success(undefined)
    }
}
