import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateTrainerDto } from './types/dto'
import { CreateTrainerResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { TrainerRepository } from '../../repositories/trainer.repository'
import { Trainer } from 'src/trainer/domain/trainer'
import { trainerNameInvalidError } from '../../errors/trainer.name.invalid'
import { TrainerID } from 'src/trainer/domain/value-objects/trainer.id'
import { TrainerName } from 'src/trainer/domain/value-objects/trainer.name'
import { TrainerLocation } from 'src/trainer/domain/value-objects/trainer.location'

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
        const isTrainerName = await this.trainerRepository.existByName(
            new TrainerName(data.name),
        )
        if (isTrainerName) return Result.error(trainerNameInvalidError())
        const trainerId = this.idGenerator.generate()
        const trainer = new Trainer(new TrainerID(trainerId), {
            name: new TrainerName(data.name),
            location: new TrainerLocation(data.location),
        })
        const result = await this.trainerRepository.save(trainer)
        if (result.isError()) return result.convertToOther()
        return Result.success({
            id: trainerId,
        })
    }
}
