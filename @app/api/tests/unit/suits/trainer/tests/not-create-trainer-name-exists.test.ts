import { CreateTrainerCommand } from '../../../../../src/trainer/application/commands/create/create.trainer.command'
import { CreateTrainerDto } from '../../../../../src/trainer/application/commands/create/types/dto'
import { IDGeneratorMock } from './utils/id.generator.mock'
import { TrainerRepositoryMock } from './utils/trainer.repository.mock'
import { TRAINER_NAME_INVALID } from '../../../../../src/trainer/application/errors/trainer.name.invalid'
import { createTrainer } from './utils/trainer.factory'
import { eventPublisherStub } from './utils/event.publisher.stup'
import { ImageRepositoryMock } from './utils/image.repository.mock'

export const name = 'Should not create trainer with an existing name'

export const body = async () => {
    const trainerData = {
        name: 'trainer name',
        location: 'test location A',
        image: 'cb10e704-dc7e-49bb-bd78-969a4e93e304',
    } satisfies CreateTrainerDto
    const trainerRepo = new TrainerRepositoryMock([
        createTrainer({
            name: 'trainer name',
        }),
    ])
    const result = await new CreateTrainerCommand(
        new IDGeneratorMock(),
        trainerRepo,
        new ImageRepositoryMock(),
        eventPublisherStub,
    ).execute(trainerData)
    result.handleError((e) => {
        lookFor(e.name).equals(TRAINER_NAME_INVALID)
    })
}
