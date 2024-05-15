import { Result } from 'src/core/application/result-handler/result.handler'
import { ApplicationService } from 'src/core/application/service/application.service'
import { VideoRepository } from '../../repositories/video.repository'
import { GetAllVideosResponse } from './types/response'

export class GetAllVideosQuery
    implements ApplicationService<undefined, GetAllVideosResponse>
{
    constructor(private videoRepository: VideoRepository) {}
    async execute(): Promise<Result<GetAllVideosResponse>> {
        const videos = await this.videoRepository.getAll()
        return Result.success(videos)
    }
}
