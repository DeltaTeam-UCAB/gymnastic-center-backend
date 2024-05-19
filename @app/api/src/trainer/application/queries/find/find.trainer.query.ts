import { ApplicationService } from 'src/core/application/service/application.service'
import { FindTrainerResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { TrainerRepository } from '../../repositories/trainer.repository'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { trainerNotFoundError } from '../../errors/trainer.not.found'
import { FindTrainerDTO } from './types/dto'
import { fetchFollowersFailedError } from '../../errors/fetch.followers.failed'
import { fetchUserFollowFailedError } from '../../errors/fetch.user.follow.failed'

export class FindTrainerQuery
    implements ApplicationService<FindTrainerDTO, FindTrainerResponse>
{
    constructor(private trainerRepo: TrainerRepository) {}

    async execute(data: FindTrainerDTO): Promise<Result<FindTrainerResponse>> {
        const trainer = await this.trainerRepo.getById(data.trainerId)
        if (!isNotNull(trainer)) return Result.error(trainerNotFoundError())
        const followers = await this.trainerRepo.getFollowers(data.trainerId)
        if (!isNotNull(followers))
            return Result.error(fetchFollowersFailedError())
        const userFollow = await this.trainerRepo.isUserFollowing(
            data.userId,
            data.trainerId,
        )
        if (!isNotNull(userFollow))
            return Result.error(fetchUserFollowFailedError())
        return Result.success({
            id: trainer.id,
            name: trainer.name,
            location: trainer.location,
            followers: followers,
            userFollow: userFollow,
        })
    }
}
