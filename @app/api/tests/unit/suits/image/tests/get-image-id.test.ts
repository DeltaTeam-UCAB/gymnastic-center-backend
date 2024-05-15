import { createImage } from './utils/image.factory'
import { ImageRepositoryMock } from './utils/image.repository.mock'
import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { GetImageByIdQuery } from '../../../../../src/image/application/queries/get-by-id/get.image.id.query'
import { GetImageByIdResponse } from '../../../../../src/image/application/queries/get-by-id/types/response'

export const name = 'Should get image by id'
export const body = async () => {
    const image = createImage()
    const imageRepo = new ImageRepositoryMock([image])
    const result: Result<GetImageByIdResponse> = await new GetImageByIdQuery(
        imageRepo,
    ).execute({
        id: image.id,
    })
    lookFor(result.unwrap()).toDeepEqual({
        id: image.id,
        src: image.src,
    })
}
