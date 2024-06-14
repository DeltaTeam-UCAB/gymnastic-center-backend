import { createTrainer } from './utils/trainer.factory'
import { TrainerRepositoryMock } from './utils/trainer.repository.mock'
import { ToggleFolowCommand } from '../../../../../src/trainer/application/commands/toggle-follow/toggle.follow.command'
import { ToggleFollowDTO } from '../../../../../src/trainer/application/commands/toggle-follow/types/dto'
import { FindTrainerQuery } from '../../../../../src/trainer/application/queries/find/find.trainer.query'

export const name = 'Should unfollow trainer'

export const body = async () => {
    const trainerId = '123456789'
    const userId = '987654321'
    const followData = {
        trainerId,
        userId,
    } satisfies ToggleFollowDTO
    const trainerRepo = new TrainerRepositoryMock([
        createTrainer({
            id: trainerId,
            name: 'test trainer',
            location: 'test location',
            followers: [userId],
        }),
    ])
    const toggleFollowCommand = new ToggleFolowCommand(
        trainerRepo,
        new FindTrainerQuery(trainerRepo),
    )
    await toggleFollowCommand.execute(followData)
    lookFor(await trainerRepo.getById(trainerId)).toDeepEqual({
        id: trainerId,
        name: 'test trainer',
        location: 'test location',
        followers: [],
    })
}
