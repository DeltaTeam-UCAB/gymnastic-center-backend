import { ApplicationService } from 'src/core/application/service/application.service'
import { ToggleFollowDTO } from './types/dto'
import { ToggleFollowResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { TrainerRepository } from '../../repositories/trainer.repository'
import { FindTrainerDTO } from '../../queries/find/types/dto'
import { FindTrainerResponse } from '../../queries/find/types/response'

export class ToggleFolowCommand
    implements ApplicationService<ToggleFollowDTO, ToggleFollowResponse>
{
    constructor(
        private trainerRepo: TrainerRepository,
        private findTrainerService: ApplicationService<
            FindTrainerDTO,
            FindTrainerResponse
        >,
    ) {}

    async execute(
        data: ToggleFollowDTO,
    ): Promise<Result<ToggleFollowResponse>> {
        const trainer = await this.findTrainerService.execute(data)
        if (trainer.isError()) return trainer.convertToOther()
        const userFollow = trainer.unwrap().userFollow
        let result: Result<boolean>
        if (userFollow)
            result = await this.trainerRepo.unfollowTrainer(
                data.userId,
                data.trainerId,
            )
        else
            result = await this.trainerRepo.followTrainer(
                data.userId,
                data.trainerId,
            )
        if (result.isError()) return result.convertToOther()
        return Result.success({ userFollow: !userFollow })
    }
}
