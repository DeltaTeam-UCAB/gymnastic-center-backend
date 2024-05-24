import { createTrainer } from './utils/trainer.factory'
import { TrainerRepositoryMock } from './utils/trainer.repository.mock'
import { FindTrainerQuery } from '../../../../../src/trainer/application/queries/find/find.trainer.query'
import { FindTrainerDTO } from '../../../../../src/trainer/application/queries/find/types/dto'

export const name = 'Should find trainer not following'

export const body = async () => {
    const trainerId = '123456789'
    const userFollowsId = '987654321'
    const dataFollows = {
        trainerId,
        userId: userFollowsId,
    } satisfies FindTrainerDTO
    const trainerRepo = new TrainerRepositoryMock([
        createTrainer({
            id: trainerId,
            name: 'test trainer',
            location: 'test location',
            followers: ['123459876'],
        }),
    ])
    const findTrainerQuery = new FindTrainerQuery(trainerRepo)
    const resultFollows = await findTrainerQuery.execute(dataFollows)
    lookFor(resultFollows.unwrap()).toDeepEqual({
        id: trainerId,
        name: 'test trainer',
        location: 'test location',
        followers: ['123459876'].length,
        userFollow: false,
    })
}
