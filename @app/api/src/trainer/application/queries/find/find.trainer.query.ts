import { ApplicationService } from 'src/core/application/service/application.service'
import { FindTrainerResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { TrainerRepository } from '../../repositories/trainer.repository'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { trainerNotFoundError } from '../../errors/trainer.not.found'
import { FindTrainerDTO } from './types/dto'

export class FindTrainerQuery
    implements ApplicationService<FindTrainerDTO, FindTrainerResponse>
{
    constructor(private trainerRepo: TrainerRepository) {}

    async execute(data: FindTrainerDTO): Promise<Result<FindTrainerResponse>> {
        const trainer = await this.trainerRepo.getById(data.trainerId)
        if (!isNotNull(trainer)) return Result.error(trainerNotFoundError())
        const userFollow = trainer.followers.includes(data.userId)
        const followers = trainer.followers.length
        return Result.success({
            id: trainer.id,
            name: trainer.name,
            location: trainer.location,
            followers: followers,
            userFollow: userFollow,
        })
    }
}
