import { createImage } from './utils/image.factory'
import { ImageRepositoryMock } from './utils/image.repository.mock'
import { GetAllImagesQuery } from '../../../../../src/image/application/queries/get-all/get.all.image.query'
import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { GetAllImagesResponse } from '../../../../../src/image/application/queries/get-all/types/response'

export const name = 'Should get all images'
export const body = async () => {
    const image = createImage()
    const imageRepo = new ImageRepositoryMock([image])
    const result: Result<GetAllImagesResponse> = await new GetAllImagesQuery(
        imageRepo,
    ).execute()
    lookFor(result.unwrap()).toDeepEqual([
        {
            id: image.id,
            src: image.src,
        },
    ])
}
