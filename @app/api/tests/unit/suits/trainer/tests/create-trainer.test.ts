import { CreateTrainerDto } from '../../../../../src/trainer/application/commands/create/types/dto'
import { TrainerRepositoryMock } from './utils/trainer.repository.mock'
import { CreateTrainerCommand } from '../../../../../src/trainer/application/commands/create/create.trainer.command'
import { IDGeneratorMock } from './utils/id.generator.mock'
import { TrainerID } from '../../../../../src/trainer/domain/value-objects/trainer.id'
import { eventPublisherStub } from './utils/event.publisher.stup'
import { createImage } from './utils/image.factory'
import { ImageRepositoryMock } from './utils/image.repository.mock'

export const name = 'Should create trainer with valid data'
export const body = async () => {
    const image = createImage()
    const imageRepository = new ImageRepositoryMock([image])
    const trainerId = '92e9e433-51e9-4dfb-8d64-009102146c1b'
    const trainerData = {
        name: 'trainer trainer',
        location: 'trainer location',
        image: image.id,
    } satisfies CreateTrainerDto
    const trainerRepo = new TrainerRepositoryMock()
    const result = await new CreateTrainerCommand(
        new IDGeneratorMock(trainerId),
        trainerRepo,
        imageRepository,
        eventPublisherStub,
    ).execute(trainerData)
    lookFor(result.isError()).equals(false)
    const trainer = await trainerRepo.getById(new TrainerID(trainerId))
    lookFor(trainer).toBeDefined()
    lookFor(trainer?.followers.length).equals(0)
}
