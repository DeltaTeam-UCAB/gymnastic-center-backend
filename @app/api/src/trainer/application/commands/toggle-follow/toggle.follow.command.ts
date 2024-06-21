import { ApplicationService } from 'src/core/application/service/application.service'
import { ToggleFollowDTO } from './types/dto'
import { ToggleFollowResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { TrainerRepository } from '../../repositories/trainer.repository'
import { ClientID } from 'src/trainer/domain/value-objects/client.id'
import { TrainerID } from 'src/trainer/domain/value-objects/trainer.id'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { trainerNotFoundError } from '../../errors/trainer.not.found'

export class ToggleFolowCommand
    implements ApplicationService<ToggleFollowDTO, ToggleFollowResponse>
{
    constructor(private trainerRepo: TrainerRepository) {}

    async execute(
        data: ToggleFollowDTO,
    ): Promise<Result<ToggleFollowResponse>> {
        const trainerId = new TrainerID(data.trainerId)
        const trainer = await this.trainerRepo.getById(trainerId)
        if (!isNotNull(trainer)) return Result.error(trainerNotFoundError())
        const clientId = new ClientID(data.userId)
        const userFollow = trainer.isFollowedBy(clientId)
        let result: Result<boolean>
        if (userFollow) {
            trainer.removeFollower(clientId)
            result = await this.trainerRepo.unfollowTrainer(clientId, trainerId)
        } else {
            trainer.addFollower(clientId)
            result = await this.trainerRepo.followTrainer(clientId, trainerId)
        }
        if (result.isError()) return result.convertToOther()
        return Result.success({ userFollow: !userFollow })
    }
}
