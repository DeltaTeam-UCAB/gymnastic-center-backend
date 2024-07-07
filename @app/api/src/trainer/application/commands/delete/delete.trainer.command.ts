import { ApplicationService } from 'src/core/application/service/application.service'
import { DeleteTrainerDTO } from './types/dto'
import { DeleteTrainerResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { TrainerRepository } from '../../repositories/trainer.repository'
import { TrainerID } from 'src/trainer/domain/value-objects/trainer.id'
import { trainerNotFoundError } from '../../errors/trainer.not.found'
import { EventPublisher } from 'src/core/application/event-handler/event.handler'

export class DeleteTrainerCommand
    implements ApplicationService<DeleteTrainerDTO, DeleteTrainerResponse>
{
    constructor(
        private trainerRepository: TrainerRepository,
        private eventPublisher: EventPublisher,
    ) {}

    async execute(
        data: DeleteTrainerDTO,
    ): Promise<Result<DeleteTrainerResponse>> {
        const trainer = await this.trainerRepository.getById(
            new TrainerID(data.id),
        )
        if (!trainer) return Result.error(trainerNotFoundError())
        trainer.delete()
        await this.trainerRepository.delete(trainer)
        this.eventPublisher.publish(trainer.pullEvents())
        return Result.success({ id: trainer.id.id })
    }
}
