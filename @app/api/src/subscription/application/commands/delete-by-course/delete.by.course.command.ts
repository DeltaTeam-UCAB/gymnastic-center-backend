import { ApplicationService } from 'src/core/application/service/application.service'
import { DeleteSubscriptionsByCourseDTO } from './types/dto'
import { Result } from 'src/core/application/result-handler/result.handler'
import { SubscriptionRepository } from '../../repositories/subscription.repository'
import { EventPublisher } from 'src/core/application/event-handler/event.handler'
import { CourseID } from 'src/subscription/domain/value-objects/course.id'

export class DeleteSubscriptionsByCourseCommand
    implements ApplicationService<DeleteSubscriptionsByCourseDTO, void>
{
    constructor(
        private subscriptionRepository: SubscriptionRepository,
        private eventPublisher: EventPublisher,
    ) {}
    async execute(data: DeleteSubscriptionsByCourseDTO): Promise<Result<void>> {
        const subscriptions = await this.subscriptionRepository.getAllByCourse(
            new CourseID(data.courseId),
        )
        const results = await subscriptions.asyncMap((subscription) => {
            subscription.delete()
            return this.subscriptionRepository.delete(subscription)
        })
        const possibleError = results.find((e) => e.isError())
        if (possibleError) return possibleError.convertToOther()
        const subscriptionsDeleted = results.map((e) => e.unwrap())
        this.eventPublisher.publish(
            subscriptionsDeleted.map((e) => e.pullEvents()).flat(),
        )
        return Result.success(undefined)
    }
}
