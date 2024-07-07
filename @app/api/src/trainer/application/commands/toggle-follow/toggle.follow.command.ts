import { ApplicationService } from 'src/core/application/service/application.service'
import { ToggleFollowDTO } from './types/dto'
import { ToggleFollowResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { TrainerRepository } from '../../repositories/trainer.repository'
import { ClientID } from 'src/trainer/domain/value-objects/client.id'
import { TrainerID } from 'src/trainer/domain/value-objects/trainer.id'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { trainerNotFoundError } from '../../errors/trainer.not.found'
import { EventPublisher } from 'src/core/application/event-handler/event.handler'

export class ToggleFolowCommand
    implements ApplicationService<ToggleFollowDTO, ToggleFollowResponse>
{
    constructor(
        private trainerRepo: TrainerRepository,
        private eventPublisher: EventPublisher,
    ) {}

    async execute(
        data: ToggleFollowDTO,
    ): Promise<Result<ToggleFollowResponse>> {
        const trainerId = new TrainerID(data.trainerId)
        const trainer = await this.trainerRepo.getById(trainerId)
        if (!isNotNull(trainer)) return Result.error(trainerNotFoundError())
        const clientId = new ClientID(data.userId)
        const userFollow = trainer.isFollowedBy(clientId)
        if (userFollow) {
            trainer.removeFollower(clientId)
        } else {
            trainer.addFollower(clientId)
        }
        const result = await this.trainerRepo.save(trainer)
        if (result.isError()) return result.convertToOther()
        this.eventPublisher.publish(trainer.pullEvents())
        return Result.success({ userFollow: !userFollow })
    }
}
