import { ApplicationService } from 'src/core/application/service/application.service'
import { CountSubscriptionsByClientDTO } from './types/dto'
import { CountSubscriptionsByClientResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { SubscriptionRepository } from '../../repositories/subscription.repository'
import { ClientID } from 'src/subscription/domain/value-objects/client.id'

export class CountSubscriptionsByClientQuery
implements
        ApplicationService<
            CountSubscriptionsByClientDTO,
            CountSubscriptionsByClientResponse
        >
{
    constructor(private subscriptionRepository: SubscriptionRepository) {}
    async execute(
        data: CountSubscriptionsByClientDTO,
    ): Promise<Result<CountSubscriptionsByClientResponse>> {
        return Result.success({
            count: await this.subscriptionRepository.countByClient(
                new ClientID(data.client),
            ),
        })
    }
}
