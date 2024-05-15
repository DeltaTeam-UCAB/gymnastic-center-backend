import { createVideo } from './utils/video.factory'
import { VideoRepositoryMock } from './utils/video.repository.mock'
import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { GetVideoByIdQuery } from '../../../../../src/video/application/queries/get-by-id/get.video.id.query'
import { GetVideoByIdResponse } from '../../../../../src/video/application/queries/get-by-id/types/response'

export const name = 'Should get video by id'
export const body = async () => {
    const video = createVideo()
    const videoRepo = new VideoRepositoryMock([video])
    const result: Result<GetVideoByIdResponse> = await new GetVideoByIdQuery(
        videoRepo,
    ).execute({
        id: video.id,
    })
    lookFor(result.unwrap()).toDeepEqual({
        id: video.id,
        src: video.src,
    })
}
