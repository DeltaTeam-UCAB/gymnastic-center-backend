import { ApplicationService } from 'src/core/application/service/application.service'
import { FindTrainerResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { TrainerRepository } from '../../repositories/trainer.repository'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { trainerNotFoundError } from '../../errors/trainer.not.found'
import { FindTrainerDTO } from './types/dto'
import { ClientID } from 'src/trainer/domain/value-objects/client.id'
import { TrainerID } from 'src/trainer/domain/value-objects/trainer.id'

export class FindTrainerQuery
    implements ApplicationService<FindTrainerDTO, FindTrainerResponse>
{
    constructor(private trainerRepo: TrainerRepository) {}

    async execute(data: FindTrainerDTO): Promise<Result<FindTrainerResponse>> {
        const trainer = await this.trainerRepo.getById(
            new TrainerID(data.trainerId),
        )
        if (!isNotNull(trainer)) return Result.error(trainerNotFoundError())
        return Result.success({
            id: trainer.id.id,
            name: trainer.name.name,
            location: trainer.location.location,
            followers: trainer.followers.length,
            userFollow: trainer.isFollowedBy(new ClientID(data.userId)),
        })
    }
}
