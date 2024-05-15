import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { SaveVideoCommand } from '../../../../../src/video/application/commands/save/save.video.command'
import { SaveVideoResponse } from '../../../../../src/video/application/commands/save/types/response'
import { IDGeneratorMock } from './utils/id.generator.mock'
import { VideoStorageMock } from './utils/video.manager.mock'
import { VideoRepositoryMock } from './utils/video.repository.mock'

export const name = 'Should create a video with path'
export const body = async () => {
    const videoRepo = new VideoRepositoryMock()
    const result: Result<SaveVideoResponse> = await new SaveVideoCommand(
        new IDGeneratorMock(),
        videoRepo,
        new VideoStorageMock(),
    ).execute({
        path: 'test path',
    })
    lookFor(result.isError()).equals(false)
    lookFor(await videoRepo.getAll()).toDeepEqual([
        {
            id: '1234567890',
            src: 'test path',
        },
    ])
}
