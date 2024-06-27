import { Result } from 'src/core/application/result-handler/result.handler'
import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateNotificationDTO } from '../../commands/create/types/dto'
import { CreateNotificationResponse } from '../../commands/create/types/response'
import { SubscriptionRepository } from '../../repositories/subscription.repository'
import { subscriptionNotFound } from '../../errors/subscription.not.found'
import { insufficientProgress } from '../../errors/insufficient.progress'
import { CourseRepository } from '../../repositories/course.repository'
import { courseNotExist } from '../../errors/course.not.exist'

export class CourseCompletePolicy implements ApplicationService<string, void> {
    constructor(
        private notificationService: ApplicationService<
            CreateNotificationDTO,
            CreateNotificationResponse
        >,
        private subscriptionRepository: SubscriptionRepository,
        private courseRepository: CourseRepository,
    ) {}
    async execute(data: string): Promise<Result<void>> {
        const subscription = await this.subscriptionRepository.getById(data)
        if (!subscription) return Result.error(subscriptionNotFound())
        if (subscription.percent < 100)
            return Result.error(insufficientProgress())
        const course = await this.courseRepository.getById(subscription.course)
        if (!course) return Result.error(courseNotExist())
        const result = await this.notificationService.execute({
            body: `Congratulations!!! You finished the course: ${course.title}`,
            title: 'Course finished',
            client: subscription.client,
        })
        if (result.isError()) return result.convertToOther()
        return Result.success(undefined)
    }
}
