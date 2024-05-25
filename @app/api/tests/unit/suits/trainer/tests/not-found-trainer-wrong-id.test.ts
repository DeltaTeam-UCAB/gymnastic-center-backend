import { TRAINER_NOT_FOUND } from '../../../../../src/trainer/application/errors/trainer.not.found'
import { FindTrainerQuery } from '../../../../../src/trainer/application/queries/find/find.trainer.query'
import { FindTrainerDTO } from '../../../../../src/trainer/application/queries/find/types/dto'
import { createTrainer } from './utils/trainer.factory'
import { TrainerRepositoryMock } from './utils/trainer.repository.mock'

export const name = 'Should not find a trainer with unvalid ID'

export const body = async () => {
    const data = {
        userId: '9999999999',
        trainerId: '123456789',
    } satisfies FindTrainerDTO
    const trainerRepo = new TrainerRepositoryMock([
        createTrainer({
            id: '987654321',
        }),
    ])
    const result = await new FindTrainerQuery(trainerRepo).execute(data)
    lookFor(
        result.handleError((e) => {
            lookFor(e.name).equals(TRAINER_NOT_FOUND)
        }),
    )
}
