import { createTrainer } from './utils/trainer.factory'
import { TrainerRepositoryMock } from './utils/trainer.repository.mock'
import { ToggleFolowCommand } from '../../../../../src/trainer/application/commands/toggle-follow/toggle.follow.command'
import { ToggleFollowDTO } from '../../../../../src/trainer/application/commands/toggle-follow/types/dto'
import { TrainerID } from '../../../../../src/trainer/domain/value-objects/trainer.id'
import { ClientID } from '../../../../../src/trainer/domain/value-objects/client.id'
import { eventPublisherStub } from './utils/event.publisher.stup'

export const name = 'Should follow trainer'

export const body = async () => {
    const trainerId = '92e9e433-51e9-4dfb-8d64-009102146c1b'
    const userId = '14529b59-395f-460e-b2dc-bd4b17d7028d'
    const followData = {
        trainerId,
        userId,
    } satisfies ToggleFollowDTO
    const trainerRepo = new TrainerRepositoryMock([
        createTrainer({
            id: trainerId,
            name: 'test trainer',
            location: 'test location',
        }),
    ])
    const toggleFollowCommand = new ToggleFolowCommand(
        trainerRepo,
        eventPublisherStub,
    )
    await toggleFollowCommand.execute(followData)
    const trainer = await trainerRepo.getById(new TrainerID(trainerId))
    lookFor(trainer).toBeDefined()
    lookFor(trainer?.isFollowedBy(new ClientID(userId))).equals(true)
}
