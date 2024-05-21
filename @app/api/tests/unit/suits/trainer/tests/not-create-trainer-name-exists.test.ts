import { CreateTrainerCommand } from '../../../../../src/trainer/application/commands/create/create.trainer.command'
import { CreateTrainerDto } from '../../../../../src/trainer/application/commands/create/types/dto'
import { IDGeneratorMock } from './utils/id.generator.mock'
import { TrainerRepositoryMock } from './utils/trainer.repository.mock'
import { TRAINER_NAME_INVALID } from '../../../../../src/trainer/application/errors/trainer.name.invalid'
import { createTrainer } from './utils/trainer.factory'

export const name = 'Should not create trainer with an existing name'

export const body = async () => {
    const trainerData = {
        name: 'trainer name',
        location: 'test location A',
    } satisfies CreateTrainerDto
    const trainerRepo = new TrainerRepositoryMock([
        createTrainer({
            name: 'trainer name',
        }),
    ])
    const result = await new CreateTrainerCommand(
        new IDGeneratorMock(),
        trainerRepo,
    ).execute(trainerData)
    result.handleError((e) => {
        lookFor(e.name).equals(TRAINER_NAME_INVALID)
    })
}
