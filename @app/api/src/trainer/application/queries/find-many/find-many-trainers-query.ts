import { ApplicationService } from 'src/core/application/service/application.service'
import { FindManyTrainersResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { TrainerRepository } from '../../repositories/trainer.repository'
import { FindManyTrainerDTO } from './types/dto'
import { ClientID } from 'src/trainer/domain/value-objects/client.id'

export class FindManyTrainersQuery
    implements
        ApplicationService<FindManyTrainerDTO, FindManyTrainersResponse[]>
{
    constructor(private trainerRepo: TrainerRepository) {}

    async execute(
        data: FindManyTrainerDTO,
    ): Promise<Result<FindManyTrainersResponse[]>> {
        let trainers
        if (data.filterByFollowed) {
            trainers = await this.trainerRepo.getAllFilteredByFollowed(
                data.perPage,
                data.page,
                new ClientID(data.userId),
            )
        } else {
            trainers = await this.trainerRepo.getAll(data.perPage, data.page)
        }
        const clientId = new ClientID(data.userId)
        const trainersMapped = trainers.map((trainer) => ({
            id: trainer.id.id,
            name: trainer.name.name,
            location: trainer.location.location,
            followers: trainer.followers.length,
            userFollow: trainer.isFollowedBy(clientId),
        }))
        return Result.success(trainersMapped)
    }
}
