import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateTrainerDto } from './types/dto'
import { CreateTrainerResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { TrainerRepository } from '../../repositories/trainer.repository'
import { Trainer } from '../../models/trainer'

export class CreateTrainerCommand
    implements ApplicationService<CreateTrainerDto, CreateTrainerResponse>
{
    constructor(
        private idGenerator: IDGenerator<string>,
        private trainerRepository: TrainerRepository,
    ) {}
    async execute(
        data: CreateTrainerDto,
    ): Promise<Result<CreateTrainerResponse>> {
        const trainerId = this.idGenerator.generate()
        const trainer = {
            id: trainerId,
            ...data,
            followers: [],
        } satisfies Trainer
        const result = await this.trainerRepository.save(trainer)
        if (result.isError()) return result.convertToOther()
        return Result.success({
            id: trainerId,
        })
    }
}
