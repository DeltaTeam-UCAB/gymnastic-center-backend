import { ApplicationService } from 'src/core/application/service/application.service'
import { SaveVideoDTO } from './types/dto'
import { SaveVideoResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { VideoRepository } from '../../repositories/video.repository'
import { VideoStorage } from 'src/core/application/storage/video/video.manager'
import { Video } from '../../models/video'

export class SaveVideoCommand
implements ApplicationService<SaveVideoDTO, SaveVideoResponse>
{
    constructor(
        private idGenerator: IDGenerator<string>,
        private videoRepository: VideoRepository,
        private videoStorage: VideoStorage,
    ) {}
    async execute(data: SaveVideoDTO): Promise<Result<SaveVideoResponse>> {
        const storageResult = await this.videoStorage.save(data)
        if (storageResult.isError()) return storageResult.convertToOther()
        const videoSource = storageResult.unwrap()
        const videoId = this.idGenerator.generate()
        const video = {
            id: videoId,
            src: videoSource.url,
        } satisfies Video
        const saveResult = await this.videoRepository.save(video)
        if (saveResult.isError()) return saveResult.convertToOther()
        return Result.success({
            id: videoId,
        })
    }
}
