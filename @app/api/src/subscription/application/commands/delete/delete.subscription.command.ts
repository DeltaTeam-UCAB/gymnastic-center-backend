import { ApplicationService } from 'src/core/application/service/application.service'
import { DeleteSubscriptionDTO } from './types/dto'
import { DeleteSubscriptionResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { SubscriptionRepository } from '../../repositories/subscription.repository'
import { EventPublisher } from 'src/core/application/event-handler/event.handler'
import { CourseID } from 'src/subscription/domain/value-objects/course.id'
import { ClientID } from 'src/subscription/domain/value-objects/client.id'
import { subscriptionNotFound } from '../../errors/subscription.not.found'

export class DeleteSubscriptionCommand
implements
        ApplicationService<DeleteSubscriptionDTO, DeleteSubscriptionResponse>
{
    constructor(
        private subscriptionRepository: SubscriptionRepository,
        private eventPublisher: EventPublisher,
    ) {}
    async execute(
        data: DeleteSubscriptionDTO,
    ): Promise<Result<DeleteSubscriptionResponse>> {
        const subscription =
            await this.subscriptionRepository.getByCourseAndClient(
                new CourseID(data.course),
                new ClientID(data.client),
            )
        if (!subscription) return Result.error(subscriptionNotFound())
        subscription.delete()
        const result = await this.subscriptionRepository.delete(subscription)
        if (result.isError()) return result.convertToOther()
        this.eventPublisher.publish(subscription.pullEvents())
        return Result.success({
            id: subscription.id.id,
        })
    }
}
