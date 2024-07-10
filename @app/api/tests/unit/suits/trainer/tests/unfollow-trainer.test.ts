import { createTrainer } from './utils/trainer.factory'
import { TrainerRepositoryMock } from './utils/trainer.repository.mock'
import { ToggleFolowCommand } from '../../../../../src/trainer/application/commands/toggle-follow/toggle.follow.command'
import { ToggleFollowDTO } from '../../../../../src/trainer/application/commands/toggle-follow/types/dto'
import { TrainerID } from '../../../../../src/trainer/domain/value-objects/trainer.id'
import { eventPublisherStub } from './utils/event.publisher.stup'

export const name = 'Should unfollow trainer'

export const body = async () => {
    const trainerId = '69aaf0f2-c41d-4b3d-8dae-55ba3b3baed1'
    const userId = '50ddbd33-a9c9-4087-b645-e2672f0bc2b1'
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
        eventPublisherStub,
    )
    await toggleFollowCommand.execute(followData)
    const trainer = await trainerRepo.getById(new TrainerID(trainerId))
    lookFor(trainer).toBeDefined()
    lookFor(trainer?.followers.length).equals(0)
}
