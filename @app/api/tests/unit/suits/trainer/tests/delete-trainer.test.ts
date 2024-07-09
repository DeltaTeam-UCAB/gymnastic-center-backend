import { TrainerRepositoryMock } from './utils/trainer.repository.mock'
import { DeleteTrainerCommand } from '../../../../../src/trainer/application/commands/delete/delete.trainer.command'
import { TrainerID } from '../../../../../src/trainer/domain/value-objects/trainer.id'
import { eventPublisherStub } from './utils/event.publisher.stup'
import { createTrainer } from './utils/trainer.factory'

export const name = 'Should delete trainer'
export const body = async () => {
    const trainerId = '92e9e433-51e9-4dfb-8d64-009102146c1b'
    const trainerRepo = new TrainerRepositoryMock([
        createTrainer({
            id: trainerId,
        }),
    ])
    const result = await new DeleteTrainerCommand(
        trainerRepo,
        eventPublisherStub,
    ).execute({ id: trainerId })
    lookFor(result.isError()).equals(false)
    const trainer = await trainerRepo.getById(new TrainerID(trainerId))
    lookFor(trainer).toBeUndefined()
}
