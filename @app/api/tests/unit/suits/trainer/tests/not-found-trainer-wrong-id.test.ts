import { TRAINER_NOT_FOUND } from '../../../../../src/trainer/application/errors/trainer.not.found'
import { FindTrainerQuery } from '../../../../../src/trainer/application/queries/find/find.trainer.query'
import { FindTrainerDTO } from '../../../../../src/trainer/application/queries/find/types/dto'
import { ImageRepositoryMock } from './utils/image.repository.mock'
import { createTrainer } from './utils/trainer.factory'
import { TrainerRepositoryMock } from './utils/trainer.repository.mock'

export const name = 'Should not find a trainer with unvalid ID'

export const body = async () => {
    const data = {
        userId: '92e9e433-51e9-4dfb-8d64-009102146c1b',
        trainerId: '14529b59-395f-460e-b2dc-bd4b17d7028d',
    } satisfies FindTrainerDTO
    const trainerRepo = new TrainerRepositoryMock([
        createTrainer({
            id: '7a884fbd-8c0e-4991-9fad-bb1c040a1515',
        }),
    ])
    const result = await new FindTrainerQuery(
        trainerRepo,
        new ImageRepositoryMock(),
    ).execute(data)
    lookFor(
        result.handleError((e) => {
            lookFor(e.name).equals(TRAINER_NOT_FOUND)
        }),
    )
}
