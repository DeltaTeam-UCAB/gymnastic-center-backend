import { CreateTrainerDto } from '../../../../../src/trainer/application/commands/create/types/dto'
import { TrainerRepositoryMock } from './utils/trainer.repository.mock'
import { CreateTrainerCommand } from '../../../../../src/trainer/application/commands/create/create.trainer.command'
import { IDGeneratorMock } from './utils/id.generator.mock'

export const name = 'Should create trainer with valid data'
export const body = async () => {
    const trainerId = '1234567890'
    const trainerData = {
        name: 'trainer trainer',
        location: 'trainer location',
    } satisfies CreateTrainerDto
    const trainerRepo = new TrainerRepositoryMock()
    await new CreateTrainerCommand(
        new IDGeneratorMock(trainerId),
        trainerRepo,
    ).execute(trainerData)
    lookFor(await trainerRepo.getById(trainerId)).toDeepEqual({
        id: trainerId,
        ...trainerData,
        followers: [],
    })
}
