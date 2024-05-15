import { createVideo } from './utils/video.factory'
import { VideoRepositoryMock } from './utils/video.repository.mock'
import { GetAllVideosQuery } from '../../../../../src/video/application/queries/get-all/get.all.video.query'
import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { GetAllVideosResponse } from '../../../../../src/video/application/queries/get-all/types/response'

export const name = 'Should get all videos'
export const body = async () => {
    const video = createVideo()
    const videoRepo = new VideoRepositoryMock([video])
    const result: Result<GetAllVideosResponse> = await new GetAllVideosQuery(
        videoRepo,
    ).execute()
    lookFor(result.unwrap()).toDeepEqual([
        {
            id: video.id,
            src: video.src,
        },
    ])
}
