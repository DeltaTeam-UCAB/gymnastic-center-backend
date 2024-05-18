import { ApplicationService } from 'src/core/application/service/application.service'
import { FindTrainerResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { TrainerRepository } from '../../repositories/trainer.repository'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { trainerNotFoundError } from '../../errors/trainer.not.found'

export class FindTrainerQuery
    implements ApplicationService<string, FindTrainerResponse>
{
    constructor(private trainerRepo: TrainerRepository) {}

    async execute(data: string): Promise<Result<FindTrainerResponse>> {
        const trainer = await this.trainerRepo.getById(data)
        if (!isNotNull(trainer)) return Result.error(trainerNotFoundError())
        return Result.success({
            id: trainer.id,
            name: trainer.name,
            location: trainer.location,
        })
    }
}
