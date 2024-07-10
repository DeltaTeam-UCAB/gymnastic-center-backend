import { createTrainer } from './utils/trainer.factory'
import { TrainerRepositoryMock } from './utils/trainer.repository.mock'
import { FindTrainerQuery } from '../../../../../src/trainer/application/queries/find/find.trainer.query'
import { FindTrainerDTO } from '../../../../../src/trainer/application/queries/find/types/dto'
import { createImage } from './utils/image.factory'
import { ImageRepositoryMock } from './utils/image.repository.mock'

export const name = 'Should find trainer not following'

export const body = async () => {
    const image = createImage()
    const imageRepository = new ImageRepositoryMock([image])
    const trainerId = '14529b59-395f-460e-b2dc-bd4b17d7028d'
    const userFollowsId = '92e9e433-51e9-4dfb-8d64-009102146c1b'
    const dataFollows = {
        trainerId,
        userId: userFollowsId,
    } satisfies FindTrainerDTO
    const trainer = createTrainer({
        id: trainerId,
        name: 'test trainer',
        location: 'test location',
        followers: ['7a884fbd-8c0e-4991-9fad-bb1c040a1515'],
        image: image.id,
    })
    const trainerRepo = new TrainerRepositoryMock([trainer])
    const findTrainerQuery = new FindTrainerQuery(trainerRepo, imageRepository)
    const resultFollows = await findTrainerQuery.execute(dataFollows)
    lookFor(resultFollows.unwrap()).toDeepEqual({
        id: trainerId,
        name: trainer.name.name,
        location: trainer.location.location,
        followers: trainer.followers.length,
        userFollow: false,
        image: image.src,
    })
}
