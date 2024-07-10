import { ApplicationService } from 'src/core/application/service/application.service'
import { CountClientFollowsDTO } from './types/dto'
import { CountClientFollowsResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { TrainerRepository } from '../../repositories/trainer.repository'
import { ClientID } from 'src/trainer/domain/value-objects/client.id'

export class CountClientFollowsQuery
implements
        ApplicationService<CountClientFollowsDTO, CountClientFollowsResponse>
{
    constructor(private trainerRepository: TrainerRepository) {}
    async execute(
        data: CountClientFollowsDTO,
    ): Promise<Result<CountClientFollowsResponse>> {
        return Result.success({
            count: await this.trainerRepository.countFollowsByClient(
                new ClientID(data.clientId),
            ),
        })
    }
}
